---
Title: 'AstroのサイトでGoogle Adsenseを遅延読み込みする'
Date: 2024-07-20T17:02:57+09:00
CustomPath: 2024/07/20/adsense-lazy-loading
Category:
  - 'DEV'
  - 'Astro'
  - 'adsense'
  - '遅延読み込み'
---

## 記事概要

- 先日のBloggerからAstroへ移行した記事の別途詳細

※参考 - Blog移行記事

[https://www.neputa-note.net/2024/07/migrated-blogger-to-astro/:embed:cite]

### 目的

- Astroで構築したWebサイトにGoogle Adsenseの遅延読み込みを実装する
- [前回](/2024/07/20/astro-lazy-loading-analytics)、GoogleアナリティクスをPartytownで遅延読み込みする実装を行ったがAdsenseには適用できなかった
- 例としてディスプレイ広告（バナー）を扱う
- JavaScriptのobserverを使用し、広告が描画エリアに入るタイミングでAdsenseのJSをロードする

## 用語説明

### Astro とは？

> Astroは、ブログやマーケティング、eコマースなど、コンテンツ駆動のウェブサイトを作成するためのウェブフレームワークです。Astroは、新しいフロントエンドアーキテクチャを開拓し、他のフレームワークと比較してJavaScriptのオーバーヘッドと複雑さを低減することで知られています。高速でSEOに優れたウェブサイトが必要なら、Astroが最適です。<br>
> -- [Astro公式Docs](https://docs.astro.build/ja/concepts/why-astro/) より引用をDeepLで翻訳

- 参考記事
  - [Webフレームワーク「Astro」とは？開発初心者からベテランまで注目する理由](https://codezine.jp/article/detail/17883)

## 作業環境

- OS - Ubuntu-22.04LTS on WSL2
- Node.js - v20.14.0
- pnpm - v9.4.0
- Astro - v4.11.3

## 作業詳細

- Google Adsenseを表示するcomponentを作成する
- 実装のポイントは以下
  - isProdでデバッグ時に[Adsenseのテストモード](https://developers.google.com/ad-placement/docs/test?hl=ja)をオンにする（デバッグ時の不要なリクエスト防止）
  - init関数でobserverを定義し、ads-containerが描画エリアに入ったらheadにスクリプトタグを追加する
  - スクリプトタグの is:inline data-astro-rerun は、AstroのViewTransitions使用時にページ遷移先でも処理を走らせるために設定

```astro GoogleAdsense.astro
---
const isProd = import.meta.env.PROD
const adsClientId = 'ca-pub-0000000000000000'
const adsBannerId = '0000000000'
---

<div class='ads-container'>
  <p>広告</p>
  <div>
    <ins class="adsbygoogle" style="display:block" data-ad-client={adsClientId} data-ad-slot={adsBannerId} data-ad-format="auto" data-full-width-responsive="true" />

{
  isProd ? (
    <script is:inline data-astro-rerun>
      (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  ) : (
    <script is:inline data-astro-rerun>
      window.adsbygoogle = window.adsbygoogle || [];
      const adBreak = adConfig = function(o) {
        adsbygoogle.push(o);
      }
    </script>
  )
}
  </div>
</div>

<script is:inline data-astro-rerun define:vars={{ adsClientId, isProd }}>
  function init() {
    const adElement = document.querySelector('.ads-container');
    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        let ad = document.createElement('script');
        ad.type = 'text/javascript';
        ad.async = true;
        ad.src =
          'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + adsClientId;
        ad.crossOrigin = 'anonymous';
        if (!isProd) {
          ad.dataset.adbreakTest='on';
        }
        document.head.appendChild(ad);
        observer.disconnect();
      }
    })
    if (adElement) {
      observer.observe(adElement);
    }
  }
  init();
</script>
```

- [...slug].astroにcomponentを設置する

```astro [...slug].astro
---

// [!code ++]

export async function getStaticPaths() {
  const posts = await getCollection('blog')
  return posts.map((post: any) => ({
    params: { slug: post.slug },
    props: post
  }))
}
type Props = CollectionEntry<'blog'>

const post = Astro.props
const { Content } = await post.render()
---

<BlogPost {...post.data}>
  <Content />
// [!code ++]
  <GoogleAdsense />
</BlogPost>
```

以上
