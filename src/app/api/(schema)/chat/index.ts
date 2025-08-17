import z from "zod";
import { base64ImageSchema } from "../common";

export const createChatInputSchema = z.object({
  promptText: z.string(),
  promptFile: base64ImageSchema.nullable(),
});

export const sendMessageInputSchema = z.object({
  promptText: z.string(),
  promptFile: base64ImageSchema.nullable(),
  branchId: z.string().uuid(),
  latestMessageId: z.string().uuid(),
});

export type CreateChatInput = z.infer<typeof createChatInputSchema>;
export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;
