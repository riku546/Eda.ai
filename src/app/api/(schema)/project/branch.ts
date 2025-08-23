import z from "zod";

export const newBranchInputSchema = z.object({
  summary: z.string(),
  parentBranchId: z.string().uuid(),
  chatId: z.string().uuid(),
  messageId: z.string().uuid(),
  promptText: z.string(),
  response: z.string(),
});

export const mergeBranchInputSchema = z.object({
  branchId: z.string().uuid(),
});

export const branchStructureInputSchema = z.object({
  chatId: z.string().uuid(),
});

export type BranchStructureInput = z.infer<typeof branchStructureInputSchema>;
