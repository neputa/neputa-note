import { defineConfig, sharpImageService } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { register } from 'ts-node' // ts-nodeをインポート
register({ transpileOnly: true }) // ts-nodeを登録
import { remarkReadingTime } from './src/utils/readTime.ts'
import rehypeExternalLinks from 'rehype-external-links'
import remarkCodeBlock from './plugins/remark-code-title.ts'
import compress from '@playform/compress'
import react from '@astrojs/react'
import { promises as fs } from 'node:fs'
import path from 'node:path'

function PreloadCSSPlugin() {
  const cssCache = new Map()

  const shouldInline = (cssContent) => {
    return (
      cssContent.length <= 20000 ||
      cssContent.includes('aspect-ratio') ||
      cssContent.includes('min-h') ||
      cssContent.includes('grid-rows')
    )
  }

  const resolveCssHref = (href) => href.split('?')[0].split('#')[0]

  const getHtmlFilesRecursive = async (directory) => {
    const files = []
    const items = await fs.readdir(directory, { withFileTypes: true })

    for (const item of items) {
      const fullPath = path.join(directory, item.name)
      if (item.isDirectory()) {
        const subFiles = await getHtmlFilesRecursive(fullPath)
        files.push(...subFiles)
      } else if (item.name.endsWith('.html')) {
        files.push(fullPath)
      }
    }

    return files
  }

  return {
    name: 'preload-css',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const start = Date.now()
        const distDir = path.resolve(dir.pathname)
        const htmlFiles = await getHtmlFilesRecursive(distDir)

        let processedPages = 0
        let inlined = 0
        let preloaded = 0
        let missingCss = 0

        for (const filePath of htmlFiles) {
          let content = await fs.readFile(filePath, 'utf-8')

          if (!content.includes('rel="stylesheet"') && !content.includes("rel='stylesheet'")) {
            continue
          }

          const originalContent = content
          const noscriptTags = []

          content = content.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, (match) => {
            const placeholder = `<!--NOSCRIPT_PLACEHOLDER_${noscriptTags.length}-->`
            noscriptTags.push(match)
            return placeholder
          })

          const cssLinkRegex = /<link\s+(?:[^>]*\s+)?rel="stylesheet"(?:\s+[^>]*)?(?:\s+href="([^"]*\.css(?:\?[^"#>]*)?(?:#[^">]*)?)"|\s+href='([^']*\.css(?:\?[^'#>]*)?(?:#[^'>]*)?)')(?:[^>]*)?>/g
          const matches = [...content.matchAll(cssLinkRegex)]

          for (const match of matches) {
            const rawHref = match[1] || match[2]
            if (!rawHref) continue

            const href = resolveCssHref(rawHref)
            const cssPath = path.join(distDir, href)

            if (!cssCache.has(href)) {
              try {
                const cssContent = await fs.readFile(cssPath, 'utf-8')
                cssCache.set(href, cssContent)
              } catch {
                cssCache.set(href, null)
              }
            }

            const cssContent = cssCache.get(href)

            if (typeof cssContent === 'string' && shouldInline(cssContent)) {
              content = content.replace(match[0], `<style>${cssContent}</style>`)
              inlined++
            } else {
              if (cssContent === null) missingCss++
              content = content.replace(
                match[0],
                `<link href="${href}" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" fetchpriority="high"><noscript><link rel="stylesheet" href="${href}"></noscript>`
              )
              preloaded++
            }
          }

          content = content.replace(/<!--NOSCRIPT_PLACEHOLDER_(\d+)-->/g, (_, index) => {
            return noscriptTags[parseInt(index, 10)]
          })

          if (content !== originalContent) {
            await fs.writeFile(filePath, content, 'utf-8')
            processedPages++
          }
        }

        const elapsedMs = Date.now() - start
        console.log(
          `[preload-css] pages=${processedPages} inlined=${inlined} preloaded=${preloaded} missingCss=${missingCss} time=${elapsedMs}ms`
        )
      }
    }
  }
}

