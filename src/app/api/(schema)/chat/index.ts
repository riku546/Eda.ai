import z from "zod";
import { base64ImageSchema } from "../common";

export const createChatInputSchema = z.object({
  promptText: z.string(),
  promptFile: base64ImageSchema.nullable(),
});

export type CreateChatInput = z.infer<typeof createChatInputSchema>;
