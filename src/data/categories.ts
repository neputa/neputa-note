// List of categories for blog posts
export const CATEGORIES = ['DEV', 'BOOK', 'MEDIA', 'DIARY', '全記事']

interface Descriptions {
  [key: string]: string
}
export const DESCRIPTIONS: Descriptions = {
  DEV: '個人で行っているアプリ開発やBlogのカスタマイズに関する記事カテゴリー。',
  BOOK: '読んだ本のあらすじと感想をまとめた記事カテゴリー。ミステリ作品が多め。',
  MEDIA: '音楽や映像作品など書籍以外のコンテンツに関する感想の記事カテゴリー',
  DIARY: '個人的な生活logの記事カテゴリー。思考や感情の整理を目的に書いている。',
  全記事: 'このブログの全記事。'
}
