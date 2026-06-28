// Service Worker - A.H.S Ponto
// Estratégia: network-first (sempre busca a versão mais nova quando online;
// usa cache apenas como reserva quando estiver sem internet).
const CACHE = "ahs-ponto-v1";
const SHELL = ["ahs-ponto.html", "manifest.json", "ícone-192.png", "ícone-512.png"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL).catch(() => {}))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy).catch(() => {}));
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("ahs-ponto.html")))
  );
});
