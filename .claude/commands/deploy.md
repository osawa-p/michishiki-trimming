# コミット＆デプロイ

変更をコミットし、PR経由でVercelにデプロイするスキル。

## 使い方
`/deploy [コミットメッセージの概要]`

## 実行手順

### Step 1: 変更確認
- `git status` で変更ファイル一覧
- `git diff --stat` で変更量確認
- `npm run build` でビルドが通ることを確認

### Step 2: ブランチ作成＆コミット
- `git checkout -b feature/[適切な名前]`
- 関連ファイルを `git add` でステージング（.env, credentials系は除外）
- 詳細なコミットメッセージ（カテゴリ別に変更内容を記載）
- `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` を末尾に追加

### Step 3: PR作成
- `git push -u origin [branch]`
- `gh pr create` でPR作成（Summary + Test plan形式）

### Step 4: マージ＆デプロイ
- ユーザーに確認後 `gh pr merge --squash --delete-branch`
- Vercel自動デプロイをトリガー
- `gh api repos/.../deployments` でデプロイ状況確認

## 注意事項
- mainへの直接pushは避ける（PR経由）
- Supabaseマイグレーションが含まれる場合は、デプロイ前にSQL実行を確認
- Vercel環境変数に新しいキーが必要な場合はユーザーに通知
