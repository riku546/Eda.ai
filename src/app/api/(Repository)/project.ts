import { prisma } from "@/lib/prisma";

export const updateInstruction = async (
  projectId: string,
  instruction: string,
) => {
  await prisma.project.update({
    where: { id: projectId },
    data: { instruction },
  });
};

export const getChatList = async (projectId: string) => {
  return await prisma.chatInProject.findMany({
    where: { projectId },
    include: { branches: true },
  });
};

//ユーザーがメッセージ（promptText, promptFile）を入力したら、自動でチャットとmainブランチを作成するロジックが必要。
export const createChatInProject = async (
  summary: string,
  projectId: string,
  promptText: string,
  promptFile: string | null,
  response: string,
) => {
  return await prisma.$transaction(async (tx) => {
    // ChatInProjectを作成
    const newChat = await tx.chatInProject.create({
      data: {
        summary,
        projectId,
      },
    });

    // BranchInProjectを作成
    const newBranch = await tx.branchInProject.create({
      data: {
        summary: "main",
        parentBranchId: null,
        chatId: newChat.id,
      },
    });

    // MessageInProjectを作成
    const newMessage = await tx.messageInProject.create({
      data: {
        promptText,
        promptFile,
        parentId: null,
        response,
        branchId: newBranch.id,
      },
    });

    return {
      chat: newChat,
      branch: newBranch,
      message: newMessage,
    };
  });
};
