interface SiteConfig {
  author: string
  title: string
  description: string
  lang: string
  ogLocale: string
  shareMessage: string
  paginationSize: number
}

export const siteConfig: SiteConfig = {
  author: 'neputa',
  title: 'neputa note',
  description: '個人Blog。 Book感想、システム開発の備忘録、その他雑記など。',
  lang: 'ja-JP',
  ogLocale: 'ja-JP',
  shareMessage: '',
  paginationSize: 6
}
