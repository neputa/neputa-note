---
Title: '最新バージョンのNeovimを.debパッケージからインストール'
Date: 2023-11-01T17:51:00+09:00
CustomPath: 2023/11/01/blog-post
Category:
  - 'DEV'
---
![アイキャッチ画像](../assets/images/hero__2023__11__blog-post.webp)

## 追記

> [!NOTE]
> 2024/05/08 - .debパッケージの配布終了によりsnapによるインストールを以下記事にまとめた。

[https://www.neputa-note.net/2024/05/neovim-snap/:embed:cite]

## 本記事の概要

- Neovimの最新バージョンを .debパッケージからインストールする手順をまとめる。

## 背景

「VSCode + WSL2 + Ubuntu」で使用しているNeovim拡張機能が、最新バージョンのNeovimを要求する事象が今年に入ってから数回あった。

一方、UbuntuのPPAリポジトリにあるNeovimは常に最新というわけではない。

よって別途手段にてバージョンを更新する必要が生じた。

## 環境

Ubuntu 22.04.3 LTS on WSL2 + Windows11 Home 22H2 x64

## 参考記事

- [How to install latest version (0.8+) of Neovim on Debian instead of apt-get | FRVfrvr](https://frvfrvr.github.io/2022/12/09/myvimsetup?utm_source=pocket_saves)
- [drivers - dpkg-deb: error: paste subprocess was killed by signal (Broken pipe) - Ask Ubuntu](https://askubuntu.com/questions/1062171/dpkg-deb-error-paste-subprocess-was-killed-by-signal-broken-pipe)

## 手順

既存のneovimをアンインストールする。

```bash
$ sudo apt remove neovim
```

Neovim Githubリポジトリの最新の安定版ビルドから .debパッケージをダウンロードする。

```bash
curl -L -O "https://github.com/neovim/neovim/releases/download/stable/nvim-linux64.deb"
```

ダウンロードしたパッケージをインストールする。

```bash
sudo apt install ./nvim-linux64.deb
```

ここで「dpkg-deb」のエラー（Broken pipe）が発生した場合、以下の方法で再度パッケージをインストールする。

```bash
sudo dpkg -i --force-overwrite ./nvim-linux64.deb
sudo apt -f install
```

以上
