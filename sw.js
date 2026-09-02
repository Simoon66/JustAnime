// This file intentionally contains no third-party service-worker code.
// It safely replaces and removes legacy service workers that could trigger redirects.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration.unregister());
});