// https://astro.build/config
export default defineConfig({
  logLevel: process.env.ASTRO_LOG_LEVEL || 'info',
  devToolbar: {
    enabled: true
  },
  trailingSlash: 'always',
  site: 'https://www.neputa-note.net/',
  prefetch: {
    // 重要リンクのみ手動またはhoverでプリフェッチ（過剰プリロードを抑制）
    prefetchAll: false,
    defaultStrategy: 'hover'
  },
  // Write here your website url
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [remarkReadingTime, remarkCodeBlock],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank'
        }
      ]
    ],
    drafts: true
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    sitemap({
      filter: (page) =>
        page !== 'https://www.neputa-note.net/p/privacy-policy/' &&
        page !== 'https://www.neputa-note.net/p/contact/' &&
        page !== 'https://www.neputa-note.net/thanks/' &&
        page !== 'https://www.neputa-note.net/404' &&
        page !== 'https://www.neputa-note.net/error/',
      serialize(item) {
        item.lastmod = new Date()
        return item
      }
    }),
    mdx({
      syntaxHighlight: false,
      drafts: true
    }),
    react(),
    PreloadCSSPlugin(),
    compress({
      CSS: {
        level: 2,
        cache: true
      },
      JavaScript: {
        mangle: true,
        compress: {
          drop_console: true, // console.logを削除
          dead_code: true,
          unused: true,
          // 最適化レベルを向上
          passes: 2,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          drop_debugger: true
        },
        cache: true
      },
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
          collapseWhitespace: true,
          removeComments: true,
            // Vite/compress側でCSS/JSは個別最適化済みのため、HTML内再minifyは省略
            minifyCSS: false,
            minifyJS: false,
            // 並び替え系はCPU負荷が高く、圧縮効率への寄与が小さいため無効化
            removeRedundantAttributes: true,
            removeEmptyAttributes: false,
            sortAttributes: false,
            sortClassName: false
        },
        cache: true
      },
      Image: false,
      SVG: {
        cache: true,
        // SVG最適化を強化
        svgo: {
          plugins: [
            'preset-default',
            {
              name: 'removeViewBox',
              active: false
            }
          ]
        }
      },
      Logger: 0
    })
  ],
  image: {
    service: sharpImageService({
      cache: true, // キャッシュメカニズムを有効にする
      quality: 80, // より積極的な品質最適化（85→80）
      formats: ['avif', 'webp', 'jpeg'], // AVIF形式を優先
      // AVIFの積極的な利用を推進
      formatOptions: {
        avif: {
          quality: 75,
          effort: 4,
        },
        webp: {
          quality: 82,
          effort: 4,
        },
        jpeg: {
          quality: 85,
          mozjpeg: true,
        }
      }
    })
  },
  vite: {
    build: {
      // チャンクサイズ警告はやや緩めだが、過剰な手動分割は避ける
      chunkSizeWarningLimit: 500,
      target: 'es2022',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // View Transitionsの最適化：ClientRouterスクリプトを分離し、強制リフローを軽減
          manualChunks: (id) => {
            if (id.includes('astro/client-router') || id.includes('astro:transitions')) return 'router'
              if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react'
            if (id.includes('@pagefind')) return 'search'
            if (id.includes('react-hook-form') || id.includes('@hookform')) return 'forms'
            if (id.includes('clsx') || id.includes('tailwind-merge')) return 'utils-ui'
            if (id.includes('date-fns')) return 'utils-date'
            if (id.includes('node_modules')) return 'vendor'
          },
          experimentalMinChunkSize: 20000
        }
      }
    },
    // View Transitionsの強制リフロー軽減のためのモジュールプリロード最適化
    modulePreload: {
      polyfill: true,
      resolveDependencies: (url, deps, { hostId, hostType }) => {
        // Routerチャンクの優先度を下げて初期レンダリングブロックを防ぐ
        return deps.filter(dep => !dep.includes('router'))
      }
    }
  }
})
