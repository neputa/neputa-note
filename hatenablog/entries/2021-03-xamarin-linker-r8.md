---
Title: 'AndroidアプリのAPKサイズを圧縮しようと試みて敗れる話'
Date: 2021-03-13T11:30:00+09:00
CustomPath: 2021/03/13/xamarin-linker-r8
Category:
  - 'DEV'
  - 'Xamarin Forms'''
  - 'dotnet'
---
![アイキャッチ画像](../assets/images/hero__2021__03__xamarin-linker-r8.webp)

## 本記事の概要

Xamarin.Formsで開発したAndroidアプリのパッケージサイズを圧縮しようと「Linker」「d8/r8」コンパイラを駆使したが、敗北した一連の顛末ををまとめた。

## アプリのパッケージサイズが気になる

[https://www.neputa-note.net/2021/02/onethird-release/:embed:cite]

インストールはこちらから。

<a
    href='https://play.google.com/store/apps/details?id=com.neputafactory.onethird&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'
    target='_blank'
  >
    ![Google Play で手に入れよう](../assets/images/google-play.webp)
  </a>
> [!WARNING]
> Androidのみ iOS版は現在リリース未定

色々と不具合問題で話題となっている「COCOA - 新型コロナウイルス接触確認アプリ」の影響もあり、すっかり悪いイメージがついた「Xamarin.Forms」で開発した。

Xamarin.Formsは直接Android、iOSのAPIを叩いて実行するアプリを作れる。よって、ネイティブ開発と比べて特別に劣るということもないとは思う。

思うが、monoランタイムを抱えていることもあり、パッケージサイズが大きくなりがち。

[https://www.buildinsider.net/mobile/insidexamarin/03:embed:cite]

現在リリースしているバージョン1.0.4の時点で、ダウンロードサイズは34MB。インストールしたアプリサイズは49.45MB。アプリの内容を考えると大きい。

これをどうにかできないかと悪戦苦闘し、敗れる（つまり未解決）という、残念な内容な記事とっている。

情報価値はゼロとは思うが、暇つぶしにお付き合いいただけたらうれしい。

## Xamarin.Forms だってダイエットしたい

参考にしたサイトはこちら。

- [Xamarin.Forms - Android App Performance and Package Size Reduction](https://progrunning.net/xamarin-forms-android-app-performance-and-package-size-reduction-xamarin-challenge/)
- [Reducing iOS and Android App Size in Xamarin](https://heartbeat.fritz.ai/reducing-the-app-size-in-xamarin-deep-dive-7ddc9cb12688)

サイズを小さくする方法はいくつかある。

1. R8 Shrinkerを使用する

[https://devblogs.microsoft.com/xamarin/androids-d8-dexer-and-r8-shrinker/:embed:cite]

1. Linkerを使用する

[https://learn.microsoft.com/ja-jp/previous-versions/xamarin/android/deploy-test/linker:embed:cite]

1. AOT＆LLVMコンパイラを使用する

[https://learn.microsoft.com/ja-jp/previous-versions/xamarin/android/deploy-test/release-prep/?tabs=windows#protect-the-application:embed:cite]

この中で、3番目のAOT＆LLVMは、Visual StudioのEnterpriseエディションライセンスが必要。よってわたしは残念ながら利用できない。

では、最初の2つを使用すればいいじゃないかとなるが、そうは簡単にはいかない。

まずは「R8 Shrinker」と「Linker」について、調べてみたことを簡単にまとめたい。

### R8 Shrinker

これは、Javaバイトコードを対象に、未使用コードを削除してくれるもの。

ただし、ネイティブ開発と異なり、Xamarin.Formsでは難読化の恩恵は得ることができない。

![r8 shrinker](../assets/images/7216812203483992404-shrinker.webp)

> [!NOTE]
> ちなみにこれを書いている2021/3/12時点で、「R8」の他に「ProGuardを有効にする」という選択肢がある。R8はProGuardを置き換える目的で開発されたもので、ProGuardを選択するとビルドで「R8」を使えと怒られる。

軽量化に役立つなら使えばいいじゃない、そう思うことだろう。

なんの備えもなくこいつを選ぶとアプリは見事クラッシュする。

いろいろと対処をしないと使えないことがわかった。その理由と対処については後述する。

### Linker

これは、静的解析により不要と判断したコードをばっさり切り捨てることで軽量化を図る機能。

オプションとして、「一切使用しない（なし）」「SDKのみ対象とする（SDKアセンブリのみ）」「すべて対象（SDKおよびユーザアセンブリ）」の3つがある。

![linker](../assets/images/7216812203483992404-Linker.webp)

現在は、SDKのみを対象としており、わたしが書いたコードおよび追加したNuget Packageについては対象外となっている。

で、「SDKとユーザアセンブリすべて」を安易に選ぶとアプリは見事クラッシュする。

R8 Shrinker、Linker、どちらも何もせずに使えるわけではなく、導入するにはそれなりの準備が必要なのだ。

## R8 Shrinker を使うために行った作業

まずは、Visual Studioのツール→Android→Android Device Monitorで、クラッシュ原因を見てみる。

![crash](../assets/images/7216812203483992404-first-crash.webp)

「FATAL」があるあたりを見てみると、こんなメッセージがある。

```log
java.lang.ClassNotFoundException: Didn't find class "com.google.android.gms.ads.MobileAdsInitProvider"
```

わたしのアプリには「Google AdMob」という広告表示用のプラグインがあるが、起動時にそんなもん無いと言われている。

つまり、「R8 Shrinker」は、私が追加したnugetパッケージを不要コードとみなし、バッサリ削ったのだ。

R8 Shrinkerを使用していると、Androidプロジェクトフォルダ配下の「obj\Release\XXX\proguard」に「.cfg」拡張子のファイルが作られる。（XXXは、お使いのエミュレータのバージョンが入る）

これらのファイルを見てみると、「-keep class XXXX」という記述がずらりと並んでいる。

これは、コンパイル時に切り捨てずキープ対象となるライブラリ名がずらりと書かれているのだ。

obj配下にあるファイルは自動生成されたもの。

これとは別に、自分が追加したパッケージ等をkeepするため、設定ファイルを用意する必要がある。

たとえば「my_proguard_xamarin.cfg」というファイルをAndroidプロジェクトに追加し、「ビルドアクション」を「ProguardConfiguration」にしておく。

こうすることで、ビルド時にこの設定ファイルを読んでくれるようになる。

[https://learn.microsoft.com/ja-jp/previous-versions/xamarin/android/deploy-test/release-prep/proguard?tabs=windows#customizing-proguard:embed:cite]

> [!WARNING]
> ちなみに、自動生成された .cfgファイルをコピーして設定ファイルを作る場合、ファイル内のBOMがビルドエラーの原因となるため、対応するエディタ等でBOMを削除する必要がある。

あとはひたすら、トライ＆エラー。

エラー原因となったライブラリを設定ファイルに追記し、Android Device Monitorで確認、また別のエラーが出たらそれを追記、そしてまた……。

わたしの場合、最初のAdMobに続いてAdMobに関連する「com.google.unity.ads.UnityAdListener」、そして「androidx.work」が原因ではじかれ、その都度ファイルにKeepを追加した。

一番厄介だったのが、Splash screenのファイルに問題があるとエラーが出て、いろいろ調べた結果「Calligraphy」をアップデートしろという情報を見つけ対応したこと。

R8を使用していなければとくに問題は起きていなかったため、R8に関連してCalligraphyのバージョンが問題となるのかいまいち原因ははっきりしなかった。

[https://stackoverflow.com/questions/56524914/crash-on-android-10-inflateexception-in-layout-abc-screen-simple-line-17/57232072:embed:cite]

[https://github.com/nwestfall/Calligraphy.Xamarin:embed:cite]

結果として以下のような .cfgファイルを作成し、何とかアプリが起動するところまで漕ぎつけた。

```javascript
-keep class com.google.unity.** {
  *;
}

-keep public class com.google.android.gms.ads.**{
public *;
}

-keep public class com.google.ads.**{
public *;
}

-keep class androidx.work.** { *; }

-keepattributes Annotation
```

R8については以上となる。

## Linkerでユーザアセンブリも対象にする

続いて、Linker。

もっともパッケージ圧縮の恩恵が大きいのは「SDKおよびユーザアセンブリ」を選択すること。

しかしこちらもR8 Shrinker同様、必要な設定を施さないと、わたしの場合はアプリが見事クラッシュした。

行う作業も同様で、Linkerで切り捨ててほしくないライブラリ等を設定ファイルに追加する。

[https://learn.microsoft.com/ja-jp/previous-versions/xamarin/cross-platform/deploy-test/linker:embed:cite]

Linkerの設定はXMLファイルに記述する。

とりあえず「LinkerSettings.xml」という名前のファイルをAndroidプロジェクトに追加し、ファイルプロパティのビルドアクションを「LinkDescription」にしておく。

わたしの場合はこんな感じになった。

使用しているNuget Packageと、作成したプロジェクトアセンブリが対象となっている。

```xml
<?xml version="1.0" encoding="utf-8" ?>
<linker>
  <!--
      For more information see the docs on creating custom Linker Settings
      https://docs.microsoft.com/en-us/xamarin/cross-platform/deploy-test/linker
  -->
  <assembly fullname="Essential.Interfaces">
    <type fullname="Xamarin.Essentials.Implementation.AppInfoImplementation">
      <method name=".ctor" />
    </type>
  </assembly>

  <assembly fullname="Prism.Forms">
    <type fullname="Prism.Common.ApplicationProvider" preserve="all" />
    <type fullname="Prism.Services.PageDialogService" preserve="all" />
    <type fullname="Prism.Services.DeviceService" preserve="all" />
    <type fullname="Prism.Ioc*" preserve="all" />
    <type fullname="Prism.Modularity*" preserve="all" />
    <type fullname="Prism.Navigation*" preserve="all" />
    <type fullname="Prism.Behaviors.PageBehaviorFactory" preserve="all">
      <method name=".ctor" />
    </type>
    <type fullname="Prism.Services.DependencyService" preserve="all">
      <method name=".ctor" />
    </type>
  </assembly>

  <assembly fullname="Prism">
    <type fullname="Prism.Navigation*" preserve="all" />
    <type fullname="Prism.Logging.EmptyLogger" preserve="all">
      <method name=".ctor" />
    </type>
  </assembly>

  <assembly fullname="Unity.Abstractions">
    <type fullname="*" />
  </assembly>

  <assembly fullname="Unity.Container">
    <type fullname="*" />
  </assembly>

  <assembly fullname="Prism.Unity.Forms">
    <type fullname="*" />
  </assembly>

  <assembly fullname="System">
    <type fullname="*" />
  </assembly>

  <assembly fullname="mscorlib">
    <type fullname="*" />
  </assembly>

  <assembly fullname="OneThird.Core">
    <type fullname="*" />
  </assembly>

  <assembly fullname="OneThird.Application">
    <type fullname="*" />
  </assembly>

  <assembly fullname="OneThird.Domain">
    <type fullname="*" />
  </assembly>

  <assembly fullname="OneThird.Infrastructure">
    <type fullname="*" />
  </assembly>

  <assembly fullname="Microsoft.Identity.Client">
    <type fullname="*" />
  </assembly>

  <assembly fullname="Realm">
    <type fullname="*" />
  </assembly>

  <assembly fullname="System.IdentityModel.Tokens.Jwt">
    <type fullname="*" />
  </assembly>

  <assembly fullname="Xamarin.CommunityToolkit">
    <type fullname="*" />
  </assembly>

  <assembly fullname="Xamarin.GooglePlayServices.Ads" >
    <type fullname="*" />
  </assembly>

</linker>
```

よし、これでしまいかと思いきや……。

見事にクラッシュする。

で、色々と調べていると、Linkerの対象から外すために「Preserve属性を追加せよ」という情報を見つけた。

[https://www.xamarinhelp.com/xamarin-linker/:embed:cite]

たいへん面倒ではあるが、以下のように属性を付けて回ることにした。

- Androidプロジェクトのすべてのクラス
  - [Android.Runtime.Preserve(AllMembers = true)]
- 共通プロジェクトのすべてのクラス
  - [Xamarin.Forms.Internals.Preserve(AllMembers = true)]

ここまでやって、ようやく、ようやくアプリが起動した。

## だが、これでは終わらない……

無事起動した。

しかし物語は常にハッピーエンドとは限らない。

動作確認をすると、CosmosDBの接続でエラーが出る、広告が表示されない、などいくつかの不具合が見つかった。

「ンあーーーーーーっ」と叫びたい気持ちを抑え、またひとつひとつ潰していくかと頭を切り替えようと思った。

だが冷静になり、この時点でどれほどパッケージサイズは小さくなっているのだろうと確認すると、わずか「3MB」……。

これだけやって、こんな程度か、とまず脱力。

そして、「エラーを潰す = 削除されたコードを残すようにする」わけだ。

ここからさらにパッケージサイズは大きくなる。

また将来的なことも考えてみる。

この先、きっと機能追加等でコードやNuGetを追加したりするだろう。

そのたびに、今回の作業を忘れず行う必要がある。

アプリサイズが少しでも小さいほうがユーザにとって良いこと。

だが、コストやリスクに対し、メリット少なすぎやしないか。

## 涙の結論

ということで、「R8 Shrinker」および「フルLinker」は、めっちゃ頑張り、すごく悔しいが、あきらめることとした。

ダウンロードしてくれるユーザの皆さまのギガを奪って申しわけない。

wi-fiがある場所でダウンロードしたりアップデートしてくれることを祈っている。

技術の話なのに最後は祈りだ。

Visual Studioのエンタープライズエディションゲットして「AOT＆LLVM」使えば楽にちっさくなったりするのだろうか。

でも$250/月とか個人開発には厳しい。

ほかに何か良い方法は無いだろうか。

もしご存じな方がいらっしゃったら教えていただけると、朝晩そちらに向かって毎日かかさず感謝の祈りを捧げることをお約束する。

以上、プログラミングは祈り、の巻き。
