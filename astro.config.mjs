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
        console.log('🔧 PreloadCSSPlugin: Starting CSS preload conversion...')

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

          // CSSリンクを `rel="preload"` に置換（noscriptタグ内は除外済み）
          const cssLinkRegex = /<link\s+(?:[^>]*\s+)?rel="stylesheet"(?:\s+[^>]*)?(?:\s+href="([^"]*\.css)"|\s+href='([^']*\.css)')(?:[^>]*)?>/g
          const replacements1 = content.match(cssLinkRegex)
          content = content.replace(
            cssLinkRegex,
            (match) => {
              // href属性を抽出
              const hrefMatch = match.match(/href=["']([^"']*\.css)["']/)
              const href = hrefMatch ? hrefMatch[1] : ''
              return `<link href="${href}" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" fetchpriority="high">`
            }
          )

          // noscriptタグを復元
          content = content.replace(/<!--NOSCRIPT_PLACEHOLDER_(\d+)-->/g, (match, index) => {
            return noscriptTags[parseInt(index)]
          })

          const fileReplacements = (replacements1?.length || 0)
          totalReplacements += fileReplacements

          if (fileReplacements > 0) {
            console.log(`  ✅ ${relativePath}: ${fileReplacements} CSS links converted to preload`)
          } else {
            console.log(`  ⚪ ${relativePath}: No CSS links found`)
          }

          // HTMLを上書き保存
          if (content !== originalContent) {
            await fs.writeFile(filePath, content, 'utf-8')
          }
        }

        console.log(`🎉 PreloadCSSPlugin: Complete! Total ${totalReplacements} CSS links converted to preload`)
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
    prefetchAll: true,
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
          unused: true
        },
        cache: true
      },
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true
        },
        cache: true
      },
      Image: false,
      SVG: {
        cache: true
      },
      Logger: 1
    })
  ],
  image: {
    service: sharpImageService({
      cache: true, // キャッシュメカニズムを有効にする
      quality: 85, // 画像の品質を向上（80→85）
      formats: ['avif', 'webp', 'jpeg'] // AVIF形式を追加
    })
  }
})
