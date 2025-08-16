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
        text: gemini.generateSummaryPrompt(input.inputText),
      }),
      gemini.generateContent(undefined, {
        text: input.inputText,
        file: { data: input.inputFile ?? undefined },
      }),
    ]);

    const result = await projectRepository.createChat(
      summary,
      input.projectId,
      input.inputText,
      input.inputFile,
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
}
