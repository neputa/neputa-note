import { defineConfig, sharpImageService } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { remarkReadingTime } from './src/utils/readTime.ts'
import rehypeExternalLinks from 'rehype-external-links'
import remarkCodeBlock from './plugins/remark-code-title.ts'
import compress from '@playform/compress'
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import { promises as fs } from 'fs'
import path from 'path'
import inline from '@playform/inline'

function PreloadCSSPlugin() {
  return {
    name: 'preload-css',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        // URLオブジェクトを文字列パスに変換
        const distDir = path.resolve(dir.pathname)

        // dist ディレクトリ内の HTML ファイルを取得
        const htmlFiles = (await fs.readdir(distDir)).filter((file) => file.endsWith('.html'))

        for (const file of htmlFiles) {
          const filePath = path.join(distDir, file)

          // HTML内容を読み込む
          let content = await fs.readFile(filePath, 'utf-8')

          // CSSリンクを `rel="preload"` に置換
          content = content.replace(
            /<link href="(.*?\.css)" rel="stylesheet">/g,
            `<link href="$1" rel="preload" as="style" onload="this.rel='stylesheet'">`
          )

          // HTMLを上書き保存
          await fs.writeFile(filePath, content, 'utf-8')
        }
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
        level: 2
      },
      JavaScript: {
        mangle: true,
        compress: true
      },
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false
        }
      },
      Image: true,
      SVG: true,
      Logger: 1
    })
  ],
  image: {
    service: sharpImageService({
      cache: true, // キャッシュメカニズムを有効にする
      quality: 80, // 画像の品質を設定
      formats: ['webp', 'jpeg'] // 最適化する画像フォーマット
    })
  }
})
