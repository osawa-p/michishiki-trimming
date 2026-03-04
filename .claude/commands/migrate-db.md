# DBマイグレーション実行

Supabaseにマイグレーションを適用するスキル。

## 使い方
`/migrate-db`

## 実行手順

### Step 1: マイグレーションファイル確認
- `supabase/migrations/` 内の未適用SQLファイルを一覧
- 各ファイルの内容を確認（テーブル作成、ALTER、INSERT等）

### Step 2: Supabase接続確認
- `.env.local` の `NEXT_PUBLIC_SUPABASE_URL` でプロジェクト接続テスト
- DNSが解決できない場合はプロジェクト復旧を案内

### Step 3: マイグレーション適用
**方法A: PowerShellクリップボード経由（推奨）**
```
powershell.exe -Command "Get-Content -Path 'file1.sql','file2.sql' -Encoding UTF8 | Set-Clipboard"
```
→ ユーザーがSupabase SQL Editorに貼り付けて実行

**方法B: pg モジュール直接接続**
- ユーザーからDatabase Password / Connection stringを取得
- `pg` パッケージで直接SQL実行

**重要**: `clip.exe` はUTF-8の日本語が文字化けするため必ずPowerShellの `Set-Clipboard` を使用

### Step 4: シードデータ投入
- `npx tsx scripts/seed-salons.ts` でサンプルデータ投入
- Supabaseダッシュボードでデータ確認

### Step 5: 動作検証
- `npm run build` でビルド確認
- `npm run dev` でローカルプレビュー
