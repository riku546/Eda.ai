import { type Content, GoogleGenAI } from "@google/genai";

export const models = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
] as const;

export const sendMessageInChat = async (
  history: Content[],
  message: string,
  model: (typeof models)[number],
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.chats
    .create({
      model: model,
      history: history,
    })
    .sendMessage({
      message: message,
    });

  return response.text ?? "";
};
