import { TRPCError, initTRPC } from "@trpc/server";
import { authMiddleware } from "../middleware";

import z, { ZodError } from "zod";

import { ProjectController } from "@/app/api/(Contoller)/project";
import { ProjectRepository } from "@/app/api/(Repository)/project";
import { ChatController } from "../../../(Contoller)/chat";
import {
  createChatInputSchema as generalCreateChatInputSchema,
  getMessageInputSchema as generalGetMessageInputSchema,
  mergeBranchInputSchema as generalMergeBranchInputSchema,
  newBranchInputSchema as generalNewBranchInputSchema,
  sendMessageInputSchema as generalSendMessageInputSchema,
} from "../../../(schema)/chat";
import { instructionSchema } from "../../../(schema)/project";
import {
  mergeBranchInputSchema,
  newBranchInputSchema,
} from "../../../(schema)/project/branch";
import {
  chatListInputSchema,
  getMessageInputSchema,
  newChatInputSchema as projectNewChatInputSchema,
  sendMessageInputSchema,
} from "../../../(schema)/project/chat";

const t = initTRPC.create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const router = t.router;
export const procedure = t.procedure.use(authMiddleware);

const chatController = new ChatController();
export const chatRouter = router({
  new: procedure
    .input(generalCreateChatInputSchema)
    .mutation(async ({ input }) => {
      // 変更
      return await chatController.create(input);
    }),
  branch: router({
    sendMessage: procedure
      .input(generalSendMessageInputSchema) // 変更
      .mutation(async ({ input }) => {
        return await chatController.sendMessage(input);
      }),
    merge: procedure
      .input(generalMergeBranchInputSchema) // 変更
      .mutation(async ({ input }) => {
        await chatController.mergeBranch(input.branchId);
      }),
    new: procedure
      .input(generalNewBranchInputSchema)
      .mutation(async ({ input }) => {
        // 変更
        return await chatController.createBranch(input);
      }),
    getMessages: procedure
      .input(generalGetMessageInputSchema) // 変更
      .query(async ({ input }) => {
        return await chatController.getMessages(input.branchId);
      }),
  }),
});

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
    new: procedure
      .input(projectNewChatInputSchema)
      .mutation(async ({ input }) => {
        // 変更
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
      merge: procedure
        .input(mergeBranchInputSchema)
        .mutation(async ({ input }) => {
          await projectController.mergeBranch(input.branchId);
        }),
    }),
  }),
});

export const apiRoutes = router({
  project: projectRouter,
  chat: chatRouter,
  healthcheck: procedure
    .input(
      z.object({
        message: z.enum(["ok", "error"]),
      }),
    )
    .query(async ({ input }) => {
      if (input.message === "error") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "error",
        });
      }
      return {
        status: input.message,
      };
    }),
});

export type ApiRoutes = typeof apiRoutes;
