import { ChatController } from "../(Contoller)/chat";
import { createChatInputSchema } from "../(schema)/chat";
import { procedure, router } from "../trpc/[trpc]/index";

const chatController = new ChatController();

export const chatRouter = router({
  new: procedure.input(createChatInputSchema).mutation(async ({ input }) => {
    return await chatController.create(input);
  }),
});
