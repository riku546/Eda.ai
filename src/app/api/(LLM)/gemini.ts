import type { Blob, Content } from "@google/genai";
import { GoogleGenAI } from "@google/genai";

export const models = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
] as const;

export const sendMessageInChat = async (
  history: Content[],
  messageContent: { text: string; file?: Blob },
  model: (typeof models)[number],
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.chats
    .create({
      model: model,
      history: history,
    })
    .sendMessage({
      message: { text: messageContent.text, inlineData: messageContent.file },
    });

  return response.text ?? "";
};
