// The service worker. It makes the app installable.
// Until the first version is released nothing is saved on the phone: every page and file comes fresh from the
// network, so a new release shows at once. The cost: the app does not open without network. (sumeet, 2026-11-28)
// To save again later: bring back the cache from git history (commit c11a386).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: "no-store" }));
});
