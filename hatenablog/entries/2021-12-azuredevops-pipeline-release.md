---
Title: 'AndroidアプリをAzure Pipelinesでビルド・リリースする方法【Xamarin.Forms】'
Date: 2021-12-31T02:31:00+09:00
CustomPath: 2021/12/31/azuredevops-pipeline-release
Category:
  - 'DEV'
---
![アイキャッチ画像](../assets/images/hero__2021__12__azuredevops-pipeline-release.webp)

## 本記事の主旨

Xamarin.Formsで作成したAndroidアプリを、AzureDevOps Pipelinesで、ビルドからGoogle Play Consoleへリリースするまでの手順をまとめる。

### 環境

#### Android開発フレームワーク

Xamarin.Forms 5.0.0.2244

#### ビルド・リリース環境

Azure DevOps Pipelines

#### リリース先

Google Play Console（Google Cloud Platformのサービスアカウントを使用）

### 前提条件

- ソースファイルはAzure DevOpsのRepos（Git）で管理している
- ビルドで使用するYAMLファイルは事前に作成しリポジトリに含めている
- 成果物のフォーマットはaab
- Google Play Consoleへのリリースに必要なGoogle Cloud Platformのサービスアカウントを事前に登録し鍵を取得している
- Azure DevOpsに「[Google Playのプラグイン](https://marketplace.visualstudio.com/items?itemName=ms-vsclient.google-play)」をMarketplaceよりインストール済みである
- リリース処理については、すでに一度Google Play Consoleにアプリを公開済みであること（初回は手動で行う必要があるため）

## 作業詳細

ビルドはYAMLファイルを事前に作成しPipelineで行う。 Google Play Consoleへの発行はPipelinesのReleaseをブラウザで設定し行う。

### Azure DevOps Pipelinesによるビルド

#### Library設定

Azure DevOps PipelinesのLibraryに以下を登録する。

- Variable group（Pipelineでソース上のProduct用シークレット情報を置換する際に使用）
- Secure files（Google Play Consoleへaabをリリースる際に必要なKeyStoreファイル）

Variable groupの登録手順は下記を参照

[https://blog.okazuki.jp/entry/2020/03/02/002723:embed:cite]

[https://learn.microsoft.com/ja-jp/azure/devops/pipelines/library/variable-groups?view=azure-devops&tabs=yaml:embed:cite]

Secure fileの登録手順は下記を参照

[https://learn.microsoft.com/ja-jp/azure/devops/pipelines/library/secure-files?view=azure-devops:embed:cite]

KeyStoreファイルについてはこちらを参照

[https://support.google.com/googleplay/android-developer/answer/9842756?hl=ja:embed:cite]

作業後のLibraryはこんな感じ

![Libraryのキャプチャ-01](../assets/images/pipelines-library-capture-01.webp)

![Libraryのキャプチャ-02](../assets/images/pipelines-library-capture-02.webp)

#### YAMLファイル作成

Pipelineのビルドで使用するYAMLファイルを事前に作成しておく。（ブラウザポータル上で作成することも可能）

処理の概要は以下のとおり。

1.  変数の定義
2.  ソースコード上のシークレット情報置換（Bash）
3.  Android Manifestのバージョンコード置換（PowerShell）
4.  NugetToolインストール
5.  Keystoreファイルのダウンロード
6.  ビルド
7.  aabファイルの発行

シークレットはjsonやXMLであれば置換するライブラリが用意されているが、C#の定数クラスを使っているので自力でシェルスクリプトによる置換を行っている。

実際のYAMLファイルはこんな感じ。

```yaml
stages:
  - stage: Build
    # 他の環境ではAndroid ManifestのXMLファイルを処理する際にうまく置換が行われなかったためWindowsを使用
    pool:
      vmImage: 'windows-latest'

    jobs:
      - job: GenerateAab

        variables:
          # Libraryに登録したVariable groupを呼び出し
          - group: SecretsForRelease
          # メジャー＆マイナーバージョンコードを定義
          - name: appVersion
            value: '1.1'
          - name: buildConfiguration
            value: 'Release'

        # Product用のシークレットを定義するクラスファイルの置換処理
        # Variable groupに登録した変数を呼び出し、シェルで置換する
        steps:
          - task: Bash@3
            displayName: 'Insert Secret Variables'
            inputs:
              targetType: 'inline'
              script: |
                echo '#######################################################'
                echo ' Environment Variables data replace'
                echo '#######################################################'
                FilePathVariables='OneThird.Core/Constants/Variables.cs'
                echo ''
                echo '#######################################################'
                echo ' Variables.cs'
                echo ' Target file path - ' $FilePathVariables
                echo '#######################################################'
                echo ''
                echo 'AdmobUnitIdBanner - $(AdmobUnitIdBanner)'
                sed -i -e 's|\[AdmobUnitIdBanner\]|$(AdmobUnitIdBanner)|' $FilePathVariables
                echo ''
                echo 'AdmobUnitIdInterstitial - $(AdmobUnitIdInterstitial)'
                sed -i -e 's|\[AdmobUnitIdInterstitial\]|$(AdmobUnitIdInterstitial)|' $FilePathVariables
                echo ''
                echo 'B2cPasswordResetPolicy - $(B2cPasswordResetPolicy)'
                sed -i -e 's|\[B2cPasswordResetPolicy\]|$(B2cPasswordResetPolicy)|' $FilePathVariables
                echo ''
                echo 'B2cSignInPolicy - $(B2cSignInPolicy)'
                sed -i -e 's|\[B2cSignInPolicy\]|$(B2cSignInPolicy)|' $FilePathVariables
                echo ''
                echo 'B2cTenantDomainName - $(B2cTenantDomainName)'
                sed -i -e 's|\[B2cTenantDomainName\]|$(B2cTenantDomainName)|' $FilePathVariables
                echo ''
                echo 'B2cTenantDomainURL - $(B2cTenantDomainURL)'
                sed -i -e 's|\[B2cTenantDomainURL\]|$(B2cTenantDomainURL)|' $FilePathVariables
                echo ''
                echo 'B2cAppMobileClientId - $(B2cAppMobileClientId)'
                sed -i -e 's|\[B2cAppMobileClientId\]|$(B2cAppMobileClientId)|' $FilePathVariables
                echo ''
                echo '#######################################################'
                echo " Show result"
                echo '#######################################################'
                cat $FilePathVariables
                echo ''
                echo ''
                echo ''
                FilePathCosmosDBConstants='OneThird.Infrastructure/CosmosDb/CosmosDBConstants.cs'
                echo '#######################################################'
                echo ' CosmosDBConstants.cs'
                echo ' Target file path - ' $FilePathCosmosDBConstants
                echo '#######################################################'
                echo ''
                echo 'CosmosdbAccountUrl - $(CosmosdbAccountUrl)'
                sed -i -e 's|\[CosmosdbAccountUrl\]|$(CosmosdbAccountUrl)|' $FilePathCosmosDBConstants
                echo ''
                echo 'CosmosdbAccountKey - $(CosmosdbAccountKey)'
                sed -i -e 's|\[CosmosdbAccountKey\]|$(CosmosdbAccountKey)|' $FilePathCosmosDBConstants
                echo ''
                echo '#######################################################'
                echo " Show result"
                echo '#######################################################'
                cat $FilePathCosmosDBConstants
                echo ''
                echo ''
                echo '#######################################################'
                echo ' Finished - Environment Variables data replace'
                echo '#######################################################'
                echo ''
                echo ''

          # Android ManifestのVersionCodeおよびVersionNameを置換する
          # VersionCodeは年月日時、VersionNameは最初に定義したappVersion.VersionCode
          - task: PowerShell@2
            displayName: 'Updating Version Code and Name in Android Manifest'
            inputs:
              targetType: 'inline'
              script: |
                [string] $sourcePath = "$(System.DefaultWorkingDirectory)\OneThird.Android\Properties\AndroidManifestRelease.xml"
                [string] $appVersionName = "$(AppVersion).$(Build.BuildId)"
                [string] $appVersionCode = Get-Date -Format "yyMMddHH"

                [xml] $androidManifestXml = Get-Content -Path $sourcePath

                Write-Host "Original Manifest:"
                Get-Content $sourcePath | Write-Host

                $VersionName= Select-Xml -xml $androidManifestXml  -Xpath "/manifest/@android:versionName" -namespace @{android = "http://schemas.android.com/apk/res/android" }

                $oldVersionName= $VersionName.Node.Value;

                Write-Host " (i) Original Version Name: $oldVersionName"

                $VersionName.Node.Value = $appVersionName

                Write-Host " (i) New Package Name: $appVersionName"

                $VersionCode= Select-Xml -xml $androidManifestXml  -Xpath "/manifest/@android:versionCode" -namespace @{android = "http://schemas.android.com/apk/res/android" }

                $oldVersionCode = $VersionCode.Node.Value;

                Write-Host " (i) Old Version Code: $oldVersionCode"

                $VersionCode.Node.Value = $appVersionCode

                Write-Host " (i) New App Name: $appVersionCode "

                $androidManifestXml.Save($sourcePath)

                Write-Host "Final Manifest:"
                Get-Content $sourcePath | Write-Host

          # NugetToolインストール
          - task: NuGetToolInstaller@1
            displayName: 'Installing Nuget'

          - task: NuGetCommand@2
            displayName: 'Restoring Nugets'
            inputs:
              command: 'restore'
              restoreSolution: '**/*.sln'

          # LibraryからKeystoreファイルをダウンロード
          - task: DownloadSecureFile@1
            displayName: 'Download keystore'
            name: keystore
            inputs:
              secureFile: 'upload_keystore.jks'

          # ビルド
          - task: XamarinAndroid@1
            displayName: 'Build aab'
            inputs:
              projectFile: '**/OneThird.Android.csproj'
              outputDirectory: '$(Build.BinariesDirectory)'
              configuration: '$(BuildConfiguration)'
              clean: true
              msbuildVersionOption: 'latest'
              msbuildArguments: '-restore -t:SignAndroidPackage -p:AndroidPackageFormat=aab -p:AndroidKeyStore=True -p:AndroidSigningKeyStore=$(keystore.secureFilePath) -p:AndroidSigningStorePass=$(KeystorePassword) -p:AndroidSigningKeyAlias=$(KeystoreAlias) -p:AndroidSigningKeyPass=$(KeystorePassword)'
              jdkOption: 'JDKVersion'

          # aabファイル発行
          - task: PublishPipelineArtifact@1
            displayName: 'Publishing aab artifacts'
            inputs:
              targetPath: '$(Build.BinariesDirectory)'
              artifact: AndroidAabPackage
              publishLocation: 'pipeline'
```

このYAMLファイルを対象とした新規Pipelineを作成し、実行するとRelease可能なaabファイルを作成することができる。

既存のYAMLファイルを対象とした新規Pipelineの作成手順は以下記事を参照。

[https://www.neputa-note.net/2021/12/azure-devops-pipelines-existing-yaml/:embed:cite]

### Azure DevOps Pipelinesによるリリース

Azure DevOpsのPipelines→Releasesより、Create Releaseをクリック

![Libraryのキャプチャ-03](../assets/images/pipelines-library-capture-03.webp)

「empty job」をクリック

![Libraryのキャプチャ-04](../assets/images/pipelines-library-capture-04.webp)

Releaseジョブのstage nameを入力し右上の×で閉じる

![Libraryのキャプチャ-05](../assets/images/pipelines-library-capture-05.webp)

「Add an artifact」をクリック

![Libraryのキャプチャ-06](../assets/images/pipelines-library-capture-06.webp)

対象となるartifact（aabファイル）の条件を入力し、「add」をクリック

![Libraryのキャプチャ-07](../assets/images/pipelines-library-capture-07.webp)

※ビルドをトリガーで自動実行するようにしたい場合は、Artifactのイナズマアイコンをクリックし、「Continuous deployment trigger」を「Enable」にする。

Stagesの「1 job, 0 task」のハイパーリンクをクリック

![Libraryのキャプチャ-08](../assets/images/pipelines-library-capture-08.webp)

「Agent job」の右横にある「＋」をクリック

![Libraryのキャプチャ-09](../assets/images/pipelines-library-capture-09.webp)

Google Playで検索し、「Google Play - Release」の「Add」をクリック

※Google Playプラグインを追加していない場合は、MarketplaceよりAzure DevOpsにインストールする →

[Google Playのプラグイン](https://marketplace.visualstudio.com/items?itemName=ms-vsclient.google-play)

![Libraryのキャプチャ-10](../assets/images/pipelines-library-capture-10.webp)

「Release to internal」を選択し、「Service connection」の「＋New」をクリック

![Libraryのキャプチャ-11](../assets/images/pipelines-library-capture-11.webp)

Google Cloud Platformに登録してあるサービスアカウントの情報を入力し「Save」をクリック

- サービスアカウントの作成手順は、「[Google Play Console APIを使う方法｜kosuke matsumura｜note](https://note.com/shcahill/n/n1c7d72df3c4d)」を参照
- 「Private key」は、Google Cloud Platformのサービスアカウントに登録してあるjson形式の鍵ファイルの「private_key」の値（-----BEGIN PRIVATE KEY----- で始まる）を丸ごとコピペする
- ここで登録したService connectionは、Project Settings→Service connectionsから変更できる

![Libraryのキャプチャ-12](../assets/images/pipelines-library-capture-12.webp)

「Application id (com.google.MyApp)」、「Bundle path」、「Language code」を入力し、「Save」をクリック

![Libraryのキャプチャ-13](../assets/images/pipelines-library-capture-13.webp)

RunでReleaseを実行すれば完了

## まとめ

Github Actions等にくらべ、情報がかなり少なく、公式ドキュメントのみでは理解しきれなかったため非常に苦労した。

しかし、この一度の苦労で今後のビルドおよびリリースを自動化できることを思えばチャレンジするだけの価値はあると思う。

間違いや、もっとこうすると良いよーや、その他ご意見ご感想などあれば、コメントや [Mastodon](https://fedibird.com/web/accounts/110804358773982782/about)で教えていただけるとうれしい。

## 参考サイト

- [Create Xamarin.Forms Android App Bundle (aab) and release it to Google Play Store with DevOps YAML - github.com](https://gist.github.com/mkieres/71f155a41975efa622c587ef680d72ac?utm_source=pocket_mylist)
- [DevOps for Android App Bundles - Xamarin Blog](https://devblogs.microsoft.com/xamarin/android-app-bundles-azure-devops/?utm_source=pocket_mylist)
- [How to setup CI CD pipelines for Android with Azure DevOps - Arjav Dave](https://arjavdave.com/2021/03/16/how-to-setup-ci-cd-pipelines-for-android-with-azure-devops/?utm_source=pocket_mylist)
