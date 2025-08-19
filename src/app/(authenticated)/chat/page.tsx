// filepath: [page.tsx](http://_vscodecontentref_/0)
"use client";

import Chat from "@/components/domain/(authenticated)/chat/Chat";
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

  return <Chat messages={messages} onHealthCheck={healthcheck} />;
};

export default page;
