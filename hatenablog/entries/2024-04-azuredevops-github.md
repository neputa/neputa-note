---
Title: 'AzureDevOpsのリポジトリをgithubからインポートする'
Date: 2024-04-09T21:19:00+09:00
CustomPath: 2024/04/09/azuredevops-github
Category:
  - 'DEV'
---

## 記事概要

Azure DevOpsで管理しているリポジトリをgithub側で使いたいと思い、マイグレーション、クローンなどで手段を探してた。

Azure DevOps側で一時的なクレデンシャルを発行し、github側からインポートするやり方を見つけた。

Github側からAzure DevOpsのリポジトリをインポートする手順について備忘録。

## 作業詳細

Githubにインポート先のリポジトリを作成しておく。

Azure DevOpsのリポジトリを開き、「Clone」ボタンをクリックする。

![Azure DevOpsリポジトリのClone](../assets/images/azure-to-github-01.webp)

「Generate Git Credentials」をクリックする。

![Generate Git Credentials](../assets/images/azure-to-github-03.webp)

HTTPSのURL、Username、Passwordを控えておく。

![HTTPSのURL、Username、Password](../assets/images/azure-to-github-04.webp)

Githubのリポジトリ画面を開き、最下部「...or import code from another repository」の「Import code」ボタンをクリックする。

![「Import code」ボタン](../assets/images/azure-to-github-02.webp)

「Your old repository's clone URL」にAzure DevOpsで取得したURLを入力し、「Begin
import」ボタンをクリックする。

![「Begin import」ボタン](../assets/images/azure-to-github-05.webp)

「Login」と「Private Access Token」にAzure DevOpsで取得したUsernameとPasswordを入力し、「Submit」ボタンをクリックする。

![「Submit」ボタン](../assets/images/azure-to-github-06.webp)

以上。

## 参考記事

[Migrating an Azure DevOps Repo to GitHub - Trailhead Technology Partners](https://trailheadtechnology.com/migrating-an-azure-devops-repo-to-github/)
