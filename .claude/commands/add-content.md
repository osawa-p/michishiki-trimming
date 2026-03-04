# 差別化コンテンツ追加（並列実装）

競合にない独自コンテンツページを並列で実装するスキル。

## 使い方
`/add-content [追加したいコンテンツの説明]`

## 実行手順

### Step 1: コンテンツ企画
対象サイトの既存ページ構成を調査し、以下を検討:
- SEOでロングテールキーワードを獲得できるか
- ユーザーにとって実用的な情報か
- 競合サイトにないオリジナリティがあるか

### Step 2: 並列実装
Agent ツールで各コンテンツを並列に実装。各Agentへの指示に含める情報:
- 技術スタック（Next.js App Router, TypeScript, Tailwind CSS）
- 既存コンポーネント（Breadcrumb, SalonCard等）のパス・export形式
- SEO要件（generateMetadata, JSON-LD, パンくず）
- デザイン要件（ブランドカラー、lucide-reactアイコン）
- データ構造（静的データの場合は `src/lib/data/` に配置）

### Step 3: ナビゲーション統合
- Header.tsx のnavLinksに追加
- Footer.tsx のメニューに追加
- TOPページにカードリンクセクション追加
- sitemap.ts に新ページ追加

### Step 4: ビルド検証
`npm run build` で全ルートの動作確認

## コンテンツテンプレート例
- **ガイドページ**: 静的サーバーコンポーネント、目次+セクション構成、FAQ付き
- **シミュレーター**: page.tsx(サーバー) + コンポーネント(client)、ステップ形式UI
- **一覧+詳細**: 静的データ `src/lib/data/`, generateStaticParams, 関連コンテンツリンク
