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

export const getMessageInputSchema = z.object({
  branchId: z.string().uuid(),
});

export const newBranchInputSchema = z.object({
  summary: z.string(),
  parentBranchId: z.string().uuid(),
  chatId: z.string().uuid(),
});

export const mergeBranchInputSchema = z.object({
  branchId: z.string().uuid(),
});

export const updateChatIsPinnedInputSchema = z.object({
  chatId: z.string().uuid(),
  isPinned: z.boolean(),
});

export type CreateChatInput = z.infer<typeof createChatInputSchema>;
export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;
export type GetMessageInput = z.infer<typeof getMessageInputSchema>;
export type NewBranchInput = z.infer<typeof newBranchInputSchema>;
export type MergeBranchInput = z.infer<typeof mergeBranchInputSchema>;
export type UpdateChatIsPinnedInput = z.infer<
  typeof updateChatIsPinnedInputSchema
>;
