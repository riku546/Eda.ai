import { GoogleGenAI } from "@google/genai";
import { createRoute } from "./frourio.server";

export const { POST } = createRoute({
  post: async ({ body: { message } }) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const chatSession = await ai.chats.create({
      model: "gemini-2.0-flash-lite",
      history: [
        {
          parts: [{ text: "初めまして、私の手伝いをしてください。" }],
          role: "user",
        },
      ], //roleはuser,modelのみ
    });

    const response = await chatSession.sendMessage({
      message: message,
    });

    return { status: 200, body: { message: response.text ?? "" } };
  },
});
