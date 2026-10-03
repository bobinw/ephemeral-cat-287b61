const CACHE='silva-reader-shell-v1';
const ASSETS=['./','./index.html','./style.css','./app.js','./stories.json','./manifest.webmanifest','./icon.svg','./icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('silva-reader-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):Response.error())))});
self.addEventListener('message',e=>{if(e.data?.type==='CHECK_OFFLINE')e.waitUntil(caches.open(CACHE).then(async c=>{const found=await Promise.all(ASSETS.map(a=>c.match(a)));e.source?.postMessage({type:found.every(Boolean)?'OFFLINE_READY':'OFFLINE_FAILED'})}))});
