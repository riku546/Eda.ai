import type { Blob, Content } from "@google/genai";
import { GoogleGenAI } from "@google/genai";

export const models = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
] as const;

export class Gemini {
  generateContent = async (
    history: Content[] | undefined,
    messageContent: { text: string; file?: Blob },
  ) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.chats
      .create({
        model: "gemini-2.0-flash-lite",
        history: history,
      })
      .sendMessage({
        message: { text: messageContent.text, inlineData: messageContent.file },
      });

    return response.text ?? "";
  };

  generateSummaryPrompt = (inputText: string) => {
    return `以下のテキストの要約を一文で作成してください。テキスト：${inputText}`;
  };
}
