# サロンスクレイピング＆レビュー更新

Google Places APIを使ってトリミングサロンを収集し、DBに登録するスキル。

## 使い方
`/scrape-salons [オプション]`

## 前提条件
- `.env.local` に `GOOGLE_PLACES_API_KEY` が設定されていること
- Google Cloud Console で Places API (New) が有効であること
- Supabase に `20240103000000_google_places.sql` マイグレーションが適用済みであること

## 実行手順

### Step 1: 環境確認
- `.env.local` の `GOOGLE_PLACES_API_KEY` 存在確認
- Supabase接続テスト（prefecturesテーブル読み取り）

### Step 2: サロンスクレイピング
```bash
# 全都道府県（時間がかかる）
npx tsx --env-file=.env.local scripts/scrape-google-places.ts

# 特定都道府県のみ（推奨）
npx tsx --env-file=.env.local scripts/scrape-google-places.ts --prefecture tokyo

# ドライラン（DB書き込みなし、API確認用）
npx tsx --env-file=.env.local scripts/scrape-google-places.ts --dry-run
```

### Step 3: レビュー更新
```bash
# 全サロンのレビュー更新
npx tsx --env-file=.env.local scripts/fetch-google-reviews.ts

# 7日以上未更新のサロンのみ（上限50件）
npx tsx --env-file=.env.local scripts/fetch-google-reviews.ts --stale-days 7 --limit 50
```

### Step 4: 確認
- Supabaseダッシュボードで salons テーブルの `google_place_id` 有無を確認
- `external_reviews` テーブルにレビューが登録されていることを確認
- `npm run dev` でサロン詳細ページにGoogle口コミが表示されることを確認

## 定期実行の推奨フロー
1. 週1回: `--stale-days 7` でレビュー更新
2. 月1回: 新規サロン検索（都道府県を分割して実行）
3. API使用量をGoogle Cloud Consoleで監視

## API料金目安
- Text Search: $32 / 1,000リクエスト
- Place Details: $17 / 1,000リクエスト
- 無料枠: 月$200相当のクレジット（Maps Platform）
