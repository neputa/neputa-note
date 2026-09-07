---
Title: 'Ubuntu 20.04にアプリをインストールする'
Date: 2021-11-08T15:34:00+09:00
CustomPath: 2021/11/08/ubuntu-apps-installation
Category:
  - 'DEV'
---
![アイキャッチ画像](../assets/images/hero__2021__11__ubuntu-apps-installation.webp)

## この記事の概要

先日、購入した中古のノートPCに「Ubuntu 20.04LTS（日本語Remix版）」をインストールした。

[https://www.neputa-note.net/2021/10/blogpost01/:embed:cite]

続けてOS周りの設定作業を行った。

[https://www.neputa-note.net/2021/11/ubuntu-initial-settings/:embed:cite]

今回は必要なアプリケーションをインストールした作業の備忘録。

画像・動画編集やエンタメ系のモノは入れない。低スペックだから。容量がもったいないから。どうせ動かないから。

ブログを書いたりノートをまとめたりとテキスト操作オンリーのストロングスタイル端末の話なので悪しからず。

## アプリケーションのインストール

### LibreOffice

マイクロソフトのOffice互換アプリケーション。念のため入れておく。

```bash
$ sudo add-apt-repository -n ppa:libreoffice/ppa
$ sudo apt update
$ sudo apt dist-upgrade -y
```

私の低速端末でupgradeは結構な時間がかかった。

### Ubuntu Cleaner

よくあるCleanerアプリのUbuntu版

```bash
$ sudo apt install ubuntu-cleaner
```

### Joplin

「Joplin」はノートアプリ。

現在WindowsとAndroid端末で使用している。主に収集した情報整理したり永久保存したいWeb記事のスクラップが主な用途。

興味がある方はこちらの記事を参考にされたし。

[https://www.neputa-note.net/2020/10/joplin/:embed:cite]

インストールは下記コマンドを実行する。

```bash
$ wget -O - https://raw.githubusercontent.com/laurent22/joplin/master/Joplin_install_and_update.sh | bash
```

参考サイト：

[https://joplinapp.org/help/#desktop-applications:embed:cite]

### VSCode

このブログはVSCodeで書いている。記事の他、ブログテンプレートやJavaScript等も同様。記事およびソースファイルはGit&Githubで管理している。ブログサービスは「Blogger」を使用しているのだが、エディタが非常に貧弱なのでVSCodeさまさまだ。

「[Visual Studio Code - Code Editing. Redefined](https://code.visualstudio.com/)」から「.deb」ファイルをダウンロードする

以下コマンドを実行しインストールする

```bash
$ sudo apt install ダウンロードした.debファイル
$ sudo apt install -y apt-transport-https
$ sudo apt update
```

参考サイト：[Ubuntu18にVisual Studio Codeをインストールする最も簡単な手順 #VSCode - Qiita](https://qiita.com/grgrjnjn/items/85aa7cab1475bf1aea54)
