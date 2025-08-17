import { ChatController } from "../(Contoller)/chat";
import {
  createChatInputSchema,
  getMessageInputSchema,
  mergeBranchInputSchema,
  newBranchInputSchema,
  sendMessageInputSchema,
} from "../(schema)/chat";
import { procedure, router } from "../trpc/[trpc]/index";

const chatController = new ChatController();

export const chatRouter = router({
  new: procedure.input(createChatInputSchema).mutation(async ({ input }) => {
    return await chatController.create(input);
  }),
  branch: router({
    sendMessage: procedure
      .input(sendMessageInputSchema)
      .mutation(async ({ input }) => {
        return await chatController.sendMessage(input);
      }),
    merge: procedure
      .input(mergeBranchInputSchema)
      .mutation(async ({ input }) => {
        await chatController.mergeBranch(input.branchId);
      }),
    new: procedure.input(newBranchInputSchema).mutation(async ({ input }) => {
      return await chatController.createBranch(input);
    }),
    getMessages: procedure
      .input(getMessageInputSchema)
      .query(async ({ input }) => {
        return await chatController.getMessages(input.branchId);
      }),
  }),
});
