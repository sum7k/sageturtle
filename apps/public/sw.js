// The service worker. It makes the app installable and lets it open without network.
// Pages: the network first, so a new release shows at once; the saved copy when there is no network.
// Files with a hashed name (/_next/static) never change: the saved copy first.
// /api and /admin are never saved.
const CACHE = "bodhilabs-v2";
const PAGES = ["/", "/app", "/start", "/home", "/book", "/wish"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PAGES)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) return;
  const keep = (res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return res;
  };
  if (url.pathname.startsWith("/_next/static/")) {
    e.respondWith(caches.match(e.request).then((hit) => hit ?? fetch(e.request).then(keep)));
    return;
  }
  e.respondWith(fetch(e.request).then(keep).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit ?? caches.match("/home"))));
});
