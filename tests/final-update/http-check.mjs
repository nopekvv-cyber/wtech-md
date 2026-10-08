import {writeFileSync} from 'node:fs';
const base=process.env.BASE_URL||'http://localhost:3100';const results=[];
for(const path of ['/','/ru','/en','/servicii','/lucrari','/preturi','/contact','/audit','/despre','/blog','/confidentialitate','/termeni','/cookie-uri','/rambursari','/consimtamant-sms','/ru/uslugi','/ru/raboty','/en/services','/en/work','/servicii/crm-dashboard','/servicii/ai-seo','/sitemap.xml','/robots.txt']){const r=await fetch(base+path);results.push({path,status:r.status,ok:r.status===200});}
for(const path of ['/admin/api','/admin/leads.csv']){const r=await fetch(base+path);results.push({path,status:r.status,ok:r.status===401});}
const post=(p,d,origin=base)=>fetch(base+p,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,'x-real-ip':'192.0.2.77'},body:JSON.stringify(d)});
for(const [name,d,origin,expected] of [['foreign',{question:'Hello WTECH'},'https://foreign.test',403],['empty',{question:''},base,400],['long',{question:'a'.repeat(801)},base,400],['fallback',{question:'Ce servicii oferă WTECH?'},base,503]]){const r=await post('/api/faq',d,origin);results.push({test:'FAQ '+name,status:r.status,ok:r.status===expected});}
const r=await post('/admin/api',{action:'lead',data:{id:1}});results.push({test:'admin anonymous mutation',status:r.status,ok:r.status===401});
writeFileSync('../local-http-results.json',JSON.stringify({base,at:new Date().toISOString(),results},null,2));console.log(JSON.stringify({passed:results.filter(r=>r.ok).length,failed:results.filter(r=>!r.ok)}));if(results.some(r=>!r.ok))process.exitCode=1;
