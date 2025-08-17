import { ChatController } from "../(Contoller)/chat";
import {
  createChatInputSchema,
  sendMessageInputSchema,
} from "../(schema)/chat";
import { procedure, router } from "../trpc/[trpc]/index";

const chatController = new ChatController();

export const chatRouter = router({
  new: procedure.input(createChatInputSchema).mutation(async ({ input }) => {
    return await chatController.create(input);
  }),
  sendMessage: procedure
    .input(sendMessageInputSchema)
    .mutation(async ({ input }) => {
      return await chatController.sendMessage(input);
    }),
});
