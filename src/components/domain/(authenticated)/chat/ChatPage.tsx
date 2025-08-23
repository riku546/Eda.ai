"use client";

import MessageInputBar from "@/components/common/MessageInputBar";
import PageContainer from "@/components/common/PageContainer";
import Sidebar from "@/components/common/Sidebar";
import { useMessageInput } from "@/hooks/domain/chat/useMessageInput";
import { _unused } from "@/lib/_unused";
import { apiClient } from "@/lib/trpc";
import { Box, Snackbar } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";

const dummyProjects = [
  { id: "proj-1", name: "Project Alpha" },
  { id: "proj-2", name: "Project Beta" },
  { id: "proj-3", name: "Project Gamma" },
];

const dummyChats = [
  { id: "chat-1", title: "Chat about Next.js" },
  { id: "chat-2", title: "Chat about Prisma" },
  { id: "chat-3", title: "Chat about Tailwind" },
];

const ChatPage = () => {
  const params = useParams();
  const branchId = typeof params.branchId === "string" ? params.branchId : "";
  const [messages, setMessages] = useState<
    {
      id: string;
      branchId: string;
      createdAt: string;
      promptText: string;
      promptFile: string | null;
      parentId: string | null;
      response: string;
    }[]
  >([]);
  const [latestMessageId, setLatestMessageId] = useState<string | null>(null);

  const { toast, setToast, ...messageInput } = useMessageInput(
    _unused,
    branchId,
    latestMessageId,
  );

  useEffect(() => {
    const fetchMessages = async () => {
      if (branchId) {
        try {
          const res = await apiClient.chat.branch.getMessages.query({
            branchId,
          });
          setMessages(res);
          setLatestMessageId(res.length > 0 ? res[res.length - 1].id : null);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };

    fetchMessages();
  }, [branchId]);

  return (
    <PageContainer>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Sidebar projects={dummyProjects} chats={dummyChats} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 3,
            }}
          >
            {messages.map((msg) => (
              <div key={msg.id}>
                <ChatMessage sender="user" text={msg.promptText} />
                {msg.response && (
                  <ChatMessage sender="bot" text={msg.response} />
                )}
              </div>
            ))}
          </Box>
          <Box sx={{ p: 2, bgcolor: "background.paper" }}>
            <MessageInputBar {...messageInput} />
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={!!toast}
        autoHideDuration={2200}
        onClose={() => setToast(null)}
        message={toast ?? ""}
      />
    </PageContainer>
  );
};

export default ChatPage;
