const V='drama-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
// เครือข่ายก่อน ถ้าออฟไลน์ใช้ของที่แคชไว้ (ไม่แตะคำขอไป Gemini API)
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{
    const copy=res.clone();caches.open(V).then(c=>c.put(r,copy));return res;
  }).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
});
