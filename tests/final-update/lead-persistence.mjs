import {randomUUID} from 'node:crypto';
import {writeFileSync} from 'node:fs';
const base=process.env.BASE_URL||'http://localhost:3100';
const body={kind:'contact',locale:'ro',name:'WTECH QA idempotency',phone:'',email:'qa-wtech-idempotency-verified@example.invalid',company:'WTECH QA',message:'Synthetic acceptance test. Do not contact.',interest:'QA only',channel:'email',idempotencyKey:randomUUID(),source:'qa/final-update/idempotency',startedAt:Date.now()-10000,privacyAccepted:true,marketingConsent:false};
const results=[];for(const [name,data,want] of [['saved',body,200],['retry',body,200],['conflict',{...body,message:'Changed payload'},409]]){const r=await fetch(base+'/api/lead',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,'x-forwarded-for':'192.0.2.92'},body:JSON.stringify(data)});const result=await r.json();results.push({test:name,status:r.status,passed:r.status===want,...result});}
writeFileSync('../lead-persistence-results.json',JSON.stringify({base,results},null,2));console.log(results);if(results.some(r=>!r.passed))process.exitCode=1;
