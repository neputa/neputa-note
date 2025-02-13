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
  description:
    '個人Blogです。 本・映画・ドラマの感想、趣味のプログラミングに関する備忘録、そのほか日々の雑記などを綴っています。サイトはAstroで構築しています。',
  lang: 'ja-JP',
  ogLocale: 'ja-JP',
  shareMessage: '',
  paginationSize: 6
}
