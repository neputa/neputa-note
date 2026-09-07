---
Title: 'Azure AD B2C 新規テナント作成時のエラー対処法'
Date: 2020-12-10T13:41:00+09:00
CustomPath: 2020/12/10/azure-ad-b2c-createtenant-error
Category:
  - 'DEV'
---

## 記事概要

Microsoft Azure ActiveDirectory B2Cの新規テナント作成時に発生したエラーの対処に関するメモ。

## エラーメッセージ

> サブスクリプションが名前空間 'Microsoft.AzureActiveDirectory'を使用するように登録されていません。サブスクリプションを登録する方法については、https://aka.ms/rps-not-foundをご覧ください。

![エラー画面](../assets/images/2532886180722454166-b2c_error.webp)

## エラーの原因

サブスクリプションに名前空間「Microsoft.AzureActiveDirectory」が登録されていないため。

## 対処手順

1. 使用するサブスクリプションの概要ページを開く。
1. 画面左メニューの「設定」の「リソースプロバイダー」を開く。
   ![サブスクリプション画面](../assets/images/2532886180722454166-b2c_subscription_detail.webp)

1. 「Microsoft.AzureActiveDirectory」で表示されているプロバイダーをフィルタする。
   ![リソースプロバイダー画面](../assets/images/2532886180722454166-b2c_subscription_resource_provider_01.webp)

1. 「Microsoft.AzureActiveDirectory」を選択し、「登録」をクリックする。
1. 状態が、「Registered」に更新されたら完了。
   ![リソースプロバイダー画面](../assets/images/2532886180722454166-b2c_subscription_resource_provider_02.webp)

以上で冒頭のエラーは回避できる。
