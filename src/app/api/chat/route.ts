import { sendMessageInChat } from "../(LLM)/gemini";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { message, model } = await request.json();

  const history = [
    {
      parts: [{ text: "初めまして、私の手伝いをしてください。" }],
      role: "user",
    },
  ];
  const response = await sendMessageInChat(history, message, model);
  return NextResponse.json({ message: response });
}
