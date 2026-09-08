# Cloudflare Bulk Redirects 設定手順（neputa-note.net）

## 0. 重要な前提
- Cloudflare Bulk Redirects は、対象ホストへのHTTPリクエストが Cloudflare Edge を通るときだけ動作します。
- www.neputa-note.net が DNS only（灰色雲）のままだと動作しません。
- そのため運用上は、www を Proxied（オレンジ雲）にする必要があります。

## 1. 生成済みファイル
- 取込用CSV（ヘッダー無し・本番用）: hatenablog/cloudflare-bulk-redirects/bulk_redirect_items.csv
- 参考CSV（ヘッダー有り）: hatenablog/cloudflare-bulk-redirects/bulk_redirect_items_with_header_for_reference.csv
- ルール式: hatenablog/cloudflare-bulk-redirects/bulk_redirect_rule_expression.txt
- 動作確認サンプル: hatenablog/cloudflare-bulk-redirects/validation_samples.txt

### CSVフォーマット（Cloudflare最新仕様）
- 1行あたり:
  <SOURCE_URL>,<TARGET_URL>[,<STATUS_CODE>,<PRESERVE_QUERY_STRING>,<INCLUDE_SUBDOMAINS>,<SUBPATH_MATCHING>,<PRESERVE_PATH_SUFFIX>]
- 必須は SOURCE_URL, TARGET_URL のみ
- ヘッダー行は含めない（含めるとエラー）
- 今回のCSVは `status=301, preserve_query_string=TRUE, include_subdomains=FALSE, subpath_matching=FALSE` を明示

## 2. Cloudflare Dashboard での作業
1. Cloudflare ダッシュボードで neputa-note.net を開く。
2. DNS > Records で www の CNAME を確認し、プロキシ状態を Proxied にする。
3. Rules > Bulk Redirects > Create bulk redirect list を開く。
4. List name を例: neputa-note-hatena-migration にする。
5. Import CSV で bulk_redirect_items.csv をアップロード。
6. Rules > Bulk Redirects で Bulk Redirect Rule を新規作成。
7. Expression は次を使用: http.host eq "www.neputa-note.net"
8. Action は、手順3-5で作成した Bulk redirect list を選択して有効化。
9. ルールを Deploy。

## 3. 推奨設定
- SSL/TLS mode: Full（または Full strict）
- 既存の Redirect Rules / Page Rules と競合しないよう優先順位を確認

## 4. 動作確認
1. validation_samples.txt のURLで確認。
2. 期待値:
- 旧URLにアクセスすると 301
- Location が /entry/yyyy/mm/dd/filename
- 最終URLは 200
3. 301連鎖がないことを確認。

## 5. ロールバック手順
- 問題発生時は Bulk Redirect Rule を Disable。
- 必要なら www を DNS only に戻す（この場合 Bulk Redirects は停止）。

## 6. 注意
- Hatena 側の「CNAMEをプロキシしない推奨」と両立しない場合があります。
- その場合は Bulk Redirects は使えないため、はてな側の機能または別プロキシ設計が必要です。
