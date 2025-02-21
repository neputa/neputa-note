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
import inline from '@playform/inline'

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
    compress({
      CSS: {
        level: 2,
        cache: true
      },
      JavaScript: {
        mangle: true,
        compress: true,
        cache: true
      },
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false
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
      quality: 80, // 画像の品質を設定
      formats: ['webp', 'jpeg'] // 最適化する画像フォーマット
    })
  }
})
