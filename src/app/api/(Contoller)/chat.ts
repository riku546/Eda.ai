import type { Message } from "@prisma/client";
import { Gemini } from "../(LLM)/gemini";
import { ChatRepository } from "../(Repository)/chat";
import type { CreateChatInput, SendMessageInput } from "../(schema)/chat";

const gemini = new Gemini();
const chatRepository = new ChatRepository();

export class ChatController {
  create = async (input: CreateChatInput) => {
    const [summary, resFromLLM] = await Promise.all([
      gemini.generateContent(undefined, {
        text: gemini.generateSummaryPrompt(input.promptText),
      }),
      gemini.generateContent(undefined, {
        text: input.promptText,
        file: { data: input.promptFile ?? undefined },
      }),
    ]);

    const userId = "fdsjjj";

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
}
