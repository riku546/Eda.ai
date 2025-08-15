import { generateContent, generateSummaryPrompt } from "../(LLM)/gemini";
import {
  createChatInProject,
  getChatList,
  updateInstruction,
} from "../(Repository)/project";
import { instructionSchema } from "../(schema)/project";
import {
  chatListInputSchema,
  newChatInputSchema,
} from "../(schema)/project/chat";
import { procedure, router } from "../trpc/[trpc]/index";

export const projectRouter = router({
  updateInstruction: procedure
    .input(instructionSchema)
    .mutation(async ({ input }) => {
      await updateInstruction(input.projectId, input.instruction);
    }),
  chat: router({
    list: procedure.input(chatListInputSchema).query(async ({ input }) => {
      return await getChatList(input.projectId);
    }),
    new: procedure.input(newChatInputSchema).mutation(async ({ input }) => {
      const [summary, resFromLLM] = await Promise.all([
        generateContent(undefined, {
          text: generateSummaryPrompt(input.inputText),
        }),
        generateContent(undefined, {
          text: input.inputText,
          file: { data: input.inputFile ?? undefined },
        }),
      ]);

      const result = await createChatInProject(
        summary,
        input.projectId,
        input.inputText,
        input.inputFile,
        resFromLLM,
      );

      return result;
    }),
  }),
});
