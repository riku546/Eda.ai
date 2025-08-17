import { prisma } from "@/lib/prisma";

export class ChatRepository {
  /**
   * 新しいチャット、ブランチ、メッセージをトランザクション内で一括作成します。
   * @param summary チャットの要約
   * @param userId ユーザーID
   * @param promptText 最初のメッセージのプロンプト
   * @param promptFile 最初のメッセージに添付するファイル（任意）
   * @param response AIからの最初のレスポンス
   * @returns 作成されたchat, branch, messageオブジェクト
   */
  create = async (
    summary: string,
    userId: string,
    promptText: string,
    promptFile: string | null,
    response: string,
  ) => {
    return await prisma.$transaction(async (tx) => {
      // 1. Chatを作成
      const newChat = await tx.chat.create({
        data: {
          summary,
          userId,
        },
      });

      // 2. Branchを作成（最初のブランチは "main" とする）
      const newBranch = await tx.branch.create({
        data: {
          summary: "main",
          parentBranchId: null,
          chatId: newChat.id,
        },
      });

      // 3. Messageを作成
      const newMessage = await tx.message.create({
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

  getSpecificMessage = async (messageId: string) => {
    return await prisma.message.findUnique({
      where: { id: messageId },
    });
  };

  createMessage = async (
    branchId: string,
    promptText: string,
    promptFile: string | null,
    response: string,
    parentId: string,
  ) => {
    return await prisma.message.create({
      data: {
        promptText,
        promptFile,
        parentId,
        response,
        branchId,
      },
    });
  };
}
