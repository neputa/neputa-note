---
Title: '既存のYAMLを使用してAzure Pipelinesを作成する'
Date: 2021-12-24T15:31:00+09:00
CustomPath: 2021/12/24/azure-devops-pipelines-existing-yaml
Category:
  - 'DEV'
---
![アイキャッチ画像](../assets/images/hero__2021__12__azure-devops-pipelines-existing-yaml.webp)

## 経緯と本記事の主旨

モバイルアプリ（Xamarin Forms）を個人開発している。

[https://www.neputa-note.net/2021/02/onethird-release/:embed:cite]

現在、Azure DevOps上のGitリポジトリからAppCenterを経由してGoogle Play Consoleにデプロイしている。

[https://azure.microsoft.com/ja-jp/products/devops/:embed:cite]

[https://azure.microsoft.com/ja-jp/products/app-center/#pricing:embed:cite]

これを、Azure DevOps Pipelines（以降、Pipelines）によりビルドおよびデプロイを一本化しようと試みている。

[https://learn.microsoft.com/ja-jp/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops:embed:cite]

もう少し詳しい経緯はこちらに書いた。

[https://www.neputa-note.net/2021/12/future-plans-for-mydev/:embed:cite]

PipelinesはYAMLファイルに処理を記述していく。

Azure DevOps上のエディタもタスクのテンプレートを追加できたりと便利なのだが、Visual Studio with VsVimで記述し、他のプログラムと一緒にリポジトリで管理したい。

そして軽く躓いたのが、すでにYAMLファイルが存在する場合の新規Pipelinesの作成方法。

大した話ではないのだが、やや分かりにくかった（MS製品のUIは原則不親切だと思っている）ので備忘録としてメモする。

## 既存のYAMLで新規Pipelinesを作成する

### 前提

Pipelinesへ設定するリポジトリ上にYAMLファイルがすでにあること。

### 作業詳細

Pipelinesのページ右上の「New pipeline」をクリックする。

![新規Pipelines作成キャプチャ-1](../assets/images/pipelines-capture01.webp)

ターゲットとなるリポジトリがある環境を選択する（ここではAzure DevOps上のGitリポジトリ）。

![新規Pipelines作成キャプチャ-2](../assets/images/pipelines-capture02.webp)

リポジトリ名を選択する。

![新規Pipelines作成キャプチャ-3](../assets/images/pipelines-capture03.webp)

ここが分かりにくかったがちゃんと書いてある。「Existing Azure Pipelines YAML file」を選択する。

![新規Pipelines作成キャプチャ-4](../assets/images/pipelines-capture04.webp)

ターゲットとなるブランチとYAMLファイルを指定する。

![新規Pipelines作成キャプチャ-5](../assets/images/pipelines-capture05.webp)

完成。あとは保存するなり実行するなり。

![新規Pipelines作成キャプチャ-6](../assets/images/pipelines-capture06.webp)

## 参考

[Create a new pipeline from existing YML file in the repository (Azure Pipelines) - Stack Overflow](https://stackoverflow.com/questions/59067096/create-a-new-pipeline-from-existing-yml-file-in-the-repository-azure-pipelines)

## 終わりに

YAMLテンプレートを選択するならびに「既存のYAMLファイルを〜」が混ざっているのが個人的に分かりづらく、あれこれ時間を食ってしまった。

まだ学習を始めたばかりのPipelinesだけれど、AppCenterと違って処理を自分で細かく定義することができるのは非常に素晴らしい。

他のCI/CDツールに比べると、Azure DevOpsはまだまだユーザが少ないとは思うので、ぜひ利用者がもっと増えて情報が多く得られるようになってほしい。
