---
Title: 'BlogをBloggerからAstroへ移行した'
Date: 2024-07-01T03:51:30+09:00
CustomPath: 2024/07/01/migrated-blogger-to-astro
Category:
  - 'DEV'
  - 'Astro'
  - 'Tailwind'
  - 'blog'
  - 'Blogger'
---

## Blog移行の経緯

Googleから見捨てられ、エディターやテンプレートは古いままのGoogle Bloggerを10年以上利用してきた。先日、Webフレームワーク「Astro」でサイトを開発し、手ごたえがあった。この個人Blogも移行しようと決断した。

- Bloggerとの戦いの記録

[https://www.neputa-note.net/2024/04/blogger-pagespeedinsights/:embed:cite]

- Astroサイト開発デビュー

[https://www.neputa-note.net/2024/05/astro-tailwind/:embed:cite]

## 開発環境・フレームワーク

### 開発環境

- OS - Ubuntu22.04LTS on WSL2（Windows11）
- Node.js - v20.14.0
- pnpm - v9.4.0
- VSCode - v1.90.2

### フレームワーク

- Astro - v4.11.0
- tailwindcss - v3.3.5

### Astroテンプレート

- [blog-template](https://github.com/danielcgilibert/blog-template) - v1.1.0
  - Demoサイト - [Home • Astro Theme OpenBlog](https://blog-template-gray.vercel.app/)

#### テンプレート選びについて

- 下記リンクに様々なテンプレートがあり、用途や使いたい技術で絞り込むことができる。

[https://astro.build/themes/:embed:cite]

- 今回は以下で条件の中から選択した。
  - Categories - Blog
  - Technology - MDX / Tailwind / TypeScript
  - Pricing - Free

## 移行作業―概要

行った作業を大きく分けると以下の3つ。

- Astro Blogサイト開発
- BloggerのコンテンツをAstroへ移行
- DNS等ネットワーク周りの移行

次に各作業の実施事項を記す。粒度は「実施したこと」に留め、作業手順はそれぞれ別途記事を書く。予定。

## 移行作業―詳細

### Astro Blogサイト開発

ここが最も作業ボリュームが大きい。Bloggerにあった機能を可能な範囲で盛り込んだ。

先述した[テンプレート](https://github.com/danielcgilibert/blog-template)をベースに行ったカスタマイズを列挙する。

> [!NOTE]
> 作業手順をまとめた記事を作成次第、各項目にリンクを追記する

- 開発・運用環境
  - [CMSの入れ替え（Tina → Front Matter CMS）](/2024/07/headless-cms-frontmatter-vscode/)
  - [Testフレームワーク「Jest」追加](/2024/07/jest-astro/)
  - [textlint（JTF日本語標準スタイル）追加](/2024/07/vscode-textlint/)
- サイト用コンポーネント
  - [RSSに記事本文を追加](/2024/07/astro-rss/)
- MDX用コンポーネント
  - [コードブロックにファイル名とdiffを表示](/2024/07/astro-shiki-filename-diff/)
  - [一致するタグ数で関連記事を表示](/2024/07/astro-related-posts/)
  - [mobile表示用TabBar追加](/2024/07/astro-mobile-tabbar/)
  - [BlogCardコンポーネント追加](/2024/07/astro-blogcard/)
  - [画像にアンカーリンクに対応したキャプションを付ける](/2024/07/astro-image-caption/)
  - [記事にYoutube、Xのポストを遅延読み込みで埋め込む](/2024/07/astro-embed-youtube/)
  - [GoogleアナリティクスのJavaScriptを遅延読み込みさせる](/2024/07/astro-lazy-loading-analytics/)
  - [Google Adsense遅延読み込み追加](/2024/07/adsense-lazy-loading/)
  - [パンくずリスト追加](/2024/07/astro-bread-crumbs/)
  - [Validation・reCAPTCHAを設置したContact Form](/2024/07/astro-contactform-recaptchav3-validation/)

### BloggerのコンテンツをAstroへ移行

#### 記事コンテンツ変換作業

- Bloggerの記事や静的ページをAstroへ移行するためmarkdownへ変換する
- 便利なツールを提供してくれている方がいた（Node.jsが必要）
  - [blog2md: Convert Blogger & Wordpress backup blog posts to hugo compatible markdown documents](https://github.com/palaniraja/blog2md)
- Bloggerのバックアップxmlファイルを対象に実行する
- 各ページのmarkdown・HTMLを生成し、使用画像をダウンロードしてくれる

```bash 出力結果
output/
├── neputanote
│   ├── data
│   ├── draft-pages
│   │   ├── html
│   │   └── markdown
│   ├── draft-posts
│   │   ├── html
│   │   └── markdown
│   ├── images
│   ├── pages
│   │   ├── html
│   │   └── markdown
│   └── posts
│       ├── html
│       └── markdown
└── neputanote-images
```

- markdwonへ変換といっても、meta情報をもとにfrontmatterを追加し本文はHTMLのまま
- 各記事のmeta descriptionはBloggerのバックアップXMLに含まれないので空欄
- シェルスクリプトとVSCodeの置換＆正規表現を駆使しMDX形式の記事へ移行した

#### ルーティング対応

- 記事のディレクトリ構成はBloggerと同じく「ドメイン/年/月/記事ファイル名」とした
- Bloggerは .html拡張子が付いていたがこれをやめ、trailing slashを付ける
- 記事ファイル名に使用していたドットはAstroがハイフンに置換するため\_redirectsを作成

### DNS等ネットワーク周りの移行

- 元々Bloggerのキャッシュサーバに使っていた[Cloudflare](https://www.cloudflare.com/)の静的サイト配信サービス[Cloudflare Pages](https://pages.cloudflare.com/)を利用した
- Githubの指定したリポジトリをダウンロードしビルドしてくれる
- ドメインサーバの設定はキャッシュサーバ利用時に設定済みだった
- DNS設定のオリジンをBloggerからCloudflare Pagesに変更
- Blogger用に最適化したPage Ruleを削除し、.htmlをスラッシュに修正するRewriteルールを追加

## まとめ

今回の移行作業を項目ベースで網羅的にまとめてみた。

AstroではBloggerで出来なかった数多くの機能を実現できてうれしい。

各作業工程の手順については自分の備忘録として個別に記事をまとめる予定。

まとめたものからこのページへリンクを追加する。
