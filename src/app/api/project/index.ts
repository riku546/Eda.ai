import { ProjectController } from "../(Contoller)/project";
import { ProjectRepository } from "../(Repository)/project";
import { instructionSchema } from "../(schema)/project";
import { newBranchInputSchema } from "../(schema)/project/branch";
import {
  chatListInputSchema,
  getMessageInputSchema,
  newChatInputSchema,
  sendMessageInputSchema,
} from "../(schema)/project/chat";
import { procedure, router } from "../trpc/[trpc]/index";

const projectController = new ProjectController();
const projectRepository = new ProjectRepository();

export const projectRouter = router({
  list: procedure.query(async () => {
    const userId = "fdsjjj";
    return await projectRepository.getProjectList(userId);
  }),
  updateInstruction: procedure
    .input(instructionSchema)
    .mutation(async ({ input }) => {
      await projectRepository.updateInstruction(
        input.projectId,
        input.instruction,
      );
    }),
  chat: router({
    list: procedure.input(chatListInputSchema).query(async ({ input }) => {
      return await projectRepository.getChatList(input.projectId);
    }),
    new: procedure.input(newChatInputSchema).mutation(async ({ input }) => {
      return await projectController.createChat(input);
    }),
    branch: router({
      getMessage: procedure
        .input(getMessageInputSchema)
        .query(async ({ input }) => {
          return await projectRepository.getMessages(input.branchId);
        }),
      sendMessage: procedure
        .input(sendMessageInputSchema)
        .mutation(async ({ input }) => {
          return await projectController.sendMessage(input);
        }),
      new: procedure.input(newBranchInputSchema).mutation(async ({ input }) => {
        return await projectRepository.createBranch(
          input.summary,
          input.parentBranchId,
          input.chatId,
        );
      }),
    }),
  }),
});
