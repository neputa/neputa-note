/**
 * 文字列のhtmlエスケープ処理を行う
 * @param {string} str:string
 * @returns {string} htmlエスケープ済み文字列
 */
export const htmlEscape = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * 相対パスをタイプ別に整形し返す
 * 先頭・末尾 '/' 有り
 * @param {string} slug - URLパス
 * @param {string} type - URLタイプ
 * @returns {string} - 整形済み相対URLパス
 */

export const getPermalink = (slug: string = '', type: string = ''): string => {
  let permalink: string

  if (
    slug.startsWith('https://') ||
    slug.startsWith('http://') ||
    slug.startsWith('://') ||
    slug.startsWith('#') ||
    slug.startsWith('javascript:')
  ) {
    return slug
  }

  switch (type) {
    case 'page':
      permalink = `/p/${formatSlug(slug)}`
      break
    case 'category':
      permalink = `/category/${formatSlug(slug)}`
      break
    case 'tag':
      permalink = `/tags/${formatSlug(slug)}`
      break
    case 'post':
      permalink = `/${formatSlug(slug)}`
      break
    default:
      permalink = `/${formatSlug(slug)}`
      break
  }
  return `${permalink}`
}

// slugの / を整形 先頭:無し - 末尾:有り
const formatSlug = (slug: string): string => {
  return slug === ('' || '/') ? '' : slug.replace(/^\/|\/$/g, '') + '/'
}
