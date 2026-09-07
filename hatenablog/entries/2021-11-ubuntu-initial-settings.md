---
Title: 'Ubuntu 20.04 日本語Remixインストール後にやったこと17項目'
Date: 2021-11-07T19:11:00+09:00
CustomPath: 2021/11/07/ubuntu-initial-settings
Category:
  - 'DEV'
---
![アイキャッチ画像](../assets/images/hero__2021__11__ubuntu-initial-settings.webp)

## この記事の概要

先日、中古ノートPCを購入しUbuntu20.04LTSをインストールした。

[https://www.neputa-note.net/2021/10/blogpost01/:embed:cite]

今回はUbuntuインストール後に行ったことをまとめる。

作業項目としては、後述する参考サイトから以下の条件で行うべきと判断したものをピックアップした。

- Ubuntuのバージョンは「20.04LTS」の「日本語Remix版」
- 英語キーボードを使用（英字配列）
- IMEは「Fcitx + Mozc」

## Ubuntuをインストールしてやったこと詳細

### 日本語ディレクトリ名を英語に変更

homeディレクトリ配下にデフォルトで作成されている「ダウンロード」「テンプレート」「ピクチャ」などのディレクトリ名を英語に変更しておく。

以下コマンドを実行する

```bash
$ LANG=C xdg-user-dirs-gtk-update
```

ダイアログが表示されるので「名前を更新する」を選択し再ログインする

再ログインすると再び同じダイアログが表示されるので、「次回から表示しない」にチェックを入れ、「古い名前のままにする」をクリックする

![ディレクトリ名の言語選択画像](../assets/images/8134128988799080558-DirectoryName-Lang.webp)

上記のやり方でうまく行かない場合、自分でディレクトリを作成し、設定ファイルの内容を書き換える。

homeディレクトリで下記コマンドを実行しディレクトリを作成する

```bash
$ mkdir Desktop Downloads Templates Public Documents Music Pictures Videos
```

設定ファイルを開く

```bash
$ vi ~/.config/user-dirs.dirs
```

ファイルを下記内容に修正する

```text
XDG_DESKTOP_DIR="$HOME/Desktop"
XDG_DOWNLOAD_DIR="$HOME/Downloads"
XDG_TEMPLATES_DIR="$HOME/Templates"
XDG_PUBLICSHARE_DIR="$HOME/Public"
XDG_DOCUMENTS_DIR="$HOME/Documents"
XDG_MUSIC_DIR="$HOME/Music"
XDG_PICTURES_DIR="$HOME/Pictures"
XDG_VIDEOS_DIR="$HOME/Videos"
```

### ディスプレイ電源自動オフ時間の延長

1.  アクティビティ画面で「settings」と検索し「設定」を開く
2.  左側の一覧から「電源」を選択
3.  「ブランクスクリーン」のプルダウンから任意の値を選択

![ディスプレイ自動OFFを解除](../assets/images/8134128988799080558-DisplayAutoSleep.webp)

### Dockにゴミ箱を表示

ゴミ箱へのアクセス頻度は低いが、必要なときはDockにあると便利なので。

端末で以下を実行

```bash
$ gsettings set org.gnome.shell.extensions.dash-to-dock show-trash true
```

元に戻す場合

```bash
$ gsettings reset org.gnome.shell.extensions.dash-to-dock show-trash false
```

### Dock のアプリケーション表示ボタンを一番上へ移動

マウスやタッチパッドはほぼ使用しませんが、アクセス頻度が高い項目なので一番上にしておく。

端末で以下を実行

```bash
$ gsettings set org.gnome.shell.extensions.dash-to-dock show-apps-at-top true
```

元に戻す場合

```bash
$ gsettings reset org.gnome.shell.extensions.dash-to-dock show-apps-at-top
```

### 空のファイルテンプレート

GUIからディレクトリ操作を行う際に、右クリックから新規ファイルを作成できるようにする。

使うか微妙だけどWindowsに慣れた身としてはあったほうが良いと判断。

端末で以下を実行

```bash
$ touch ~/templates/空のドキュメント
```

### ウインドウ自動最大化をオフ

標準でどのアプリを起動してもウインドウが常に最大化状態で開くのでこれを解除する。

端末で以下を実行

```bash
$ gsettings set org.gnome.mutter auto-maximize false
```

元に戻す場合

```bash
$ gsettings reset org.gnome.mutter auto-maximize
```

### ファイルマネージャのアドレスバーをテキスト形式にする

GUIでファイルを操作する際、デフォルトだとファイルマネージャのアドレスバーがボタン表示となっている。

![ディレクトリのアドレス表示](../assets/images/8134128988799080558-DirectoryAddress-01.webp)

これをテキスト表示に変更する

![ディレクトリのアドレス表示](../assets/images/8134128988799080558-DirectoryAddress-02.webp)

端末で以下を実行

```bash
$ gsettings set org.gnome.nautilus.preferences always-use-location-entry true
```

元に戻す場合

```bash
$ gsettings set org.gnome.nautilus.preferences always-use-location-entry false
```

### システム日本語表示の問題対応

細かいところだが、システム上の日本語表示がデフォルトだとおかしい部分がある。

たとえば画面上部に表示されている時計のコロンが全角だったり。

![システムフォントの表示問題](../assets/images/8134128988799080558-system-font.webp)

これを「NT UI JP」というフォントをインスト−ルして対処する。

```bash
$ wget https://launchpad.net/~sicklylife/+archive/ubuntu/fonts-ja/+files/fonts-nt-ui-jp_2_all.deb
$ sudo apt install ./fonts-nt-ui-jp_2_all.deb
$ rm fonts-nt-ui-jp_2_all.deb
```

元に戻す場合

```bash
$ sudo apt remove -y fonts-nt-ui-jp
$ sudo apt autoremove
```

### 強制終了（Ctrl + Alt + Backspace）を有効化

万が一のPCトラブルに備え、ショートカットキーによる強制終了を行えるようにする。（デフォルトではオフとなっている）

以下コマンドを実行する

```bash
$ sudo dpkg-reconfigure keyboard-configuration
```

キーボードの選択画面で該当するものを選択し、「了解」（デフォルトで現在のキーボードが選択されているはず）

![強制終了コマンドの有効化](../assets/images/8134128988799080558-Enable-KillCommand-01.webp)

続いてキーボードレイアウトの「国」を選択し「了解」

![強制終了コマンドの有効化](../assets/images/8134128988799080558-Enable-KillCommand-02.webp)

キーボードのレイアウトを選択し「了解」

![強制終了コマンドの有効化](../assets/images/8134128988799080558-Enable-KillCommand-03.webp)

「AltGrとして機能させるキー」で「キーボード記憶のデフォルト」を選択し「了解」

![強制終了コマンドの有効化](../assets/images/8134128988799080558-Enable-KillCommand-04.webp)

「コンポーズキー」はないので「コンポーズキーなし」を選択し「了解」

![強制終了コマンドの有効化](../assets/images/8134128988799080558-Enable-KillCommand-05.webp)

ようやく「Ctrl + Alt + Backspace」の項目が出るので「はい」を選択する

![強制終了コマンドの有効化](../assets/images/8134128988799080558-Enable-KillCommand-06.webp)

### 動画や音楽再生用のコーデックインストール

```bash
$ sudo apt install ubuntu-restricted-extras
```

### GNOME Shell Extensionsのインストール

GUIにGNOMEを使っている場合、GNOME Shell Extensionsを使用することでさまざまな機能追加や設定を行うことができる。

GNOME Shell Extensionsはブラウザからアクセスして使用する。

私は「火狐原理主義者」なので「Firefox」の設定を行う。

他のブラウザを使用する方は下記サイトを参考にされたし。

[https://linuxfan.info/setup-gnome-shell-extensions:embed:cite]

gnome-shell-extension-prefsインストール

```bash
$ sudo apt install gnome-shell-extension-prefs
```

Firefoxで以下にアクセスしアドオンを追加する

[https://addons.mozilla.org/ja/firefox/addon/gnome-shell-integration/:embed:cite]

### Win zipファイル解凍時の文字化け対応

以下コマンドで必要なパッケージを追加・インストールする

```bash
$ wget -q https://www.ubuntulinux.jp/ubuntu-ja-archive-keyring.gpg -O- | sudo apt-key add -
$ wget -q https://www.ubuntulinux.jp/ubuntu-jp-ppa-keyring.gpg -O- | sudo apt-key add -
$ sudo wget https://www.ubuntulinux.jp/sources.list.d/focal.list -O /etc/apt/sources.list.d/ubuntu-ja.list
$ sudo apt update
$ sudo apt dist-upgrade
$ sudo apt install ubuntu-defaults-ja
```

再起動で設定を反映

### 日本語辞書の拡充

標準で入っているMozcの日本語辞書が貧弱なので有志の方が作成し公開しているMozcに差し替えを行う。

[こちら](https://ja.osdn.net/users/sicklylife/pf/mozc_ut_for_ubuntu/files/?id=26303) のサイトにアクセスし、左側のツリーより該当するUbuntuバージョンのtar.xzをダウンロードする

ダウンロードしたファイルの場所で以下コマンドを実行しファイルを展開、展開されたディレクトリへ移動する

```bash
$ tar xavf ./mozc-* && cd mozc-*/
```

以下コマンドを実行し必要なパッケージをインストールする

```bash
$ sudo apt update && sudo apt upgrade -y && sudo apt install -y devscripts debhelper libibus-1.0-dev pkg-config libxcb-xfixes0-dev libgtk2.0-dev python3-dev gyp protobuf-compiler libprotobuf-dev qtbase5-dev libqwt-qt5-dev libgwengui-qt5-dev libuim-dev libzinnia-dev fcitx-libs-dev gettext desktop-file-utils ninja-build
```

以下コマンドでビルドする。私の貧弱マシンでは10分ほどかかった

```bash
$ sudo ./build_mozc_plus_utdict
```

ビルドが終わったら不要なパッケージを削除する

```bash
$ tail -n 5 /var/log/apt/history.log | grep Install: | sed -e s/"Install: "// | sed -e s/", automatic"//g | sed -e s/"), "/"\n"/g | sed -e s/" (.*$"/""/g | tr '\n' ' ' | xargs sudo apt-get remove -y
```

さきほどのビルドにより複数作成されたdebファイルを下記コマンドですべてインストールする

```bash
$ sudo apt install -y mozc-utils-gui
$ sudo dpkg -i ./mozc-data_*.deb ./mozc-server_*.deb ./mozc-utils-gui_*.deb ./ibus-mozc_*.deb ./fcitx-mozc_*.deb
```

再起動する

テキスト入力できるエリアで試しに「ばーじょん」と入力し、変換候補の中に「UT2-2.23.2815.102+24.2.oss」が含まれていれば成功

※参考サイト：[Mozc UT2をインストールする - Ubuntu 20.04編](https://sicklylife.jp/ubuntu/2004/mozc_ut2.html)

### Livepatchの設定

セキュリティアップデートをインストールした際にUbuntuを再起動しなくてすむようにする。

この機能を利用するには「Ubuntu Oneアカウント」が必要となる。

[こちら](https://login.ubuntu.com/) にアクセスし、「Ubuntu oneアカウント」を作成する

登録したアドレス宛に認証用のメールが届くので送られてきたURLにアクセスし認証を済ます

アクティビティ画面で「Livepatch」と検索し「ソフトウェアアップデート」を開く

「サインイン」ボタンをクリックし、さきほど作成したUbuntu Oneアカウントでサインインする

![Livepatch設定](../assets/images/8134128988799080558-Livepatch-01.webp)

トグルスイッチがオンになり「Livepatchが有効です」と表示されていれば完了。

![Livepatch設定](../assets/images/8134128988799080558-Livepatch-02.webp)

参考サイト：[【Ubuntu18.04】新機能 LivePatchについて](https://mongonta.com/f338-ubuntu-18-04-newfeature-livepatch/)

### ファイアーウォールを有効にする

下記コマンドで「gufw」をインストールする

```bash
$ sudo apt install gufw
```

アクティビティ画面で「gufw」と検索し起動する

「Status」のトグルスイッチをオンにする

![Firewall設定](../assets/images/8134128988799080558-Firewall.webp)

### 「Myrica」フォントをインストール

端末やその他テキスト操作を行うアプリで使うフォントをインストールする。手順はどのフォントでも同様であるが、ここでは「Myrica」をインストールする手順を示す。

[こちら](https://myrica.estable.jp/) にアクセスし、サイト中段にある「Myrica.ttc」と「MyricaM.ttc」をダウンロードする（7zとzipはお好みで）

ダウンロードしたファイルを解凍し、「Myrica.TTC」および「MyricaM.TTC」ファイルを「/usr/share/fonts/truetype」に配置する

下記コマンドでフォント一覧のキャッシュを更新する

```bash
$ fc-cache -fv
```

参考サイト：[Ubuntuで最初にやる設定 - ネガティブログ](https://xvideos.hatenablog.com/entry/ubuntu_setup#フォント設定)

### Mozcのデフォルト入力モードを「ひらがな」にする

まず日本語入力まわりで問題があったのでこれを解決した。

日本語Remix版のUbuntu20.04lTSをインストールすると「Mozc」が標準で入っている。

しかしひとつ問題があり、入力切り替えをするとなぜか入力モードのデフォルトが「直接入力」となっており、日本語入力をするためにログインするたびマウス操作で「ひらがな」に切り替える必要がある。

設定等で変更ができないため、Mozcのソースを入手し修正＆ビルド＆再インストールが必要。

手順が多いので別記事にまとめている。

[https://www.neputa-note.net/2021/10/blogpost05/:embed:cite]

### 日本語入力切り替えのショートカットキーを設定する

入力切り替えをトグル式で行うのが好きではないのでオン・オフそれぞれにショートカットを割り当てる。

個人的なワガママで入力切り替えに「alt」キーを交えて使用したい。

標準で入っているIbusでは「alt」を割り当てることができないため「Fctix」を使用する。

手順が多いので別記事にまとめている。

[https://www.neputa-note.net/2021/10/blogpost06/:embed:cite]

## 参考サイト

- [Ubuntu 20.04 LTS をインストールした後やること13選](https://qiita.com/outou_hakutou/items/ce06cb3c8c355d5fd87c?utm_source=pocket_mylist)
- [Ubuntu 20.04 LTSをインストールした直後に行う設定 & インストールするソフト](https://sicklylife.jp/ubuntu/2004/settings.html)
- [ubuntu20.04インストールしたら最初にやること](https://onobutaonnsenn.naturum.ne.jp/e3347990.html?utm_source=pocket_mylist)
- [Mozc UT2をインストールする - Ubuntu 20.04編](https://sicklylife.jp/ubuntu/2004/mozc_ut2.html)
- [【Ubuntu18.04】新機能 LivePatchについて](https://mongonta.com/f338-ubuntu-18-04-newfeature-livepatch/)
- [Ubuntuで最初にやる設定 - ネガティブログ](https://xvideos.hatenablog.com/entry/ubuntu_setup#フォント設定)
