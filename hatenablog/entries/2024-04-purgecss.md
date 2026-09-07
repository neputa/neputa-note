---
Title: 'PurgeCssで複数のhtmlファイルの不要CSSセレクタを削除する'
Date: 2024-04-07T16:28:00+09:00
CustomPath: 2024/04/07/purgecss
Category:
  - 'DEV'
---
![アイキャッチ画像](../assets/images/hero__2024__04__purgecss.webp)

## PurgeCssとは

> PURGECSS IS A TOOL TO REMOVE UNUSED CSS.（PURGECSSは未使用のCSSを削除するツールです。）<br>
> -- [INTRODUCTION | PURGECSS](HTTPS://PURGECSS.COM/INTRODUCTION.HTML)

## 記事概要

前回作業でインストールしたPurgeCssを実際に使ってみたので手順をまとめる。

PurgeCssを使用するにはnode.js、npmが必要となる。環境構築の手順は以下記事にまとめている。

[https://www.neputa-note.net/2024/04/ubuntu-nodejs-install/:embed:cite]

## 作業環境

### OS

Ubuntu 22.04.4 LTS（WSL2 on Windows11 Proで作動）

### node.js

v20.12.1

### PurgeCss

v6.0.0

## 作業詳細

### 単一のhtmlファイルを対象にPurgeCssを実行する

PurgeCssはコマンドで処理を行う。

PurgeCssはhtmlとcssファイルを解析し、不要なセレクタを削除した新たなcssファイルを出力する。

たとえば、index.htmlとstyle.cssが同階層に配置してあるrootディレクトリに移動し作業を行うとする。

```bash
root/
  ├ build/
　├ index.html
　└ style.css
```

ここで以下を実行する。

```bash
purgecss --css styles.css --content index.html --out build/
```

そうすると、buildディレクトリに不要なセレクタを削除したstyle.cssが作成される。

出力ファイル名を変えたい場合は、outputパラメータをbuild/style.purged.cssなどとする。

### 複数のhtml、cssファイルを対象にPurgeCssを実行する

これが今回やりたかったこと。

rootディレクトリ内にあるすべてのhtml、cssを対象にまとめて処理を行う。

たとえば多階層に存在するhtmlをすべて解析することを想定し、設定ファイルを準備する。

```bash
root/
  ├ assets/
  │  └ css/
  │      ├ style.css
  │      └ color.css
  ├ index.html
  ├ 404.html
  └ sub/
      ├ help.html
      └ about.html
```

rootディレクトリの1つ上の階層で作業を行うとする。

ここにpurgecss.config.jsという名前で設定ファイルを以下のとおり作成する。

```javascript
module.exports = {
  // PurgeCSSの設定をここに記述
  content: ['./public/**/*.html'], // PurgeCSSが探索するHTMLファイルのパス
  css: ['./public/assets/**/*.css'] // PurgeCSSが処理するCSSファイルのパス

  // その他の設定をここに追加
}
```

そしてbuildディレクトリを準備し、以下コマンドを実行するとbuildディレクトリ内に処理済みのstyle.cssとcolor.cssが作成される。

```bash
purgecss --config purgecss.config.js --output build/
```

## まとめ

今回、静的サイトのファイルに対しPurgeCssで容易にCSSの整理できることが確認できた。

次はBlogなど動的コンテンツのサイトで良い方法がないか考える。

## 参考サイト

- [Getting Started | PurgeCSS](https://purgecss.com/getting-started.html)
- [PurgeCSS で使われていない CSS を削除しよう #環境構築 - Qiita](https://qiita.com/YoshinoriKanno/items/204719927b62ed30ec57)
- [PurgeCSS のシンプルな使い方 #CSS - Qiita](https://qiita.com/YoshinoriKanno/items/180c75f53009b5f42335)
