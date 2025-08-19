# 初期設定の手順

## 依存関係のインストール

```
  npm i
```

## lefthook有効化

```
npm run prepare
```

## .envの作成と設定

.envは配られているものを使用してください。

```
 touch .env
```

## ローカルDB起動

docker desktopアプリを起動して、llm-branchを起動。

```
 docker compose up -d
```

## マイグレーション

```
 npx prisma  migrate dev
```

## サーバー起動

```
 npm run dev
```

# コミット時にエラーが出た場合

コミット時にbiome check（formatとlintの確認）とtypecheck（型エラーの確認）をしています。

- biome checkでエラーが出た場合は以下のコマンドを実行して、再度コミットしてください。
- typecheckでエラーが出た場合は型エラーを直してから、再度コミットしてください。

```
  npm run format
```
