begin;
-- Preserve tables from the earlier work; remove unused capabilities from this release.
revoke all on function public.wtech_submit_inquiry(jsonb),public.wtech_public_content(),public.wtech_accept_handover(uuid) from anon,authenticated;
drop policy records_read on public.wtech_records;
drop policy records_insert on public.wtech_records;
drop policy records_update on public.wtech_records;
create policy records_read on public.wtech_records for select to authenticated using(module='tasks' and wtech_private.has_role(array['owner','sales']));
create policy records_insert on public.wtech_records for insert to authenticated with check(module='tasks' and wtech_private.has_role(array['owner','sales']));
create policy records_update on public.wtech_records for update to authenticated using(module='tasks' and wtech_private.has_role(array['owner','sales'])) with check(module='tasks' and wtech_private.has_role(array['owner','sales']));
create or replace function wtech_private.lead_update() returns trigger language plpgsql set search_path='' as $$
begin new.version=old.version+1;return new;end $$;
create function public.wtech_capture_lead(d jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare saved public.leads; lead_id bigint; contact_value text; digest text;wait integer;
begin
 if d is null or not(d ?& array['kind','locale','idempotencyKey','privacyAccepted','channel']) or d->>'privacyAccepted' is distinct from 'true' or octet_length(d::text)>16000 or coalesce(d->>'kind','') not in('contact','call','audit') or coalesce(d->>'locale','') not in('ro','ru','en') or coalesce(d->>'channel','') not in('phone','email','whatsapp') or length(coalesce(d->>'message',''))>3000 or length(coalesce(d->>'name',''))>120 or length(coalesce(d->>'company',''))>160 or length(coalesce(d->>'interest',''))>200 then raise exception 'invalid_lead';end if;
 if d->>'kind'<>'audit' and length(coalesce(trim(d->>'name'),''))<2 then raise exception 'invalid_name';end if;
 contact_value=case when d->>'channel'='email' then lower(trim(d->>'email')) else trim(d->>'phone') end;
 if contact_value is null or length(contact_value)>160 or (d->>'channel'='email' and contact_value!~'^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$') or (d->>'channel'<>'email' and contact_value!~'^\+?[0-9]{8,15}$') then raise exception 'invalid_contact';end if;
 digest=md5((d-'ip')::text);
 perform pg_advisory_xact_lock(hashtextextended(d->>'idempotencyKey',0));
 select * into saved from public.leads where idempotency_key=(d->>'idempotencyKey')::uuid;
 if saved.id is not null then if saved.request_hash<>digest then raise exception 'idempotency_conflict';end if;return jsonb_build_object('id',saved.id,'duplicate',true);end if;
 wait=public.consume_rate_limit('lead:'||md5(contact_value),3,600);if wait>0 then raise exception 'rate_limited';end if;
 insert into public.leads(kind,locale,name,phone,email,company,message,interest,url,ip,channel,source,idempotency_key,request_hash,privacy_version,privacy_accepted_at,marketing_consent)
 values(d->>'kind',d->>'locale',nullif(trim(d->>'name'),''),nullif(d->>'phone',''),nullif(lower(trim(d->>'email')),''),d->>'company',d->>'message',d->>'interest',d->>'url','redacted',d->>'channel',left(d->>'source',300),(d->>'idempotencyKey')::uuid,digest,'2026-09-23',now(),coalesce((d->>'marketingConsent')::boolean,false)) returning id into lead_id;
 insert into public.wtech_audit(entity,entity_id,action,after_data) values('leads',lead_id::text,'PUBLIC_REQUEST',jsonb_build_object('source',d->>'source','privacyVersion','2026-09-23'));
 return jsonb_build_object('id',lead_id,'duplicate',false);
end $$;
revoke all on function public.wtech_capture_lead(jsonb) from public;
grant execute on function public.wtech_capture_lead(jsonb) to anon,authenticated;
commit;
