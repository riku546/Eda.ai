import type { Content, Part } from "@google/genai";
import { GoogleGenAI } from "@google/genai";
import type { MessageInProject } from "@prisma/client";

export const models = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
] as const;

export class Gemini {
  generateContent = async (
    history: Content[] | undefined,
    messageContent: { text: string; file?: string },
  ) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = this.formatPrompt(messageContent);

    const response = await ai.chats
      .create({
        model: "gemini-2.0-flash-lite",
        history: history,
      })
      .sendMessage({
        message: prompt,
      });

    return response.text ?? "";
  };

  formatPrompt = (messageContent: {
    text: string;
    file?: string;
  }): Part[] => {
    const parts: Part[] = [{ text: messageContent.text }];

    if (messageContent.file) {
      parts.push({ inlineData: { data: messageContent.file } });
    }

    return parts;
  };

  formatHistoryForGemini = (
    history: MessageInProject[],
  ): Array<{
    parts: Array<{ text?: string; inlineData?: { data: string | undefined } }>;
    role: string;
  }> => {
    return history.flatMap((message) => {
      const userMessage = {
        parts: [
          {
            text: message.promptText,
          },
        ],
        role: "user",
      };

      const userFile = {
        parts: [
          {
            inlineData: { data: message.promptFile ?? undefined },
          },
        ],
        role: "user",
      };

      // AIのレスポンス
      const modelMessage = {
        parts: [{ text: message.response }],
        role: "model",
      };

      return [userMessage, userFile, modelMessage];
    });
  };

  generateSummaryPrompt = (inputText: string) => {
    return `以下のテキストの要約を一文で作成してください。テキスト：${inputText}`;
  };
}
