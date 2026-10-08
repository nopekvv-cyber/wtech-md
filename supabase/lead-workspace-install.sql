-- Consolidated narrow-scope installation, AFTER supabase/schema.sql on an original WTECH database.
-- The current WTECH database is already migrated; this is review/recovery source, not a command to rerun blindly.
begin;
create schema if not exists wtech_private;
revoke all on schema wtech_private from public,anon;
grant usage on schema wtech_private to authenticated;
create table if not exists public.wtech_members(user_id uuid primary key,role text not null check(role in('owner','sales','delivery','finance','client')),active boolean not null default true,created_at timestamptz not null default now());
alter table public.wtech_members enable row level security;
revoke all on public.wtech_members from anon,authenticated;
grant select on public.wtech_members to authenticated;
create or replace function wtech_private.has_role(allowed text[]) returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.wtech_members where user_id=auth.uid() and active and role=any(allowed)) and exists(select 1 from auth.sessions where user_id=auth.uid() and id=(auth.jwt()->>'session_id')::uuid)
$$;
revoke all on function wtech_private.has_role(text[]) from public,anon;
grant execute on function wtech_private.has_role(text[]) to authenticated;
drop policy if exists member_self on public.wtech_members;
create policy member_self on public.wtech_members for select to authenticated using(user_id=(select auth.uid()) and wtech_private.has_role(array['owner','sales','delivery','finance','client']));
alter table public.leads add column if not exists channel text,add column if not exists source text,add column if not exists idempotency_key uuid unique,add column if not exists request_hash text,add column if not exists privacy_version text,add column if not exists privacy_accepted_at timestamptz,add column if not exists marketing_consent boolean,add column if not exists stage text not null default 'new' check(stage in('new','qualified','proposal','negotiation','won','lost','nurture')),add column if not exists owner_id uuid,add column if not exists next_action text,add column if not exists follow_up_at timestamptz,add column if not exists value numeric(14,2) not null default 0 check(value>=0),add column if not exists currency text not null default 'EUR' check(currency~'^[A-Z]{3}$'),add column if not exists version integer not null default 1;
revoke all on public.leads,public.settings,public.rate_limits from anon;
grant select,update on public.leads to authenticated;
drop policy if exists leads_read on public.leads;
drop policy if exists leads_update on public.leads;
create policy leads_read on public.leads for select to authenticated using(wtech_private.has_role(array['owner','sales']));
create policy leads_update on public.leads for update to authenticated using(wtech_private.has_role(array['owner','sales'])) with check(wtech_private.has_role(array['owner','sales']));
create table if not exists public.wtech_records(id uuid primary key default gen_random_uuid(),module text not null check(module='tasks'),title text not null check(length(title) between 2 and 180),status text not null default 'open',lead_id bigint references public.leads(id),owner_id uuid,due_at timestamptz,payload jsonb not null default '{}' check(jsonb_typeof(payload)='object' and octet_length(payload::text)<=20000),version integer not null default 1,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
alter table public.wtech_records enable row level security;
revoke all on public.wtech_records from anon,authenticated;
grant select,insert,update on public.wtech_records to authenticated;
create index if not exists wtech_records_lead on public.wtech_records(lead_id);
create index if not exists wtech_records_module_due on public.wtech_records(module,due_at);
drop policy if exists records_read on public.wtech_records;
drop policy if exists records_insert on public.wtech_records;
drop policy if exists records_update on public.wtech_records;
create policy records_read on public.wtech_records for select to authenticated using(module='tasks' and wtech_private.has_role(array['owner','sales']));
create policy records_insert on public.wtech_records for insert to authenticated with check(module='tasks' and wtech_private.has_role(array['owner','sales']));
create policy records_update on public.wtech_records for update to authenticated using(module='tasks' and wtech_private.has_role(array['owner','sales'])) with check(module='tasks' and wtech_private.has_role(array['owner','sales']));
create table if not exists public.wtech_audit(id bigint generated always as identity primary key,actor_id uuid,entity text not null,entity_id text not null,action text not null,before_data jsonb,after_data jsonb,created_at timestamptz not null default now());
alter table public.wtech_audit enable row level security;
revoke all on public.wtech_audit from anon,authenticated;
grant select,insert on public.wtech_audit to authenticated;
grant usage on sequence public.wtech_audit_id_seq to authenticated;
drop policy if exists audit_read on public.wtech_audit;
drop policy if exists audit_insert on public.wtech_audit;
create policy audit_read on public.wtech_audit for select to authenticated using(wtech_private.has_role(array['owner']));
create policy audit_insert on public.wtech_audit for insert to authenticated with check(actor_id=auth.uid() and wtech_private.has_role(array['owner','sales']));
create or replace function wtech_private.audit_change() returns trigger language plpgsql security definer set search_path='' as $$
begin insert into public.wtech_audit(actor_id,entity,entity_id,action,before_data,after_data) values(auth.uid(),tg_table_name,new.id::text,tg_op,case when tg_op='UPDATE' then to_jsonb(old) else null end,to_jsonb(new));return new;end $$;
revoke all on function wtech_private.audit_change() from public,anon,authenticated;
create or replace function wtech_private.lead_update() returns trigger language plpgsql set search_path='' as $$
begin new.version=old.version+1;return new;end $$;
create or replace function wtech_private.note_version() returns trigger language plpgsql set search_path='' as $$
begin if new.module<>'tasks' then raise exception 'unsupported_module';end if;if tg_op='UPDATE' then new.version=old.version+1;end if;new.updated_at=now();return new;end $$;
revoke all on function wtech_private.lead_update(),wtech_private.note_version() from public,anon,authenticated;
drop trigger if exists lead_version on public.leads;
drop trigger if exists lead_audit on public.leads;
drop trigger if exists record_version on public.wtech_records;
drop trigger if exists record_audit on public.wtech_records;
create trigger lead_version before update on public.leads for each row execute function wtech_private.lead_update();
create trigger lead_audit after update on public.leads for each row execute function wtech_private.audit_change();
create trigger record_version before insert or update on public.wtech_records for each row execute function wtech_private.note_version();
create trigger record_audit after insert or update on public.wtech_records for each row execute function wtech_private.audit_change();
create or replace function public.wtech_rate_gate(key_hash text,kind text) returns integer language plpgsql security definer set search_path='' as $$
begin if key_hash is null or key_hash !~ '^[a-f0-9]{64}$' or kind is null or kind not in('faq','intake','login') then raise exception 'invalid_gate';end if;return public.consume_rate_limit('wtech:'||kind||':'||key_hash,case when kind='faq' then 8 else 6 end,600);end $$;
revoke all on function public.consume_rate_limit(text,integer,integer),public.wtech_rate_gate(text,text) from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text,integer,integer) to service_role;
grant execute on function public.wtech_rate_gate(text,text) to anon,authenticated;
create or replace function public.wtech_public_settings() returns table(key text,value text) language sql stable security definer set search_path='' as $$select key,value from public.settings where key like 'contact.%' or key like 'social.%' or key like 'proof.%'$$;
revoke all on function public.wtech_public_settings() from public;
grant execute on function public.wtech_public_settings() to anon,authenticated;
commit;
-- Apply only the CREATE OR REPLACE wtech_capture_lead definition and grants from lead-workspace-scope.sql.
-- That historical scope file also revokes earlier capabilities and is not a clean-database install script.
