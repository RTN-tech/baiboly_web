const CACHE_NAME = 'ny-baiboly-v2'

// Assets to pre-cache on install (the app shell + splash screen)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/icons/splash-ios.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/manifest.json'
]

// Install event: pre-cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch event: serve cached content when offline
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // For Bible JSON data files: cache-first strategy
  if (url.pathname.includes('/Testameta/') && url.pathname.endsWith('.json')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // For static assets (JS, CSS, SVG, fonts): cache-first
  if (
    url.pathname.match(/\.(js|css|svg|woff2?|ttf|png|jpg|ico)$/) ||
    url.pathname.startsWith('/assets/') ||
    url.pathname === '/manifest.json'
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // For navigation requests: network-first with SPA fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html')
      })
    )
    return
  }

  // Default: network-first, fall back to cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request)
    })
  )
})
