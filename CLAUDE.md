# 犬のトリミングサロン検索サイト（トリムDB）

## プロジェクト概要
- **リポジトリ**: https://github.com/osawa-p/michishiki-trimming
- **本番URL**: https://trimming.michi-biki.jp
- **Vercel**: https://michishiki-trimming-ties.vercel.app

## 技術スタック
- Next.js 15 (App Router) / TypeScript / Tailwind CSS v4
- DB / Auth: Supabase (PostgreSQL + RLS)
- ホスティング: Vercel

## ブランチ運用
- `main` → 本番（Vercel自動デプロイ）
- `develop` → 開発統合
- `feature/*` → 機能開発 → PR → develop → main

## 環境変数（.env.local / Vercel環境変数）
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## ページ構成
- `/` TOPページ（サロン検索）
- `/salons` サロン一覧・検索結果
- `/salons/[id]` サロン詳細（サービス・レビュー）
- `/register` サロン登録フォーム
- `/auth/login` ログイン
- `/auth/signup` 新規登録
- `/mypage` マイページ（未実装）

## DBテーブル
- `salons` サロン情報
- `dog_breeds` 犬種マスタ（初期データ10種）
- `salon_breeds` サロン対応犬種
- `services` サービス・料金
- `reviews` レビュー
- `profiles` ユーザー情報（Supabase Auth連携）

## SQLマイグレーション
`supabase/migrations/20240101000000_init.sql` を Supabase SQL Editor で実行済み

## 未実装タスク（GitHub Issues 参照）
- サロン登録フォームのDB保存処理（Server Action）
- ログイン・新規登録の認証処理（Supabase Auth）
- マイページ実装
- レビュー投稿機能
- 犬種・エリアでの絞り込み検索
