import z from "zod";
import { base64ImageSchema } from "../common";

export const chatListInputSchema = z.object({
  projectId: z.string().uuid(),
});

export const newChatInputSchema = z.object({
  projectId: z.string().uuid(),
  promptText: z.string(),
  promptFile: base64ImageSchema.nullable(),
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
