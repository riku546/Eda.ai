import { Gemini } from "../(LLM)/gemini";
import { ChatRepository } from "../(Repository)/chat";
import type { CreateChatInput } from "../(schema)/chat";

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
}
