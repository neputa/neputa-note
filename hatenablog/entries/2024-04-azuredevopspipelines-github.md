---
Title: 'Azure PipelinesでGithub Oranizationsのリポジトリを参照できるようにする'
Date: 2024-04-14T23:43:00+09:00
CustomPath: 2024/04/14/azuredevopspipelines-github
Category:
  - 'DEV'
---

## 記事概要

AzureDevOpsのPipelinesにおいて、Github Organizationsのリポジトリを参照する設定作業の備忘録。

## 前提条件

- AzureDevOps、Githubそれぞれのアカウントがある
- GithubにOrganizationsが登録されているかつリポジトリが存在する
- GithubアカウントがOrganizationsに所属かつリポジトリ参照権限がある

## 作業詳細

「New Pipeline」からリポジトリ選択画面「Where is your code?」を表示し、「Github」を選択する。

![Pipelinesのリポジトリ選択画面](../assets/images/azuredevops-github-01.webp)

Githubアカウントの認証を行う。

認証が通ると該当アカウントのリポジトリが表示されるが、組織のリポジトリは表示されない。

ここで「connection」のリンクをクリックする。

![「connection」のリンク](../assets/images/azuredevops-github-02.webp)

「Authorize」ボタンが表示されるのでクリックする。

![「Authorize」ボタン](../assets/images/azuredevops-github-03.webp)

先ほど認証を行ったGithubアカウントと、所属するGithub Organizationsが表示される。

該当するOrganizationsを選択する。

![Organizations選択画面](../assets/images/azuredevops-github-04.webp)

全リポジトリまたは特定のリポジトリとするかを選択し、「Install」をクリックする。

![Installボタン](../assets/images/azuredevops-github-05.webp)

Github側にAzure Pipelinesを認証することの許可を聞いてくるので「Authorize Azure Pipelines」をクリックする。

![「Authorize Azure Pipelines」をクリック](../assets/images/azuredevops-github-06.webp)

Github Organizationsのリポジトリが表示される。

![Github Organizationsのリポジトリ](../assets/images/azuredevops-github-07.webp)

## 参考記事

[Creating a service connection for a GitHub Organization in Azure DevOps – DevOps Nights – Improving the value delivered with DevOps](http://blog.devopsnights.io/Creating-a-service-connection-for-a-GitHub-Organization-in-Azure-DevOps/)
