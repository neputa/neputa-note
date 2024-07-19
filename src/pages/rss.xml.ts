import { getRssString } from '@astrojs/rss'
import { siteConfig } from '@/site-config'
import { getPermalink, getPosts, mdxToHtml } from '@/utils'

export const GET = async () => {
  const posts = await getPosts()

  const rss = await getRssString({
    title: siteConfig.title,
    description: siteConfig.description,
    site: import.meta.env.SITE,

    items: posts.map((post, index) => ({
      link: getPermalink(post.slug, 'post'),
      title: post.data.title,
      description: `${post.data.description}...`,
      pubDate: post.data.pubDate,
      content: mdxToHtml(post.body)
    }))
  })

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}
