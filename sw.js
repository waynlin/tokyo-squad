/* Tokyo Squad service worker：讓頁面在沒訊號時也能打開 */
const V='tk-v1',STATIC='tk-static-v1';
const CDN=/(gstatic\.com|googleapis\.com|jsdelivr\.net|maplestory\.io|fonts\.)/;
const SKIP=/(firebaseio\.com|firebasedatabase\.app|open-meteo\.com|frankfurter|exchangerate|er-api|identitytoolkit|securetoken|google\.com\/maps|maps\.google)/;
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(['./','index.html','manifest.webmanifest']).catch(()=>{})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==STATIC).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const trim=async(name,max)=>{const c=await caches.open(name),ks=await c.keys();if(ks.length>max)for(const k of ks.slice(0,ks.length-max))await c.delete(k)};
function netFirst(req,ms){return new Promise(res=>{let done=false;const fb=()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('index.html')).then(r=>{if(!done){done=true;res(r||Response.error())}});
 const t=setTimeout(fb,ms);
 fetch(req).then(r=>{clearTimeout(t);if(r&&r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(req,cp))}if(!done){done=true;res(r)}}).catch(()=>{clearTimeout(t);fb()})})}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(SKIP.test(u.href))return;
 if(u.origin===location.origin){
  if(r.mode==='navigate'||/index\.html$|\/$/.test(u.pathname)){e.respondWith(netFirst(r,3500));return}
  e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(r);const net=fetch(r).then(x=>{if(x&&x.ok)c.put(r,x.clone());return x}).catch(()=>hit);return hit||net}));return}
 if(CDN.test(u.hostname)){e.respondWith(caches.open(STATIC).then(async c=>{const hit=await c.match(r);if(hit)return hit;try{const x=await fetch(r);if(x&&(x.ok||x.type==='opaque')){c.put(r,x.clone());trim(STATIC,300)}return x}catch(err){return hit||Response.error()}}))}
});
