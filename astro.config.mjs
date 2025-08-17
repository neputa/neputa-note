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
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import inline from '@playform/inline'
import { promises as fs } from 'fs'
import path from 'path'

function PreloadCSSPlugin() {
  return {
    name: 'preload-css',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        console.log('🔧 PreloadCSSPlugin: Starting CSS optimization...')

        // URLオブジェクトを文字列パスに変換
        const distDir = path.resolve(dir.pathname)
        console.log(`📁 Processing directory: ${distDir}`)

        // 再帰的にHTMLファイルを取得する関数
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

        // dist ディレクトリ内の HTML ファイルを再帰的に取得
        const htmlFiles = await getHtmlFilesRecursive(distDir)
        console.log(`📄 Found ${htmlFiles.length} HTML files to process`)

        let totalReplacements = 0
        let totalInlined = 0

        for (const filePath of htmlFiles) {
          const relativePath = path.relative(distDir, filePath)
          console.log(`🔄 Processing: ${relativePath}`)

          // HTML内容を読み込む
          let content = await fs.readFile(filePath, 'utf-8')
          const originalContent = content

          // noscriptタグ内のlinkタグを一時的に保護
          const noscriptTags = []
          content = content.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, (match, offset) => {
            const placeholder = `<!--NOSCRIPT_PLACEHOLDER_${noscriptTags.length}-->`
            noscriptTags.push(match)
            return placeholder
          })

          // CSSリンクを検索してインライン化または preload に変換
          const cssLinkRegex = /<link\s+(?:[^>]*\s+)?rel="stylesheet"(?:\s+[^>]*)?(?:\s+href="([^"]*\.css)"|\s+href='([^']*\.css)')(?:[^>]*)?>/g
          const matches = [...content.matchAll(cssLinkRegex)]

          for (const match of matches) {
            const href = match[1] || match[2]
            if (href) {
              try {
                // CSSファイルのパスを解決
                const cssPath = path.join(distDir, href)

                // ファイルが存在するかチェック
                try {
                  await fs.access(cssPath)
                  const cssContent = await fs.readFile(cssPath, 'utf-8')

                  // Critical CSSのサイズ制限を拡大し、レイアウト関連CSSを優先的にインライン化
                  if (cssContent.length <= 20000 || cssContent.includes('aspect-ratio') || cssContent.includes('min-h') || cssContent.includes('grid-rows')) {
                    content = content.replace(match[0], `<style>${cssContent}</style>`)
                    totalInlined++
                    console.log(`  🎨 Inlined CSS: ${href} (${cssContent.length} bytes)`)
                  } else {
                    // 大きなCSSファイルはpreloadに変換（より高い優先度を設定）
                    content = content.replace(match[0], `<link href="${href}" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" fetchpriority="high"><noscript><link rel="stylesheet" href="${href}"></noscript>`)
                    console.log(`  ⚡ Preloaded CSS: ${href} (${cssContent.length} bytes)`)
                  }
                } catch (accessError) {
                  // ファイルが見つからない場合はpreloadに変換
                  content = content.replace(match[0], `<link href="${href}" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" fetchpriority="high">`)
                  console.log(`  ⚠️ CSS not found, using preload: ${href}`)
                }
              } catch (error) {
                console.log(`  ❌ Error processing CSS: ${href}`, error.message)
                // エラーの場合もpreloadに変換
                content = content.replace(match[0], `<link href="${href}" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" fetchpriority="high">`)
              }
              totalReplacements++
            }
          }

          // noscriptタグを復元
          content = content.replace(/<!--NOSCRIPT_PLACEHOLDER_(\d+)-->/g, (match, index) => {
            return noscriptTags[parseInt(index)]
          })

          if (matches.length > 0) {
            console.log(`  ✅ ${relativePath}: ${matches.length} CSS links processed`)
          } else {
            console.log(`  ⚪ ${relativePath}: No CSS links found`)
          }

          // HTMLを上書き保存
          if (content !== originalContent) {
            await fs.writeFile(filePath, content, 'utf-8')
          }
        }

        console.log(`🎉 PreloadCSSPlugin: Complete! ${totalInlined} CSS files inlined, ${totalReplacements - totalInlined} converted to preload`)
      }
    }
  }
}

// https://astro.build/config
export default defineConfig({
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
    partytown({
      config: {
        forward: ['dataLayer.push']
      }
    }),
    inline(),
    PreloadCSSPlugin(),
    // compress({
    //   CSS: {
    //     level: 2,
    //     cache: true
    //   },
    //   JavaScript: {
    //     mangle: true,
    //     compress: {
    //       drop_console: true, // console.logを削除
    //       dead_code: true,
    //       unused: true,
    //       // 最適化レベルを向上
    //       passes: 2,
    //       pure_funcs: ['console.log', 'console.info', 'console.debug'],
    //       drop_debugger: true
    //     },
    //     cache: true
    //   },
    //   HTML: {
    //     'html-minifier-terser': {
    //       removeAttributeQuotes: false,
    //       collapseWhitespace: true,
    //       removeComments: true,
    //       minifyCSS: true,
    //       minifyJS: true,
    //       // HTMLの最適化を強化
    //       removeRedundantAttributes: true,
    //       removeEmptyAttributes: true,
    //       sortAttributes: true,
    //       sortClassName: true
    //     },
    //     cache: true
    //   },
    //   Image: false,
    //   SVG: {
    //     cache: true,
    //     // SVG最適化を強化
    //     svgo: {
    //       plugins: [
    //         'preset-default',
    //         {
    //           name: 'removeViewBox',
    //           active: false
    //         }
    //       ]
    //     }
    //   },
    //   Logger: 1
    // })
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
            if (id.includes('react-dom')) return 'vendor-react-dom'
            if (id.includes('react') && !id.includes('react-dom')) return 'vendor-react'
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
