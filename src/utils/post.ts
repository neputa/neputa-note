import { CATEGORIES, DESCRIPTIONS } from '@/data/categories'
import { getCollection } from 'astro:content'

export const getCategories = () => {
  return CATEGORIES
}

export const getCategoryDescriptions = () => {
  return DESCRIPTIONS
}

export const getPosts = async (max?: number) => {
  return (await getCollection('blog'))
    .filter((post) => !import.meta.env.PROD || !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, max)
}

export const getTags = async () => {
  const posts = await getPosts()
  const tags = new Set<string>()
  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      tags.add(tag.toLowerCase())
    })
  })

  return Array.from(tags)
}

export const getTagsWithCounts = async () => {
  const posts = await getPosts()
  let tags: string[] = []
  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      tags.push(tag.toLowerCase())
    })
  })

  const countObj: { [key: string]: number } = {}
  tags.forEach((item) => {
    if (countObj[item]) {
      countObj[item]++
    } else {
      countObj[item] = 1
    }
  })

  type CountMap = { name: string; count: number }

  const result: CountMap[] = []
  for (const key in countObj) {
    if (countObj.hasOwnProperty(key)) {
      result.push({ name: key, count: countObj[key] })
    }
  }

  const ordered: CountMap[] = result.sort((n1, n2) => (n1.count > n2.count ? -1 : 1))

  return ordered
}

export const getPostByTag = async (tag: string) => {
  const posts = await getPosts()
  const lowercaseTag = tag.toLowerCase()
  return posts.filter((post) => {
    return post.data.tags.some((postTag) => postTag.toLowerCase() === lowercaseTag)
  })
}

export const filterPostsByCategory = async (category: string) => {
  const posts = await getPosts()
  return posts.filter((post) => post.data.category[0].toLowerCase() === category)
}
