export default {
  async fetch(request) {
    const response = await fetch(request)

    // セキュリティヘッダーを追加
    const newHeaders = new Headers(response.headers)
    newHeaders.set('X-Frame-Options', 'DENY')
    newHeaders.set('X-Content-Type-Options', 'nosniff')
    newHeaders.set('X-XSS-Protection', '1; mode=block')
    newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    newHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    // 静的ファイルのキャッシュヘッダー
    const url = new URL(request.url)
    const extension = url.pathname.split('.').pop()

    if (['js', 'css', 'woff2'].includes(extension)) {
      newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable')
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    })
  }
}
