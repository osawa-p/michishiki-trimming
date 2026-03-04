# ブランド名・デザイン変更

サイト全体のブランド名やデザインを一括変更するスキル。

## 使い方
`/brand-update [新しいブランド名やデザイン方針]`

## 実行手順

### Step 1: 現状調査
- Grep で現在のブランド名の使用箇所を全件検索
- 影響範囲を特定（コンポーネント、メタデータ、OG画像、JSON-LD等）

### Step 2: 一括変更
変更対象:
- `src/components/Header.tsx` - ヘッダーロゴ・ブランド名
- `src/components/Footer.tsx` - フッターブランド名
- `src/app/layout.tsx` - metadata.title テンプレート、WebSite JSON-LD
- `src/app/page.tsx` - TOPページの見出し・説明文
- `src/app/salons/[id]/opengraph-image.tsx` - OG画像テンプレート
- `src/lib/seo/jsonld.ts` - 構造化データ内のブランド名
- `CLAUDE.md` - プロジェクト説明

### Step 3: デザイン変更（必要に応じて）
- `src/app/globals.css` - CSS変数（ブランドカラー）
- lucide-react アイコンの変更
- カラースキーム統一

### Step 4: 検証
- `npm run build` でビルド確認
- ブラウザでOG画像・メタデータ確認
