import z from "zod";

export const instructionSchema = z.object({
  projectId: z.string().uuid(),
  instruction: z.string(),
});
