---
Title: '多階層の要素を一括削除したい【VSCode - Vim】'
Date: 2020-10-05T16:25:00+09:00
CustomPath: 2020/10/05/vscode-vim-surround
Category:
  - 'DEV'
---

## 対象のコード

たとえばこんなHTMLコードがあった場合、大外のdivを含む全コードを少ない手数で削除したい。

```html
<div>
  <div>
    <p>この3層を削除したいよ！</p>
  </div>
</div>
```

## Vimの場合

matchit.vimをONにしていれば、Visualモードで開始タグを行選択し、終了タグまで「%」でジャンプすることで削除に至ることができる。

という手順を使用していたけれど、vim-sorroundを使用すればもっと簡単だった。（後述）

## VSCodeVimの場合

こちらのブログで、タグ間を移動するにはemmetのactionをキーに割り当てる方法が紹介されている。

[https://dackdive.hateblo.jp/entry/2018/11/06/213845:embed:cite]

が、肝心な「まるっと削除」が未解決。

## 結論 vim-sorroundで解決

VSCodeVimには、surround.vimのエミュレータが含まれているとのこと。

[https://kickbase.net/entry/vscode-settings:embed:cite]

動作しない場合、settings.jsonで有効化する。

```json
{
  "vim.surround": true
}
```

結果、動画の通り以下の手順で実行

1. 削除対象の開始または終了タグに移動（Normalモードのまま）
1. 「d, a, t」で削除対象を選択、削除

あれこれ考えてしまっていたけれど、無事解決。

<div data-vc_mylinkbox_id='887423761'></div>
