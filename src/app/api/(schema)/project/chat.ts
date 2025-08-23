import z from "zod";
import { base64ImageSchema } from "../common";

export const chatListInputSchema = z.object({
  projectId: z.string().uuid(),
});

export const newChatInputSchema = z.object({
  projectId: z.string().uuid(),
  promptText: z.string(),
  promptFile: z
    .object({
      data: base64ImageSchema,
      mimeType: z.string(),
    })
    .optional(),
});

export const getMessageInputSchema = z.object({
  branchId: z.string().uuid(),
});

export const sendMessageInputSchema = z.object({
  branchId: z.string().uuid(),
  promptText: z.string(),
  promptFile: z
    .object({
      data: base64ImageSchema,
      mimeType: z.string(),
    })
    .optional(),
  latestMessageId: z.string().uuid(),
});

export type NewChatInput = z.infer<typeof newChatInputSchema>;
export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;
