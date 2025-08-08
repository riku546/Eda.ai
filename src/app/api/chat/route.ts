import { sendMessageInChat } from "../(LLM)/gemini";
import { createRoute } from "./frourio.server";

export const { POST } = createRoute({
  post: async ({ body: { message, model } }) => {
    const history = [
      {
        parts: [{ text: "初めまして、私の手伝いをしてください。" }],
        role: "user",
      },
    ];
    const response = await sendMessageInChat(history, message, model);
    return { status: 200, body: { message: response } };
  },
});
