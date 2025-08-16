import z from "zod";

export const chatListInputSchema = z.object({
  projectId: z.string().uuid(),
});

const base64ImageSchema = z.string().refine(
  (data) => {
    // data:image/で始まるBase64文字列かチェック
    const base64ImageRegex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    return base64ImageRegex.test(data);
  },
  {
    message: "有効な画像のBase64データである必要があります",
  },
);

export const newChatInputSchema = z.object({
  projectId: z.string().uuid(),
  inputText: z.string(),
  inputFile: base64ImageSchema.nullable(),
});

export const getMessageInputSchema = z.object({
  branchId: z.string().uuid(),
});

export const sendMessageInputSchema = z.object({
  branchId: z.string().uuid(),
  promptText: z.string(),
  promptFile: base64ImageSchema.nullable(),
  latestMessageId: z.string().uuid(),
});

export type NewChatInput = z.infer<typeof newChatInputSchema>;
export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;
