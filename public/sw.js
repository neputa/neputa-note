// Service Worker for Neputa Note
// Enhanced caching strategy for PageSpeed optimization

const CACHE_NAME = 'neputa-note-v1'
const STATIC_CACHE = 'static-v1'
const RUNTIME_CACHE = 'runtime-v1'

// Critical resources to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/offline/',
  '/manifest.json'
]

// Assets to cache with different strategies
const CACHE_STRATEGIES = {
  // Images: Cache First with 30 days expiry
  images: {
    pattern: /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i,
    strategy: 'CacheFirst',
    expiry: 30 * 24 * 60 * 60 * 1000 // 30 days
  },
  // JavaScript/CSS: Stale While Revalidate
  assets: {
    pattern: /\.(js|css)$/i,
    strategy: 'StaleWhileRevalidate',
    expiry: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  // Fonts: Cache First with long expiry
  fonts: {
    pattern: /\.(woff2|woff|ttf|eot)$/i,
    strategy: 'CacheFirst',
    expiry: 365 * 24 * 60 * 60 * 1000 // 1 year
  },
  // HTML pages: Network First
  pages: {
    pattern: /\.html$/i,
    strategy: 'NetworkFirst',
    expiry: 24 * 60 * 60 * 1000 // 1 day
  }
}

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...')

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Caching critical assets...')
        return cache.addAll(CRITICAL_ASSETS)
      })
      .then(() => {
        console.log('✅ Critical assets cached')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...')

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Old caches cleaned up')
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and Chrome extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return
  }

  // Determine cache strategy based on file type
  const strategy = getCacheStrategy(url.pathname)

  if (strategy) {
    event.respondWith(handleRequest(request, strategy))
  }
})

// Get appropriate cache strategy for a given URL
function getCacheStrategy(pathname) {
  for (const [name, config] of Object.entries(CACHE_STRATEGIES)) {
    if (config.pattern.test(pathname)) {
      return config
    }
  }
  return CACHE_STRATEGIES.pages // Default to pages strategy
}

// Handle request based on cache strategy
async function handleRequest(request, strategy) {
  const cacheName = getCacheName(request.url)
  const cache = await caches.open(cacheName)

  switch (strategy.strategy) {
    case 'CacheFirst':
      return cacheFirst(request, cache, strategy)

    case 'NetworkFirst':
      return networkFirst(request, cache, strategy)

    case 'StaleWhileRevalidate':
      return staleWhileRevalidate(request, cache, strategy)

    default:
      return fetch(request)
  }
}

// Cache First strategy
async function cacheFirst(request, cache, strategy) {
  const cached = await cache.match(request)

  if (cached && !isExpired(cached, strategy.expiry)) {
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return cached || new Response('Offline', { status: 503 })
  }
}

// Network First strategy
async function networkFirst(request, cache, strategy) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await cache.match(request)
    return cached || new Response('Offline', { status: 503 })
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cache, strategy) {
  const cached = await cache.match(request)

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => null)

  return cached || await fetchPromise || new Response('Offline', { status: 503 })
}

// Get cache name based on URL
function getCacheName(url) {
  if (CRITICAL_ASSETS.some(asset => url.includes(asset))) {
    return STATIC_CACHE
  }
  return RUNTIME_CACHE
}

// Check if cached response is expired
function isExpired(response, maxAge) {
  const cachedDate = response.headers.get('date')
  if (!cachedDate) return true

  const cacheTime = new Date(cachedDate).getTime()
  const now = Date.now()

  return (now - cacheTime) > maxAge
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered')
    // Handle offline actions when back online
  }
})

// Push notifications support
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/favicon.png',
      badge: '/favicon.png'
    }

    event.waitUntil(
      self.registration.showNotification('Neputa Note', options)
    )
  }
})

console.log('🚀 Service Worker loaded and ready!')
