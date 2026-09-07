---
Title: '今後の作業を整理する【個人開発 / Xamarin Forms】'
Date: 2021-12-18T15:57:00+09:00
CustomPath: 2021/12/18/future-plans-for-mydev
Category:
  - 'DEV'
---
![アイキャッチ画像](../assets/images/hero__2021__12__future-plans-for-mydev.webp)

## 自作のモバイルアプリについて

日々の睡眠時間を手入力で記録するモバイルアプリ（アンドロイドのみ）を公開している。

[https://www.neputa-note.net/2021/02/onethird-release/:embed:cite]

今年は身内でいろいろとあり、年初にリリースして以降バージョンアップをサボっていた。

やらなければと思うことが溜まっているので整理のためメモを書いておく。

### 自作のモバイルアプリ「OneThird」の開発環境・使用サービス

#### フレームワーク

- Xamarin Forms（クロスプラットフォームアプリ開発用）
- Prism（MVVMフレームワーク）

#### 使用言語

- C#
- XAML

#### IDE

- Visual Studio Community 2019

#### 認証サービス

- Azure AD B2C

#### データベース

- Azure CosmosDB（クラウド）
- Realm（ローカル）

#### バージョン管理

- Azure DevOpsのGit

#### Google Playへのデプロイ

- Visual Studio AppCenter

#### 広告

- Google AdMob
- Firebase（app-ads.txt用）

## 「やること」の詳細

### Azure AD B2C認証アクセスレイヤの分離

このアプリはアカウントを作らずともモバイル内に睡眠記録データを保存して使用することができる。(Realmを使用）しかし、この場合はアプリを削除したり別の端末では同データにアクセスすることはできない。

またアカウントを作成すると（メールアドレスおよび各種SNS認証に対応）、アカウントに紐付いた睡眠記録データをクラウド上に保存できる。つまり機種変したりアプリを入れ直しても保存したデータにアクセスが可能。

この認証部分にはAzure AD B2Cによる認証機能を使用している。

[https://learn.microsoft.com/ja-jp/azure/active-directory-b2c/overview:embed:cite]

あくまで内部的なことだが、この認証周りの実装がXamarin FormsつまりUI部分に行ってしまっている。

一応ドメイン駆動設計を参考に各レイヤで責任分割をした構造になっているのだけれど、開発当時に認証周りの実装がややこしくXamarin Formsのプロジェクトに組み込んでしまったのだ。

こいつを外部アクセスをつかさどるInfrastructureレイヤへとリファクタリングしたい。

![ビフォーアフター](../assets/images/mobileapp-beforeafter.webp)

というのも、このあと予定している機能追加がユーザ情報に関連するため、後々のメンテナンスを考慮し先にやっておきたい。

### Azure Functionsによるユーザ情報更新API構築

先にも書いたとおり、現在、認証ユーザ情報をAzure AD B2C上で管理している。

いまのところユーザIDさえ維持して認証できれば良いのだが、ユーザ固有の情報を追加したい。（デフォルトの入眠・起床時刻など）

Azure AD B2Cには「カスタム属性」を追加することができる。

この追加属性の値を読み書きするには「Microsoft Graph」使用するのが良いらしい。

そして、Microsoft Graphにはシナリオに応じた認証プロバイダーが用意されている。

[https://learn.microsoft.com/ja-jp/graph/sdks/choose-authentication-providers?tabs=csharp&utm_source=pocket_mylist:embed:cite]

しかし、1. クライアントがモバイルであること、2. 認証をAzure ADではなくAzure AD B2Cで行っていること、この2点が障壁となる。

まずモバイルアプリのため、Confidential Clientはサポート対象外のため選択肢から外れる。

[https://learn.microsoft.com/ja-jp/entra/identity-platform/msal-authentication-flows#client-credentials:embed:cite]

となると、インタラクティブに取得した認証トークンを使用することとなるが、Azure AD B2Cのユーザフローで取得したトークンではGraph APIにアクセスできないとのこと。

- [Azure ad and Azure ad b2c token validation failure](https://stackoverflow.com/questions/46689260/azure-ad-and-azure-ad-b2c-token-validation-failure)
- [Azure B2C: Microsoft Graph API - InvalidAuthenticationToken](https://stackoverflow.com/questions/60164842/azure-b2c-microsoft-graph-api-invalidauthenticationtoken?rq=1)

いろいろ調べて回っているが、モバイルアプリからダイレクトにアプローチする方法が見つけることはできなかった。（なにかよい方法をご存知の方、教えていただけると泣いて喜びます）

ということで、アプリとMicrosoft Graphの間にAzure FunctionsによるAPIを立てることを考えた。

Azure Functionsは使ったことがないが、HTTP Requestで呼びだすことができるし、Confidential ClientとしてMicrosoft Graphにアクセスすることもできるようだ。

[https://learn.microsoft.com/ja-jp/azure/azure-functions/functions-overview?pivots=programming-language-csharp:embed:cite]

ということで、後のユーザ情報管理に向け、Azure Functionsアプリにチャレンジしてみる。

### デプロイ環境の変更（AppCenterからAzure DevOps）

現在、Azure DevOps上のGitリポジトリでソースを管理し、AppCenterでビルドおよびGoogle Playへのデプロイを行っている。

アプリをリリースした当時、偶然AppCenterによるデプロイの手順を丁寧に書いたブログを見つけたため、このような環境となっている。

[https://shuhelohelo.hatenablog.com/entry/2020/07/10/122832:embed:cite]

Azure DevOpsには、PipelinesというビルドおよびデプロイなどをYAMLファイルで自由に定義し実行するサービスがある。

[https://learn.microsoft.com/ja-jp/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops:embed:cite]

このAzure Pipelinesを使用しCI/CD環境を一本化したい。

学習ボリュームが一気に膨らみそうだが、使いこなせばかなり便利になるのでぜひ実現したい。

## まとめ

ざっとやってみたい、やっておきたいことをまとめた。

年明けになるとは思うが、スケジュールをひき早めに取り組みたい。

来年はMAUIがやってくる。

[https://learn.microsoft.com/ja-jp/dotnet/maui/what-is-maui?view=net-maui-8.0:embed:cite]

様子を見つつ移行するんだろうなと思うのだが、個人的にはMobile Blazor Bindingsに期待している

[Experimental Mobile Blazor Bindings](https://docs.microsoft.com/en-us/mobile-blazor-bindings/)

勤務先で使用する業務アプリを作る予定がありいろいろと検討しているのだが、BlazorでSPAアプリとするのが良さそうな結論になりつつある。

自作アプリ開発を通じいろいろ情報収集を行っているなかで、Xamarin FormsよりBlazor（というよりASP .NET Core）の方が、進化が早い感じることはしばしばある。

Dependency Injectionやログ出力など細かいところでASP .NET Coreのほうが便利そうだなと思う。

Xamarinは、細かいところで面倒が多い。あくまで個人の感想だが。

私のアプリの目標は「睡眠記録を蓄積し、天候等のデータと照合し、不眠のトリガーを見つけたい」だ。

開発環境や手法はあくまで手段。楽しみながら学んでいきたい。

来年は今年よりも多くに着手できると良いのだけれど。

_Top Photo by：[Charles Deluvio](https://unsplash.com/@charlesdeluvio?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/plan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_
