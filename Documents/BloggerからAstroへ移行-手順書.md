## Blogger から Astro への移行手順書

### 1. 準備

1. **ドメインと DNS 設定の確認**
   - [XServer](https://secure.xserver.ne.jp/)のドメインサービスで、DNS 設定を Cloudflare に移行する
     - DOMAIN: neputa-note.net
     - 以前 Cloudflare のキャッシュサービス利用のためドメインは移行済み
2. Blogger のカスタムリダイレクトを移行
   - 手順参照
   - [CloudFlare Pages でホストしている Astro ブログでリダイレクト](https://tkancf.com/blog/setting-up-redirects-astro-cloudflare-pages)
   - [Redirects · Cloudflare Pages docs](https://developers.cloudflare.com/pages/configuration/redirects/)
   - Astro の public ディレクトリに\_redirects ファイルを作成する
   - 以下 Blogger に設定済みのリダイレクトを\_redirects ファイル内に貼り付け

```txt
/2010/03/blog-post.html /2010/03/hahakigi-hosei.closed-ward/ 301
/2011/03/blog-post.html /2011/03/motohashi-seiichi.slaughterhouse/ 301
/2011/05/blog-post.html /2011/05/emergency-call-from-etrov/ 301
/2011/10/blog-post.html /2011/10/hahakigi-hosei.escape/ 301
/2013/01/blog-post.html /2013/01/takamura-kaoru.cold-blood/ 301
/2014/11/blog-post.html /2014/11/hahakigi-hosei.the-darkness-of-the-rose-window/ 301
/2014/12/blog-post.html /2014/11/hahakigi-hosei.intersex/ 301
/2014/11/blog-post_22.html /2014/11/hahakigi-hosei.embrio/ 301
/2014/12/blog-post_22.html /2014/11/hahakigi-hosei.anraku-ward/ 301
/2014/12/blog-post_98.html /2014/12/uehashi-nahoko.the-beast-player/ 301
/2015/03/blog-post_9.html /2015/03/nakamura-fuminori.cult-x/ 301
/2015/11/blog-post_2.html /2015/11/takamura-kaoru.marks-mountain/ 301
/2015/02/blog-post_21.html /2015/02/inoue-yasushi.tenpyo-no-iraka/ 301
/2015/05/blog-post_3.html /2015/05/fuminori-nakamura.children-in-the-soil/ 301
/2015/03/blog-post_14.html /2015/03/kazuo-ishiguro.dont-let-me-go/ 301
/2015/11/blog-post.html /2015/11/takamura-kaoru.horse-pulling-the-sun/ 301
/2015/08/blog-post.html /2015/08/takamura-kaoru.new-rear-king/ 301
/2015/04/blog-post_14.html /2015/04/takamura-kaoru.haruko-emotional-song/ 301
/2015/02/k.html /2015/02/do-androids-dream-of-electric-sheep/ 301
/2021/06/ashitano-tarinai-futari.html /2021/08/tarinaifutari/ 301
/2021/08/foresee-death.html /2021/08/thinking-habits/ 301
/2017/04/blog-post.html /2021/08/abelchristo/ 301
/2021/08/our-girl-a.kaoru-takamura.html /2021/08/ourgirla/ 301
/2021/08/our-girl-a.html /2021/08/ourgirla/ 301
/2021/09/blog-post_22.html /2021/09/blogpost22/ 301
/2021/09/ferdinandvonschirach.html /2021/11/ferdinand-von-schirach/ 301
/2024/03/%20family-farewell.html /2024/03/family-farewell/ 301
/p/privacy-policy-neputa-note.html /p/privacy-policy/ 301
/p/contact_30.html /p/contact/ 301
/p/about-me.html /p/about-me/ 301
/p/archive.html /p/archive/ 301
```

3. Github のリポジトリ準備
   - main リポジトリに公開用のソースを push しておく
   - 開発リポジトリの pull request を行う

### 2. Astro サイトのデプロイ

1. **Astro サイトを Cloudflare Pages にデプロイ**

   - [Cloudflare](https://dash.cloudflare.com/)に neputa アカウントでログインし、「Create a Project」を選択する
   - Git リポジトリを接続し、ビルド設定を行う（ビルドコマンドは `npm run build`、ビルド出力ディレクトリは `dist`）
   - 参考 : [Astro サイトを Cloudflare Pages にデプロイする | Docs](https://docs.astro.build/ja/guides/deploy/cloudflare/)

2. **デプロイ結果確認**
   - Cloudflare Pages の提供する一時 URL でサイトが正しく表示されることを確認

### 3. URL リダイレクト設定

1. Cloudflare の DNS 設定を Blogger から Cloudflare Pages へ切り替える

   - Cloudflare Pages にドメインを設定する
   - DNS 設定を確認し、www サブドメインを Blogger から Cloudflare Pages へ修正する

2. **Blogger の URL から新しい Astro サイトへの 301 リダイレクト**

   - Cloudflare の「Page Rules」を使用してリダイレクト設定を行う
     - 「Create Page Rule」を選択し、古い Blogger の URL から新しい Astro サイトの URL に 301 リダイレクトを設定する
     - Blogger URL: book-reports-blog.blogspot.com
     - 参考 [Cloudflare Page Rules設定](./Cloudflareリダイレクト設定.md)

3. Google Search Console の設定変更

   - Search Console に登録している Sitemap を Astro の URL へ変更
     - /sitemap-index.xml

4. Adsenseの自動広告をオフにする

### 5. 検証とテスト

1. **コンテンツの確認**

   - Astro サイト上で記事、ページ、コメント（コメント機能がある場合）が正しく表示されているか確認します
   - 画像やメディアファイルも正しく表示されているか確認します

2. **機能テスト**

   - サイトのすべての機能（フォーム、検索機能、プラグインなど）が正常に動作しているか確認します

3. **パフォーマンステスト**
   - サイトの読み込み速度やパフォーマンスを確認し、必要に応じて Cloudflare のキャッシュ設定や最適化オプションを使用します

### 6. 最終準備

1. **SEO 設定の確認**

   - メタデータ、キーワード、ディスクリプションの確認
   - Cloudflare の「SEO」設定や「sitemap.xml」の生成と登録

2. **Google Analytics や他のトラッキングツールの設定**

   - 新しいサイトへのトラッキングコードの導入
   - トラフィックの監視設定

3. **ユーザー通知**
   - 読者やユーザーにサイト移行について通知
   - メールや SNS を通じて移行を知らせる

### 7. 移行後のフォローアップ

1. **問題のモニタリングと対応**

   - サイト移行後のエラーや問題の監視
   - 早急な対応と修正

2. **定期的なバックアップの設定**
   - 定期的なデータベースとファイルのバックアップ設定
   - バックアップのテストと検証
