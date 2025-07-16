// List of categories for blog posts
export const CATEGORIES = ['DEV', 'BOOK', 'MEDIA', 'DIARY', 'ALL']

interface Descriptions {
  [key: string]: string
}
export const DESCRIPTIONS: Descriptions = {
  DEV: '趣味のプログラミングに関する記事カテゴリー。.NET開発が主であるため、C#やAzureに関する記事が多め。その他、このブログ構築に関するAstroやViteの使い方に関する記事も。',
  BOOK: '読んだ本のあらすじと感想をまとめた記事カテゴリー。読んだすべての本の感想は「読書メーター」に記録しているが、その中でも特に印象に残った本について、このカテゴリーに書いている。',
  MEDIA:
    '音楽や映像作品など、書籍以外のコンテンツに関する感想記事のカテゴリー。映像作品は、映画館での鑑賞記録や、NetflixやAmazon Prime Videoで視聴した作品について。',
  DIARY:
    '個人的な生活に関する日記記事のカテゴリー。身近な印象的だった出来事の記録や、思考の整理、感情のはけ口として書いたもの。',
  ALL: 'このブログのALL。'
}
