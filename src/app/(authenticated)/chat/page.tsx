"use client";

import { apiClient } from "@/lib/apiClient";
import { useState } from "react";

async function sendChatMessage(message: string): Promise<string> {
  const res = await apiClient.chat.$post({ body: { message } });

  return res.message;
}
const page = () => {
  const [input, setInput] = useState("");
  return (
    <div>
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
