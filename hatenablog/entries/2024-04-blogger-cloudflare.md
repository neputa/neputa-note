---
Title: 'サイトマップとフィード内のURLがhttpになる問題 【Blogger】'
Date: 2024-04-08T23:26:00+09:00
CustomPath: 2024/04/08/blogger-cloudflare
Category:
  - 'DEV'
---

## 本記事の概要

- 本ブログはGoogleが提供する「Blogger」をカスタムドメインで運用している。
- この度、サイトのパフォーマンス向上を目的に「cloudflare」のキャッシュサービスを利用することとした。
- 結果、Bloggerが生成するsitemap、feed（rss、atom）において、URLがすべて「https」ではなく「http」となる問題が発生。
- それなりに探索したが同様の事象に関する情報が得られなかったので備忘録を残す。

## 問題

Bloggerが生成する以下ファイル内の各コンテンツURLがhttpで配信される。

- サイトマップ：URL + sitemap.xml
- フィード：URL + /feeds/posts/default（?alt=rss）

影響範囲として、RSSによる配信の重複、Search Consoleでのサイトマップによる読み込みエラーなどが発生。

## 結論・対処した内容

cloudflareとBlogger間の通信をHTTPS化する

### 設定作業詳細

- 該当URLのSSL/TLS→Overviewを選択
- Your SSL/TLS encryption mode isの「Full」を選択

![Cloudflare SSL/TLS encryption mode選択画面](../assets/images/cloudflare-ssltls.webp)

## 検証作業メモ

問題は、cloudflareからBloggerへHTTPでリクエストしていることと想定。 Page Rulesでfeedおよびサイトマップのみバイパス設定を行いhttpsでリクエストを試みたが不発。

Automatic HTTPS Rewritesはxmlを対象とせず。 Blogger側のHTTPSをオン、cloudflareとblogger間もHTTPSとする必要があると結論。
