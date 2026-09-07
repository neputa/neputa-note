---
Title: '04．はじめてスマホアプリを作ってみた（設計フェーズ）'
Date: 2021-03-03T11:30:00+09:00
CustomPath: 2021/03/03/first-mobile-app-04
Category:
  - 'DEV'
---
![アイキャッチ画像](../assets/images/hero__2021__03__first-mobile-app-04.webp)

## 記事の概要

こちらの一覧の4つ目、「設計フェーズ」の記事。

1. [検討フェーズ（どんなアプリを作るか）](/2021/02/28/first-mobile-app-01)
1. [要件フェーズ（どんな要件のアプリにするか）](/2021/03/01/first-mobile-app-02)
1. [調査フェーズ（どんな技術を使うか）](/2021/03/02/first-mobile-app-03)
1. 設計フェーズ（どうやって作るか）【今回】
1. [開発フェーズ（実際に作りはじめる）](/2021/03/04/first-mobile-app-05)
1. [公開フェーズ（アプリを公開する）](/2021/03/05/first-mobile-app-06)
1. [保守フェーズ（公開から現在まで）](/2021/03/06/first-mobile-app-07)

ダイジェストで読みたい方はこちらの記事を。

[https://www.neputa-note.net/2021/02/13/onethird-release:embed:cite]

インストールはこちらから。

<a href='https://play.google.com/store/apps/details?id=com.neputafactory.onethird&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1' target='_blank' >

![Google Play で手に入れよう](../assets/images/google-play.webp)

</a>

> [!WARNING]
> Androidのみ iOS版は現在リリース未定

## はじめてのスマホアプリ開発 設計フェーズ

### スマホアプリの設計を開始する

![an image of design](../assets/images/3426260346263224275-med-badr-chemmaoui-ZSPBhokqDMc-unsplash.webp "Photo by：<a href='https://unsplash.com/@medbadrc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText' target='_blank'>Med Badr Chemmaoui</a> in <a href='https://unsplash.com/photos/ZSPBhokqDMc' target='_blank'>Unsplash</a>")

[前回](/2021/03/first-mobile-app-03/)は、スマホアプリ開発に必要なフレームワークや言語、その他サービスを決めていく過程について書いた。

ここまでで「どんなアプリを作るか」「要件をどうするか」「どの技術を使うか」が決まった。いよいよ設計作業に着手する。

できる限り設計作業を進め、開発ツールを立ち上げているときはコーディングに専念できるよう準備を進めていきたい。

### 全体のアーキテクチャを考える

![blog image](../assets/images/3426260346263224275-alex-wong-l5Tzv1alcps-unsplash.webp "Photo by：<a href='https://unsplash.com/@killerfvith?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText' target='_blank'>Alex wong</a> in <a href='https://unsplash.com/photos/l5Tzv1alcps' target='_blank'>Unsplash</a>")

この時点でわかっていることは、「画面構成」「画面遷移」「各種機能」の3つ。

これを設計に落とし込んでいくにはどうすればいいか。

今回の作業と並行し、設計に関する情報をWebや書籍で調べていった。

その中で、設計作業にとくに役立ったのが以下。

#### 参考にしたウェブサイト

- [Peacock-ANDERSON](https://school.anderson02.com/)

#### 参考にした書籍

- オブジェクト指向のこころ（SOFTWARE PATTERNS SERIES）
- ドメイン駆動設計入門ボトムアップでわかる！ドメイン駆動設計の基本
- Clean Architecture　達人に学ぶソフトウェアの構造と設計

各書籍等の内容についてはこちらの記事にもまとめている。

[https://www.neputa-note.net/2021/02/onethird-release/:embed:cite]

一読してすべてが理解できたわけでは当然ない。

今回の作業工程で必要な情報がどの本のどこに書いてありそうかを把握し、その都度ウェブ検索で周辺情報を広いながら活用した。

### なぜシステムアーキテクチャを理解しておきたかったか

いざプログラミングをする際、どのファイルにどんなコードを書けばいいか迷ったりしないだろうか。

このあたりは設計に関する知識不足が大いに影響しているのだと思われた。

### 「ドメイン駆動開発」を参考にする

![an image of ddd](../assets/images/3426260346263224275-ddd-referencia.webp "Photo by：<a href='https://brazilianexperience.com/english-what-is-ddd-and-ddi/' target='_blank'>Brazilian Experience</a>")

今回のアプリは非常に規模の小さいモノでオーバースペックな気もしするが、「ドメイン駆動開発」をとくに参考にした。

初心者のわたしが正しくドメイン駆動開発を実践できたわけではないが、先に挙げた迷いが払しょくされ大きな助けとなった。

「睡眠記録を保存する」と一口に言っても、いざ設計を考え始めると、

- その日の記録対象の睡眠時間の範囲はどうするか
- 起床時間が就寝時間より過去だとおかしい
- 重複した時間帯を記録させたくない

などいくつもルールが必要なことが分かってくる。

#### 要件をプログラムでどう表現すればいいか

具体的に言うと、どのファイルに書けばいいか迷うわけだ。

上記の参考にした書籍では、こういったコアルールは「Domain」に書こう！とある。

今回、結果的に2つのデータベースを切り替える機能を実装した。

では、データベースとやり取りする処理はどこに書けばいいか。

「Infrastructure」だ。

こんな具合に、アプリの各機能やルールをプログラミンでどう表現していくか、システムアーキテクチャが助けてくれる。

#### アーキテクチャを考慮するメリット

また、「ドメイン駆動開発」や「Clean Architecture」を参考に設計すると、後々のメンテナンス不可を軽減するメリットもあるという。

現段階では非常に小規模なアプリだが、いずれ分析などの機能追加をする野望がある。

不完全ではあると思うが今回構築したこの設計は、後々わたしを助けてくれると思う。

#### ただ最初はやはり難しい

本に書かれていることも、実際に壁にぶつかって初めてその必要性を実感できたりする。

一行もコードを書かずに設計を洗練させるなんて初心者には難しい。

理解できなかったとしてもそこで手を止めず、何度でもイチから作り直す気持ちでやってみるといいかもしれない。

個人開発の良さの1つではないだろうか。

実際わたしは、わからないまま進め「そういうことか！」となり、使えるコードは流用し、イチから作り直すことを何度かした。

これを繰り返し、納得のいく設計に近づけていった。

### 実際に作った設計内容（コンポーネント図）

以下は、今回のアプリを構成するコンポーネント図。

「Visual Studio」を使用しているため、図の「Domain」などは独立した「プロジェクト」として構成した。

#### コンポーネント図

![Project構成図](../assets/images/3426260346263224275-onethird-project-diagram.webp 'Project構成図')

#### Domain

- Domain Model
  - いつからいつまで当日分とするとか、二度寝は記録できるけど重複した時間帯は保存しない、といったビジネスルール
- Repository
  - インターフェイスなど。

#### Application

Xamarin側のCoreとドメインのインターフェイスを介したInfrastructureとのやり取りを中継。

#### Core

Xamarin Formsのcommonプロジェクト。Android、iOSの共通部分を実装。

#### Android・iOS

各プラットフォームに依存する部分を実装。

#### Infrastructure

RealmとCosomosDBとのやり取りを実装。

ユーザがログインしていればCosmosDB、そうでなければRealmに接続する。

RealmはSQLiteのようなローカルDBを提供してくれる製品。

#### Tests

ユニットテストをここに書く。

テスト対象のプロジェクト毎にフォルダを作り、その中にテストファイルを置く。

「Visual Studio」固有の話しになるが、各プロジェクトを構成し、参照を貼る方法は以下の記事を参考にした。

[https://anderson02.com/nddd/:embed:cite]

[https://anderson02.com/xamarin-prism_all/:embed:cite]

### 各プロジェクト（コンポーネント）の中身を考える

![blog image](../assets/images/3426260346263224275-octavian-dan-b21Ty33CqVs-unsplash.webp "Photo by：<a href='https://unsplash.com/@octadan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText' target='_blank'>Octavian Dan</a> in <a href='https://unsplash.com/s/photos/project?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText' target='_blank'>Unsplash</a>")

これでアプリ全体の骨格ができた。

次は、各プロジェクトの中身を考えていく。

本来であれば「[UML](https://e-words.jp/w/UML.html)」などを扱えるツールでドキュメントを作成しながら設計を進めていくべきかと思う。

しかし、ドキュメントをひとつひとつ作成することはできれば避けたい。

最終的なアウトプットはできるだけ自動生成できるツールを頼る。

#### まずは試行錯誤

手順としては、まず紙とペン、ツールでも何でもいいのでどのような「クラス」を展開していくかを考えた。

ちなみにこの試行錯誤は「drawio」というツールを使った。

Web版ツールとして公開されていおり、Microsoft Storeから入手することもでる。

[https://ferret-plus.com/8408:embed:cite]

主に考えていくことは、クラス名、そのクラスの目的、実装するプロパティやメソッド。

一気に全体を行うのはキツイ。まずはDomainプロジェクトを仕上げた。

ここでは他のプロジェクトで使用するインターフェイスも考えていくことになる。

#### そして清書は実際のソースファイルに

ある程度まとまったら、実際にVisual Studioでフォルダを構成し、クラスファイルを作成する。

そして、drawioでメモ書きだった内容を、クラス、メソッド、プロパティに「XMLコメント」として、しっかり書く。

[https://learn.microsoft.com/ja-jp/visualstudio/ide/reference/generate-xml-documentation-comments?view=vs-2019:embed:cite]

「XMLコメント」は、「docfx」というツールでHTMLファイルに出力できる。

- [DocFXを使ってC#のソースコードからAPIのドキュメントを作成](https://qiita.com/sukakako/items/072b6145f15683eb0add)
- [DocFX](https://dotnet.github.io/docfx/index.html)

コマンドラインツールだが、非常に便利でソリューション全体をひとつのウェブサイトに出力できる。

また「Visual Studio」の機能として、クラス図を出力することもできる。

[Visual Studioでクラスのコードからクラス図を作る](https://qiita.com/elu_jaune/items/7a66e18cd72fcbb2be40)

Enterprise版であれば依存関係図も自動で作成できる。ほしいけど高い。

[https://learn.microsoft.com/ja-jp/visualstudio/modeling/create-layer-diagrams-from-your-code?view=vs-2019:embed:cite]

この他、複雑な処理を設計するシーケンス図を「drawio」で作成した。

Visual Studioは静的解析が走るためエラーや警告が出まくる。

ここでの目的はあくまでクラス構成、クラスやメソッド等の命名など骨組みを組み上げていくこと。全無視で仕上げた。

エラー等は実装段階できっちり潰す。

## まとめ

![an image of a conclusion](../assets/images/3426260346263224275-pexels-ann-h-1888005.webp "Photo by：<a href='https://www.pexels.com/ja-jp/@ann-h-45017?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels' target='_blank'>Ann H</a> in <a href='https://www.pexels.com/ja-jp/photo/1888005/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels' target='_blank'>Pexels</a>")

実装時には、実装方法に頭を使いたい。

このぐらい決まれば、どうにか専念できる気がした。

前段でも書いたが、一度も実装したことがないものを机上の設計でまとめあげるのはとても難しい。

わたしはサンドバッグのような仮プロジェクトをボコボコ作っては試し、あまたのプロジェクトの屍を築きながら作業を進めた。

次回は、開発フェーズ（実際に作りはじめる）についてまとめる予定。

### はじめてスマホアプリを作ってみた 記事一覧

1. [検討フェーズ（どんなアプリを作るか）](/2021/02/first-mobile-app-01/)
1. [要件フェーズ（どんな要件のアプリにするか）](/2021/03/first-mobile-app-02/)
1. [調査フェーズ（どんな技術を使うか）](/2021/03/first-mobile-app-03/)
1. 設計フェーズ（どうやって作るか）【今回】
1. [開発フェーズ（実際に作りはじめる）](/2021/03/first-mobile-app-05/)
1. [公開フェーズ（アプリを公開する）](/2021/03/first-mobile-app-06/)
1. [保守フェーズ（公開から現在まで）](/2021/03/first-mobile-app-07/)
