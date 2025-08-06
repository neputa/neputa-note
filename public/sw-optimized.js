const CACHE_NAME = 'neputa-cache-v3'
const RUNTIME_CACHE = 'neputa-runtime-v3'
const JS_CACHE = 'neputa-js-v3'
const CSS_CACHE = 'neputa-css-v3'
const IMAGE_CACHE = 'neputa-images-v3'

// より積極的な静的リソースキャッシュ
const STATIC_ASSETS = [
  '/',
  '/404.html',
  '/open-graph.png',
  '/favicon.svg',
  '/favicon.ico',
  '/_astro/_slug_.css',
  // 重要なJavaScriptチャンクをプリキャッシュ
  '/_astro/vendor-react.js',
  '/_astro/vendor-react-dom.js',
  '/_astro/vendor-motion.js',
  '/_astro/utils-ui.js'
]

// インストール時に重要なリソースをキャッシュ
self.addEventListener('install', (event) => {
  console.log('🔧 SW installing...')
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      try {
        await cache.addAll(STATIC_ASSETS)
        console.log('📦 Precached static assets')
      } catch (error) {
        console.warn('⚠️ Some assets failed to precache:', error)
        // エラーがあっても続行
      }
      await self.skipWaiting()
    })()
  )
})

// アクティベーション時に古いキャッシュをクリーンアップ
self.addEventListener('activate', (event) => {
  console.log('🚀 SW activated')
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      const cachesToDelete = cacheNames.filter(name =>
        !name.includes('v3') && (
          name.includes('neputa-cache') ||
          name.includes('neputa-runtime') ||
          name.includes('neputa-js') ||
          name.includes('neputa-css') ||
          name.includes('neputa-images')
        )
      )

      await Promise.all(
        cachesToDelete.map(cacheName => {
          console.log('🗑️ Deleting old cache:', cacheName)
          return caches.delete(cacheName)
        })
      )

      await self.clients.claim()
    })()
  )
})

// より高度なフェッチハンドリング
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 外部リソースはスキップ
  if (url.origin !== location.origin) {
    return
  }

  event.respondWith(
    (async () => {
      try {
        // HTMLページ: Network First with fallback
        if (request.destination === 'document') {
          try {
            const networkResponse = await fetch(request)
            if (networkResponse.ok) {
              const cache = await caches.open(RUNTIME_CACHE)
              await cache.put(request, networkResponse.clone())
            }
            return networkResponse
          } catch {
            const cachedResponse = await caches.match(request)
            return cachedResponse || await caches.match('/404.html')
          }
        }

        // 重要なJavaScript: Cache First with network fallback
        if (request.destination === 'script' &&
            (url.pathname.includes('vendor-react') ||
             url.pathname.includes('vendor-motion') ||
             url.pathname.includes('utils-ui'))) {
          const cache = await caches.open(JS_CACHE)
          const cachedResponse = await cache.match(request)

          if (cachedResponse) {
            // バックグラウンドで更新をチェック
            fetch(request).then(response => {
              if (response.ok) {
                cache.put(request, response.clone())
              }
            }).catch(() => {})

            return cachedResponse
          }

          const networkResponse = await fetch(request)
          if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone())
          }
          return networkResponse
        }

        // その他のJavaScript: Stale While Revalidate
        if (request.destination === 'script') {
          const cache = await caches.open(JS_CACHE)
          const cachedResponse = await cache.match(request)

          const networkPromise = fetch(request).then(response => {
            if (response.ok) {
              cache.put(request, response.clone())
            }
            return response
          }).catch(() => cachedResponse)

          return cachedResponse || await networkPromise
        }

        // CSS: Cache First
        if (request.destination === 'style' || url.pathname.includes('.css')) {
          const cache = await caches.open(CSS_CACHE)
          const cachedResponse = await cache.match(request)

          if (cachedResponse) {
            return cachedResponse
          }

          const networkResponse = await fetch(request)
          if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone())
          }
          return networkResponse
        }

        // 画像: Cache First with long-term storage
        if (request.destination === 'image') {
          const cache = await caches.open(IMAGE_CACHE)
          const cachedResponse = await cache.match(request)

          if (cachedResponse) {
            return cachedResponse
          }

          const networkResponse = await fetch(request)
          if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone())
          }
          return networkResponse
        }

        // その他のリソース: Network First
        const networkResponse = await fetch(request)
        if (networkResponse.ok) {
          const cache = await caches.open(RUNTIME_CACHE)
          await cache.put(request, networkResponse.clone())
        }
        return networkResponse

      } catch (error) {
        console.error('SW fetch error:', error)
        const cachedResponse = await caches.match(request)
        return cachedResponse || new Response('Network error', { status: 503 })
      }
    })()
  )
})
