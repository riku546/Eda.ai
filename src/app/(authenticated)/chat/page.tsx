"use client";

//このページは削除していいです。

import { apiClient } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useState } from "react";

const page = () => {
  const [messages, _setMessages] = useState<string[]>([""]);

  const healthcheck = async () => {
    try {
      // エラーを発生させる
      await apiClient.healthcheck.query({ message: "error" });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        console.error(error.data);
      }
    }
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message}>{message}</div>
        ))}
      </div>

      <button type="button" onClick={healthcheck}>
        healthcheck
      </button>
    </div>
  );
};

export default page;
