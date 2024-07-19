import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z
      .object({
        title: z.string().max(80),
        description: z.string(),
        // Transform string to Date object
        pubDate: z
          .string()
          .or(z.date())
          .transform((val) => new Date(val)),
        modDate: z
          .string()
          .or(z.date())
          .transform((val) => new Date(val)),
        heroImage: image(),
        category: z.array(z.string()),
        tags: z.array(z.string()),
        draft: z.boolean().default(false),
        keywords: z.array(z.string()).nullable()
      })
      .refine((data) => data.pubDate <= data.modDate, {
        message: '投稿日は更新日よりも古い日付である必要があります。',
        path: ['datePublished', 'dateUpdated']
      })
})

export const collections = { blog }
