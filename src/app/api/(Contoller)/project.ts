import type { MessageInProject } from "@prisma/client";
import { Gemini } from "../(LLM)/gemini";
import { ProjectRepository } from "../(Repository)/project";
import type { NewChatInput, SendMessageInput } from "../(schema)/project/chat";

const projectRepository = new ProjectRepository();
const gemini = new Gemini();

export class ProjectController {
  createChat = async (input: NewChatInput) => {
    const [summary, resFromLLM] = await Promise.all([
      gemini.generateContent(undefined, {
        text: gemini.generateSummaryPrompt(input.promptText),
      }),
      gemini.generateContent(undefined, {
        text: input.promptText,
        file: { data: input.promptFile ?? undefined },
      }),
    ]);

    const result = await projectRepository.createChat(
      summary,
      input.projectId,
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

    const newMessage = await projectRepository.createMessage(
      input.branchId,
      input.promptText,
      input.promptFile,
      res,
      input.latestMessageId,
    );
    return newMessage;
  };

  mergeBranch = async (branchId: string) => {
    const branch = await projectRepository.getSpecificBranch(branchId);
    if (!branch) throw new Error("Branch not found");

    const parentBranchId = branch.parentBranchId;
    if (!parentBranchId) throw new Error("Parent branch not found");

    const descendantBranchIds = await this.getDescendantBranches(branchId);

    await projectRepository.updateBranchInMessage(
      parentBranchId,
      descendantBranchIds,
    );
  };

  //引数のmessageIdから親メッセージを辿ることで、今までのメッセージを取得する
  private getMessageHistory = async (messageId: string) => {
    const messageHistory: MessageInProject[] = [];
    let currentMessageId: string | null = messageId;

    while (currentMessageId) {
      const message =
        await projectRepository.getSpecificMessage(currentMessageId);

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
        await projectRepository.getDescendantBranches(currentId);
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
