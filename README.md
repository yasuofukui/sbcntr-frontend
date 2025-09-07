# React Router v7 ペットショップデモ

React Router v7で構築されたモダンなペットショップアプリケーションです。

## 機能

- **ペットカタログ**: 詳細情報カード付きのペット閲覧機能
- **ショッピングカート**: localStorage永続化によるグローバルカート管理
- **インタラクティブUI**: モーダルダイアログ、リアルタイム更新、レスポンシブデザイン
- **サーバーサイドレンダリング**: SEOとパフォーマンス向上のための完全SSR対応
- **型安全性**: ルート型生成による完全なTypeScript統合
- **モダンスタック**: React 18、Tailwind CSS、Radix UIコンポーネント

## 要件

- Node.js >= 22.12.0
- pnpm 9.15.0（自動で強制される）

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/horsewin/react-router-v7-playground.git
cd react-router-v7-playground

# 依存関係をインストール（pnpmを使用）
pnpm install
```

## 開発

```bash
# 開発サーバーを起動
pnpm dev

# 型チェック
pnpm typecheck

# ルート型を生成
pnpm typegen

# リンティングとフォーマット
pnpm check
pnpm fix
```

## ビルド・本番環境

```bash
# 本番用ビルド
pnpm build

# 本番サーバーを起動
pnpm start
```

## Docker

マルチステージビルドによるDockerサポートが含まれています：

```bash
# Dockerでビルド・実行
docker build -t react-router-pet-shop .
docker run -p 3000:3000 react-router-pet-shop

# docker-composeを使用する場合（利用可能な場合）
docker-compose up
```

## プロジェクト構造

```
app/
├── components/        # 再利用可能なUIコンポーネント
│   ├── ui/           # ベースUIコンポーネント（shadcn/ui）
│   └── *.tsx         # 機能コンポーネント
├── contexts/         # React Contextプロバイダー
├── lib/             # ユーティリティ関数
├── routes/          # ルートコンポーネント
├── types/           # TypeScript型定義
├── app.css          # グローバルスタイル
├── root.tsx         # ルートレイアウトコンポーネント
└── routes.ts        # ルート設定

public/              # 静的アセット
react-router.config.ts  # React Router設定
```

## 主要技術

- **[React Router v7](https://reactrouter.com/)** - フルスタックReactフレームワーク
- **[React 18](https://react.dev/)** - UIライブラリ
- **[TypeScript](https://www.typescriptlang.org/)** - 型安全性
- **[Tailwind CSS](https://tailwindcss.com/)** - ユーティリティファーストCSS
- **[Radix UI](https://www.radix-ui.com/)** - ヘッドレスUIコンポーネント
- **[Vite](https://vitejs.dev/)** - ビルドツール
- **[Biome](https://biomejs.dev/)** - リンティング・フォーマッティング

## 設定

### 環境変数

- `BACKEND_URL` - バックエンドAPI URL（オプション、設定されていない場合はモックデータを使用）

### React Router設定

このアプリケーションはSSRが有効なReact Router v7を使用しています。設定は`react-router.config.ts`で確認できます。

## ルート

- `/` - ウェルカム画面付きのホームページ
- `/pets` - フィルタリング・検索機能付きペットカタログ
- `/healthcheck` - アプリケーションヘルスステータス

## ライセンス

MIT
