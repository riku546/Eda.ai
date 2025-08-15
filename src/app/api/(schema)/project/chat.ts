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

export const newChatInputSchema = z.object({
  projectId: z.string().uuid(),
});
