---
Title: 'AstroのユニットテストをJestで行う【ESモジュール対処法】'
Date: 2024-07-05T13:23:08+09:00
CustomPath: 2024/07/05/jest-astro
Category:
  - 'DEV'
  - 'Node.js'
  - 'Jest'
---

## 記事概要

- 先日のBloggerからAstroへ移行した記事の別途詳細
- AstroのBlogテンプレートにJestを追加し実行するまでをまとめる
- Astroは通常のESM（ECMAScript Modules）を使用しており、Jest側で対処が必要
- 既存のtsconfigは手を加えず、別途テスト用にtsconfigを作成しこれを回避する
- 最後にJestのVSCode拡張機能を紹介

**※参考 - Blog移行記事**_

[https://www.neputa-note.net/2024/07/migrated-blogger-to-astro/:embed:cite]

**ESM・ESモジュール（ECMAScript Modules）とは**_

[https://ics.media/entry/16511/:embed:cite]

## 環境

- Node.js - v20.14.0
- pnpm - v9.4.0
- Jest - v29.7.0
- typescript - v5.5.2
- VSCode - v1.90.2

## Jest について

[https://jestjs.io/ja/:embed:cite]

## 前提

- Node.js環境（pnpm使用）
- Astroの既存プロジェクトにJestを追加する（Astro固有の設定等は特になし）

## インストールと設定

- Jest、TypeScript、そのほか関連パッケージをインストール

```bash install-packages
pnpm add --save-dev typescript jest ts-jest @types/jest
```

- jest.config.js を作成

```bash create-jest.config.js
pnpm ts-jest config:init
```

- Astroテンプレートのtsconfigが既にあるのでjestを実行することはできる
- 試しにモジュールとテストファイルを作成しjestを実行する

```typescript sample.ts
export function writeLog(log: string) {
  return console.log(log)
}
```

```typescript initial.test.ts

test('最初のテスト', () => {
  writeLog('OK')
})
```

- するとverbatimModuleSyntaxがenabledの時のCommonJSではモジュールのimportはダメと怒られる

```bash jest-error
$ pnpm jest
 FAIL  test/initial.test.ts
  ● Test suite failed to run

    test/initial.test.ts:1:10 - error TS1286: ESM syntax is not allowed in a CommonJS module when 'verbatimModuleSyntax' is enabled.

    1 import { writeLog } from '../src/utils/sample'
               ~~~~~~~~

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        2.513 s
Ran all test suites.
```

- Astro v3.0以降、verbatimModuleSyntaxはenabledが既定値
  - [Astro v3へのアップグレード | Docs](https://docs.astro.build/ja/guides/upgrade-to/v3/#%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%81%AE%E5%A4%89%E6%9B%B4-tsconfigjson%E3%83%97%E3%83%AA%E3%82%BB%E3%83%83%E3%83%88%E3%81%AEverbatimmodulesyntax)
- tsconfigのmodule指定は変更したくない
- テスト用のtsconfig.test.jsonを作成する

```json tsconfig.test.json
{
  "compilerOptions": {
    "target": "es2021",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

- これをjest.config.jsに登録する
- jest.config.jsのpresetを修正し、transformを追加する

```javascript jest.config.js
/* prettier-ignore */
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
// [!code --]
  preset: 'ts-jest',
// [!code ++]
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
// [!code ++]
  transform: {
// [!code ++]
    '^.+\\.ts?$': [
// [!code ++]
      'ts-jest',
// [!code ++]
      {
// [!code ++]
        useESM: true,
// [!code ++]
        tsconfig: 'tsconfig.test.json'
// [!code ++]
      }
// [!code ++]
    ]
// [!code ++]
  }
}
```

## テスト実行

- Jestは拡張子の前に「.test」を付与したファイルを見つけ出しテストを実行する
- 先ほどエラーを確認したファイルは「test/initial.test.ts」
- pnpm jestコマンドでテストを実行する

```bash jest-success
$ pnpm jest
  console.log
    OK

      at writeLog (src/utils/sample.ts:2:17)

 PASS  test/initial.test.ts
  ✓ 最初のテスト (14 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.792 s
Ran all test suites.
```

- 今度は無事に実行できた

## VSCode拡張機能

- 便利なVSCode拡張機能があった

[https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest:embed:cite]

- Market PlaceまたはVSCodeからインストールする
- プロジェクトのルートに .vscodeディレクトリを無ければ作成する
- .vscodeにsettings.jsonを作成し以下を記述（今回はpnpmを使用している）

```json settings.json
{
  "jest.jestCommandLine": "pnpm jest"
}
```

- VSCodeをリロードするとサイドバーにフラスコのアイコンが表示される
- ここでテストファイルやテスト関数を管理することができる

![VSCodeテストアイコン](../assets/images/jest-astro-test.webp)

## まとめ

- 不慣れなTypeScriptでコードを書くにあたり、ユニットテストを実行できる環境がいち早くほしかった
- Jestを知りインストールしたが設定に苦労する
- 既存の環境に手を付けずに対処する方法が分からず手間取ったので備忘録としてまとめてみた

## 参考サイト

- [Jestでテストを書こう | TypeScript入門『サバイバルTypeScript』](https://typescriptbook.jp/tutorials/jest)
- [外部パッケージに ESM が使われているコードを ts-jest でテストしたい](https://zenn.dev/t_yng/scraps/d701cdae1071fd)
- [vscode-jest を導入してテストの開発体験を向上させる - mizdra's blog](https://www.mizdra.net/entry/2021/12/13/011842)
