---
Title: 'Astro Googleアナリティクス（GA4）のJavaScriptを遅延読み込みする'
Date: 2024-07-20T03:00:00+09:00
CustomPath: 2024/07/20/astro-lazy-loading-analytics
Category:
  - 'DEV'
  - 'Astro'
  - '遅延読み込み'
---

## 記事概要

- 先日のBloggerからAstroへ移行した記事の別途詳細

※参考 - Blog移行記事

[https://www.neputa-note.net/2024/07/migrated-blogger-to-astro/:embed:cite]

### 目的

- Astroで構築したWebサイトにGoogleアナリティクスの設定を行う
- Partytownというパッケージを使用し、JavaScriptを遅延読み込みできるようにする
  - [Welcome To Partytown](https://partytown.builder.io/)

## 用語説明

### Astro とは？

> Astroは、ブログやマーケティング、eコマースなど、コンテンツ駆動のウェブサイトを作成するためのウェブフレームワークです。Astroは、新しいフロントエンドアーキテクチャを開拓し、他のフレームワークと比較してJavaScriptのオーバーヘッドと複雑さを低減することで知られています。高速でSEOに優れたウェブサイトが必要なら、Astroが最適です。<br>
> -- [Astro公式Docs](https://docs.astro.build/ja/concepts/why-astro/) より引用をDeepLで翻訳

- 参考記事
  - [Webフレームワーク「Astro」とは？開発初心者からベテランまで注目する理由](https://codezine.jp/article/detail/17883)

### Partytown とは？

> Partytown は、リソースを大量に消費するスクリプトをメインスレッドからウェブワーカーに移行するための遅延ロードライブラリです。メインスレッドをあなたのコードに捧げ、サードパーティのスクリプトをウェブワーカーにオフロードすることで、サイトの高速化を支援することを目的としています。<br>
> -- [Partytown](https://partytown.builder.io/)より引用 をDeepLで翻訳

## 作業環境

- OS - Ubuntu-22.04LTS on WSL2
- Node.js - v20.14.0
- pnpm - v9.4.0
- Astro - v4.11.3

## 作業詳細

- Partytownのパッケージをインストールする

```bash install-partytown
$ pnpm add -D @astrojs/partytown
```

- astro.config.mjsにpartytownをimportし設定を追加する

{/* prettier-ignore */}
```javascript astro.config.mjs

export default defineConfig({
  integrations: [
    partytown({// [!code ++]
      config: {// [!code ++]
        forward: ['dataLayer.push']// [!code ++]
      }// [!code ++]
    })// [!code ++]
  ]
})
```

- Googleアナリティクス用のcomponentを作成する
- typeをtext/partytownとするのがポイント
- ViewTransitionsを使用している場合、is:inline と data-astro-rerunを追加する
  - ページ遷移した際にJavaScriptを実行させるため

```astro GoogleAnalytics.astro
---
const gaId: string = 'G-XXXXXXXXXX'
---

<>
  <script
    is:inline
    data-astro-rerun
    type='text/partytown'
    src=`https://www.googletagmanager.com/gtag/js?id=${gaId}`></script>
  <script is:inline data-astro-rerun type='text/partytown' define:vars={{ gaId }}>
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', gaId)
    console.log(gaId)
  </script>
</>
```

- Layoutのheadタグにcomponentを追加する

```astro BaseLayout.astro
---
// [!code ++]

---

<html lang='ja'>
  <head>
    <!-- 省略-->
    <GoogleAnalytics />// [!code ++]
  </head>

  <!-- 省略-->
</html>
```

- デバッグしブラウザのデベロッパーツールで確認する
- コンソールにpartytownのworkerが起動し、初期化成功のログが流れればOK

![デベロッパーツールのコンソール](../assets/images/astro-partytown.webp 'デベロッパーツールのコンソール')

## 補足

- Partytownはサードパーティのスクリプトを遅延読み込みしてくれるパッケージだが、動作するものとしないものがある
- Googleアナリティクスは今回の実装で問題なく動作することを確認した
- 未検証だが、Googleタグマネージャーの実装例は多く見つかる
- Google Adsenseを検証したが私の実力では動作させることはできなかった。
- よってAdsenseの遅延読み込みは自力で実装しており詳細は次回記事にまとめる

以上

## 参考サイト

- [Add google analytics to Astro with Partytown](https://www.kevinzunigacuellar.com/blog/google-analytics-in-astro/)
