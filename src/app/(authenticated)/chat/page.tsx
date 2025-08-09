"use client";

import { useState } from "react";

const page = () => {
  const [messages, setMessages] = useState<string[]>([""]);

  async function sendChatMessage(message: string): Promise<void> {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({ message, model: "gemini-2.0-flash-lite" }),
    });

    const data = await res.json();

    setMessages((prev) => [...prev, data.message]);
  }

  const [input, setInput] = useState("");
  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message}>{message}</div>
        ))}
      </div>
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        className="rounded-md border-2 border-gray-300 p-2"
      />
      <button
        type="button"
        onClick={() => sendChatMessage(input)}
        disabled={!input}
      >
        送信
      </button>
    </div>
  );
};

export default page;
