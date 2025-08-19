# API Documentation

このドキュメントは、利用可能なAPIエンドポイントの概要、その使用法、および期待される入力/出力スキーマを提供します。

## Project API

### `project.list`

現在のユーザーのプロジェクトリストを取得します。

```typescript
const res = await apiClient.project.list.query();
```

**Input:**
None

**Response:**

```typescript

  {
    id: string,
    name: string,
    instruction: string,
    userId: string,
    createdAt: Date,
    updatedAt: Date,
  }[]
```

### `project.updateInstruction`

特定のプロジェクトの指示を更新します。

```typescript
const res = await apiClient.project.updateInstruction.mutate(input);
```

**Input:**

```typescript
{
  projectId: string,
  instruction: string,
}
```

**Response:**
`void`

### `project.chat.list`

特定のプロジェクトのチャットリストを取得します。

```typescript
const res = await apiClient.project.chat.list.query(input);
```

**Input:**

```typescript
{
  projectId: string,
}
```

**Response:**

```typescript


  {
    id: string,
    summary: string,
    projectId: string,
    createdAt: Date,
    updatedAt: Date,
    branches:
      {
        id: string,
        summary: string,
        parentBranchId: string | null,
        chatId: string,
        createdAt: Date,
        isMerge: boolean,
      }[],

  }[];
```

### `project.chat.new`

プロジェクト内に新しいチャットを作成します。

```typescript
const res = await apiClient.project.chat.new.mutate(input);
```

**Input:**

```typescript
{
  projectId: string,
  promptText: string,
  promptFile: string | null, // base64 encoded string（画像のみ）
}
```

**Response:**

```typescript
{
  chat: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    summary: string;
    isPinned: boolean;
  },
  branch:  {
    id: string;
    createdAt: Date;
    summary: string;
    parentBranchId: string | null;
    chatId: string;
    isMerged: boolean;
  },
  message: {
    id: string;
    createdAt: Date;
    promptText: string;
    promptFile: string | null;
    branchId: string;
    parentId: string | null;
    response: string;
    }
}
```

### `project.chat.branch.getMessage`

プロジェクトチャットの特定のブランチからメッセージを取得します。

```typescript
const res = await apiClient.project.chat.branch.getMessage.query(input);
```

**Input:**

```typescript
{
  branchId: string,
}
```

**Response:**

```typescript

  {
    id: string,
    promptText: string,
    promptFile: string | null,
    response: string,
    parentId: string | null,
    branchId: string,
    createdAt: Date,
  }[],
;
```

### `project.chat.branch.sendMessage`

プロジェクトチャットの特定のブランチに新しいメッセージを送信します。

```typescript
const res = await apiClient.project.chat.branch.sendMessage.mutate(input);
```

**Input:**

```typescript
{
  branchId: string,
  promptText: string,
  promptFile: string | null, // base64 encoded string(画像のみ)
  latestMessageId: string,
}
```

**Response:**

```typescript
{
  id: string,
  promptText: string,
  promptFile: string | null,
  response: string,
  parentId: string | null,
  branchId: string,
  createdAt: Date,
}
```

### `project.chat.branch.new`

プロジェクトチャットの親ブランチから新しいブランチを作成します。

```typescript
const res = await apiClient.project.chat.branch.new.mutate(input);
```

**Input:**

```typescript
{
  summary: string,
  parentBranchId: string,
  chatId: string,
}
```

**Response:**

```typescript
// res: BranchInProject from @prisma/client
{
  id: string,
  summary: string,
  parentBranchId: string | null,
  chatId: string,
  createdAt: Date,
  isMerge: boolean
}
```

### `project.chat.branch.merge`

ブランチを親ブランチにマージします。

```typescript
const res = await apiClient.project.chat.branch.merge.mutate(input);
```

**Input:**

```typescript
{
  branchId: string,
}
```

**Response:**
`void`

---

## Chat API

### `chat.new`

新しいチャットを作成します。

```typescript
const res = await apiClient.chat.new.mutate(input);
```

**Input:**

```typescript
{
  promptText: string,
  promptFile: string | null, // base64 encoded string(画像のみ)
}
```

**Response:**

```typescript
{
  chat:  {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    summary: string;
    isPinned: boolean;
}, 
  branch: {
    id: string;
    createdAt: Date;
    summary: string;
    parentBranchId: string | null;
    chatId: string;
    isMerged: boolean;
},
  message: {
    id: string;
    createdAt: Date;
    promptText: string;
    promptFile: string | null;
    branchId: string;
    parentId: string | null;
    response: string;
},
}
```

### `chat.branch.sendMessage`

特定のブランチにメッセージを送信します。

```typescript
const res = await apiClient.chat.branch.sendMessage.mutate(input);
```

**Input:**

```typescript
{
  promptText: string,
  promptFile: string | null, // base64 encoded string（画像のみ）
  branchId: string,
  latestMessageId: string,
}
```

**Response:**

```typescript
{
  id: string,
  promptText: string,
  promptFile: string | null,
  response: string,
  parentId: string | null,
  branchId: string,
  createdAt: Date,
}
```

### `chat.branch.merge`

ブランチをその親にマージします。

```typescript
const res = await apiClient.chat.branch.merge.mutate(input);
```

**Input:**

```typescript
{
  branchId: string,
}
```

**Response:**
`void`

### `chat.branch.new`

親ブランチから新しいブランチを作成します。

```typescript
const res = await apiClient.chat.branch.new.mutate(input);
```

**Input:**

```typescript
{
  summary: string,
  parentBranchId: string,
  chatId: string,
}
```

**Response:**

```typescript
{
  id: string,
  summary: string,
  parentBranchId: string | null,
  chatId: string,
  createdAt: Date,
  isMerged: boolean,
}
```

### `chat.branch.getMessages`

特定のブランチのすべてのメッセージを取得します。

```typescript
const res = await apiClient.chat.branch.getMessages.query(input);
```

**Input:**

```typescript
{
  branchId: string,
}
```

**Response:**

```typescript

  {
    id: string,
    promptText: string,
    promptFile: string | null,
    response: string,
    parentId: string | null,
    branchId: string,
    createdAt: Date,
  }[],
;
```
