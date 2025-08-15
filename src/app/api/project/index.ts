import { getChatList, updateInstruction } from "../(Repository)/project";
import { instructionSchema } from "../(schema)/project";
import { chatListInputSchema } from "../(schema)/project/chat";
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
  }),
});
