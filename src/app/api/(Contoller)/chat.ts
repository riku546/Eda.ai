import type { Message } from "@prisma/client";
import { Gemini } from "../(LLM)/gemini";
import { ChatRepository } from "../(Repository)/chat";
import type {
  CreateChatInput,
  NewBranchInput,
  SendMessageInput,
} from "../(schema)/chat";

const gemini = new Gemini();
const chatRepository = new ChatRepository();

export class ChatController {
  create = async (input: CreateChatInput, userId: string) => {
    const [summary, resFromLLM] = await Promise.all([
      gemini.generateContent(undefined, {
        text: gemini.generateSummaryPrompt(input.promptText),
      }),
      gemini.generateContent(undefined, {
        text: input.promptText,
        file: { data: input.promptFile ?? undefined },
      }),
    ]);

    const result = await chatRepository.create(
      summary,
      userId,
      input.promptText,
      input.promptFile,
      resFromLLM,
    );

    return result;
  };
  sendMessage = async (input: SendMessageInput) => {
    const history = await this.getMessageHistory(input.latestMessageId);
    const formattedHistory = gemini.formatHistoryForGemini(history);

    const res = await gemini.generateContent(formattedHistory, {
      text: input.promptText,
      file: { data: input.promptFile ?? undefined },
    });

    const newMessage = await chatRepository.createMessage(
      input.branchId,
      input.promptText,
      input.promptFile,
      res,
      input.latestMessageId,
    );

    return newMessage;
  };

  mergeBranch = async (branchId: string) => {
    const branch = await chatRepository.getSpecificBranch(branchId);
    if (!branch) throw new Error("Branch not found");

    const parentBranchId = branch.parentBranchId;
    if (!parentBranchId) throw new Error("Parent branch not found");

    const descendantBranchIds = await this.getDescendantBranches(branchId);

    await chatRepository.updateBranchInMessage(
      parentBranchId,
      descendantBranchIds,
    );
  };

  createBranch = async (input: NewBranchInput) => {
    const newBranch = await chatRepository.createBranch(
      input.summary,
      input.parentBranchId,
      input.chatId,
    );

    return newBranch;
  };

  getMessages = async (branchId: string) => {
    return await chatRepository.getMessages(branchId);
  };

  private getMessageHistory = async (messageId: string) => {
    const messageHistory: Message[] = [];
    let currentMessageId: string | null = messageId;

    while (currentMessageId) {
      const message = await chatRepository.getSpecificMessage(currentMessageId);

      if (!message) {
        break;
      }

      messageHistory.unshift(message);

      currentMessageId = message.parentId;
    }

    return messageHistory;
  };

  //幅優先探索でbranchIdの子孫ブランチを取得する
  private getDescendantBranches = async (branchId: string) => {
    const descendantBranchIds: string[] = [branchId];
    const queue: string[] = [branchId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift();

      if (!currentId) break;

      const currentBranch =
        await chatRepository.getDescendantBranches(currentId);
      if (!currentBranch) break;

      for (const child of currentBranch.childBranches) {
        if (!visited.has(child.id)) {
          visited.add(child.id);
          descendantBranchIds.push(child.id);
          queue.push(child.id);
        }
      }
    }
    return descendantBranchIds;
  };
}
