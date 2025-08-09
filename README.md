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
```
 docker compose up -d
```

## マイグレーション
```
 npx prisma db migrate dev
```

## サーバー起動
```
 npm run dev
```







