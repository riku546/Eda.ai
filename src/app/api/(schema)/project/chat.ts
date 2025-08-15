import z from "zod";

export const SendMessageInputSchema = z.object({
  messageContent: z.object({
    text: z.string(),
    file: z
      .object({
        /** Optional. Display name of the blob. Used to provide a label or filename to distinguish blobs. This field is not currently used in the Gemini GenerateContent calls. */
        displayName: z.string().optional(),
        /*Encoded as base64 string. */
        data: z.string().optional(),
        /** Required. The IANA standard MIME type of the source data. */
        mimeType: z.string().optional(),
      })
      .optional(),
  }),
});

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

export type NewChatInput = z.infer<typeof newChatInputSchema>;
