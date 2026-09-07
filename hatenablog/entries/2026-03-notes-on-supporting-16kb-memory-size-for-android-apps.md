---
Title: 'Androidアプリ16kbメモリページサイズ対応に関するメモ'
Date: 2026-03-16T05:25:19+09:00
CustomPath: 2026/03/16/notes-on-supporting-16kb-memory-size-for-android-apps
Category:
  - 'DEV'
  - 'Apps'
  - 'MAUI'
  - 'dotnet'
---

趣味でスマホアプリ開発をしている。

- OneThird

[https://www.makuta-kobo.net/products/onethird/:embed:cite]

- CheckListMaker

[https://www.makuta-kobo.net/products/checklistmaker/:embed:cite]

昨年、GoogleからAndroidアプリのメモリページサイズが16kbになることが発表され、これに伴う対応が必要になった。

> 16 KB Google Play 互換性要件
> 2025 年 11 月 1 日より、Google Play に提出され、Android 15 以降のデバイスを対象とするすべての新規アプリと既存のアプリのアップデートは、64 ビット デバイスで 16 KB のページサイズをサポートする必要があります。<br>
> -- [16 KB ページサイズのサポート | Android Developers](https://developer.android.com/guide/practices/page-sizes?hl=ja) より

すぐに対応するのが面倒だったので、最大2026年5月31日まで期限を延長できるとのことで迷わずそうした。

満を持して今回対応を行ったが、.NET MAUI開発であること、ビルドにAzure DevOpsを使用していること固有の注意点があったので、備忘録としてまとめておく。

## 16kbメモリページサイズ対応の概要

### .NETバージョンのアップグレードによる解決

.NET MAUIの場合、Android 15の16KBページサイズ要件への対応は、.NET 9.0以降で提供される。

> The good news is that .NET MAUI 9 supports 16 KB page sizes out of the box, so make sure that your .NET MAUI (and .NET for Android) app is on .NET 9 and your app should automatically be compatible with the 16 KB page size requirement.
>
> Please note, .NET MAUI 8 is out of support as of May 14, 2025 per the .NET MAUI support policy.<br>
> -- [.NET Blog](https://devblogs.microsoft.com/dotnet/maui-google-play-16-kb-page-size-support/)より引用

私のアプリは.NET 8.0のロングタームサポート（LTS）バージョンで開発している。

どうせなら、同じくLTSである.NET 10.0に上げてしまおうと思い、.NET 10.0にアップグレードした。

### Azure DevOps Pipelines での.NET 10.0 対応

poolでwindows-latestを指定している場合、2026年3月現在、.NET 10.0をビルドするMSBuild18が正式サポートされておらず、ビルドエラーになる。

対応として、パブリックプレビューのwindows-2025-vs2026イメージを指定する必要がある。

```yaml build-script
pool:
  vmImage: 'windows-2025-vs2026' # windows-latest ではなくプレビュー版を指定
```

- [Windows Server 2025 with Visual Studio 2026 is now available as a public beta · Issue #13638 · actions/runner-images](https://github.com/actions/runner-images/issues/13638)

## まとめ

- Androidアプリの16KBメモリページサイズ対応は、.NET MAUI 9以降で自動的にサポートされる。
- .NET 10.0にアップグレードすることで、最新のLTSバージョンで開発を続けることができる。
- 2026年3月時点でAzure DevOps Pipelinesで.NET 10.0をビルドするには、windows-2025-vs2026イメージを使用する必要がある。
- 16KBページサイズ対応は、2026年5月31日までに行う必要があるため、早めの対応が推奨される。
  - 私のGoogle Play Consoleにはアカウントが無効化されるとの赤字の警告が表示されていた。
