Cloudflareをホスティングとして使用する場合、リダイレクトの設定はCloudflareのページルールを使用して行うことができます。以下に、Cloudflareを使用して拡張子有りのURLから拡張子無しのURLへのリダイレクトを設定する方法を説明します。

### Cloudflareでリダイレクトを設定する方法

1. **Cloudflareダッシュボードにログイン**

   まず、Cloudflareのダッシュボードにログインし、リダイレクトを設定したいドメインを選択します。

2. **ページルールの設定**

   Cloudflareの「ページルール」セクションに移動し、新しいページルールを追加します。

3. **ページルールを作成**

   新しいページルールを作成する際、以下の設定を行います：

   - **URLマッチ条件**: `*example.com/*.html`

     - これは、`example.com`をあなたのドメイン名に置き換えてください。このパターンは、すべての`.html`拡張子を持つURLにマッチします。

   - **リダイレクトの設定**: リダイレクトのタイプを「301リダイレクト（恒久的）」に設定し、ターゲットURLを`https://example.com/$1`に設定します。

     - ここでも、`example.com`をあなたのドメイン名に置き換えてください。
     - `$1`はURLのパス部分をキャプチャして、そのまま新しいURLに適用します。

   - 完了すると、設定は次のようになります：
     ```
     If the URL matches: *example.com/*.html
     Then the settings are: Forwarding URL (Status Code: 301 - Permanent Redirect, Destination URL: https://example.com/$1)
     ```

4. **ページルールを保存**

   設定が完了したら、「保存してデプロイ」をクリックしてページルールを適用します。

### 完成した設定例

以下に、Cloudflareダッシュボードでの設定例を示します：

1. **URLパターン**: `*example.com/*.html`
2. **リダイレクトの種類**: 301 - Permanent Redirect
3. **リダイレクト先**: `https://example.com/$1`

この設定により、ユーザーが`example.com/about.html`にアクセスすると、`example.com/about`にリダイレクトされます。

### まとめ

Cloudflareのページルールを使用することで、簡単に拡張子有りのURLから拡張子無しのURLへのリダイレクトを設定できます。この方法は、サーバーサイドの設定を変更する必要がないため、非常に便利です。適切な設定を行うことで、ユーザーエクスペリエンスを向上させ、SEOにも良い影響を与えることができます。
