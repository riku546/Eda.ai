# プロジェクト概要

このプロジェクトは、Next.js、React、TypeScriptで構築されたWebアプリケーションです。データベース操作のためのORMとしてPrisma、APIルートのためにtRPC、スタイリングのためにTailwind CSSを使用しています。プロジェクトは、リンティングとフォーマットのためにBiome、GitフックのためにLefthookで設定されています。

## 主な技術

- **フレームワーク:** Next.js
- **言語:** TypeScript
- **UI:** React, Tailwind CSS, Material UI
- **API:** tRPC
- **データベース:** Prisma
- **リンティング/フォーマット:** Biome
- **Gitフック:** Lefthook

# ビルドと実行

## 初期設定

1.  依存関係のインストール:
    ```bash
    npm i
    ```
2.  Lefthookの有効化:
    ```bash
    npm run prepare
    ```
3.  `.env`ファイルの作成と設定
4.  ローカルデータベースの起動:
    ```bash
    docker compose up -d
    ```
5.  データベースマイグレーションの実行:
    ```bash
    npx prisma migrate dev
    ```

## 開発

開発サーバーを起動するには、以下を実行します:

```bash
npm run dev
```

## ビルド

本番用にアプリケーションをビルドするには、以下を実行します:

```bash
npm run build
```

## テスト

`package.json`には明示的なテストコマンドは定義されていません。ただし、プロジェクトでは`lefthook`を使用して、コミットおよびプッシュの前にチェックを実行します。

# 開発規約

## コンポーネント設計

- 各ページのエントリポイントは必ず `PageContainer` コンポーネントでラップしてください。

## リンティングとフォーマット

このプロジェクトでは、リンティングとフォーマットにBiomeを使用しています。設定は`biome.json`にあります。コードをフォーマットするには、以下を実行します:

```bash
npm run format
```

## 型チェック

静的型チェックにはTypeScriptが使用されます。型エラーをチェックするには、以下を実行します:

```bash
npm run typecheck
```

## Gitフック

Gitフックの管理にはLefthookが使用されます。設定は`lefthook.yml`にあります。以下のフックが設定されています:

- `pre-commit`: Biomeチェックと型チェックを実行します。
- `post-merge`: 関連ファイルが変更された場合に、データベースの変更をプッシュし、npmの依存関係をインストールし、lefthookを準備します。
- `pre-push`: Biomeチェックと型チェックを実行します。
- `post-push`: 関連ファイルが変更された場合に、npmの依存関係をインストールし、lefthookを準備します。
