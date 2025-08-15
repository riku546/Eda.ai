"use client";

import { useState } from "react";

const page = () => {
  const [messages, _setMessages] = useState<string[]>([""]);

  // async function sendChatMessage(message: string): Promise<void> {
  //   const res = await apiClient.gemini.mutate({
  //     messageContent: { text: message },
  //   });

  //   setMessages((prev) => [...prev, res]);
  // }

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
      <button type="button" disabled={!input}>
        送信
      </button>
    </div>
  );
};

export default page;
