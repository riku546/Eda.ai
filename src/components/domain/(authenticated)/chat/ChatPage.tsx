"use client";

import type { ApiRoutes } from "@/app/api/trpc/[trpc]/routers/_index";
import MessageInputBar from "@/components/common/MessageInputBar";
import Sidebar from "@/components/common/Sidebar";
import { useMessageInput } from "@/hooks/domain/chat/useMessageInput";
import { apiClient } from "@/lib/trpc";
import { Box, Snackbar } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { inferProcedureOutput } from "@trpc/server";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ChatMessageList from "./ChatMessageList";

type Message = Awaited<
  ReturnType<typeof apiClient.chat.branch.getMessages.query>
>[number];
type Project = Awaited<ReturnType<typeof apiClient.project.list.query>>[number];

type ChatsType = inferProcedureOutput<ApiRoutes["chat"]["getChatsByUserId"]>;

const ChatPage = () => {
  const params = useParams();
  const router = useRouter();
  const chatId = typeof params.id === "string" ? params.id : "";
  const branchId = typeof params.branchId === "string" ? params.branchId : "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [chats, setChats] = useState<ChatsType>([]);

  const latestMessageId = useMemo(() => {
    return messages.length > 0 ? messages[messages.length - 1].id : null;
  }, [messages]);

  const { toast, setToast, ...messageInput } = useMessageInput(
    chatId,
    branchId,
    latestMessageId,
  );

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [projRes, chatRes] = await Promise.all([
          apiClient.project.list.query(),
          apiClient.chat.getChatsByUserId.query(),
        ]);
        setProjects(projRes);
        setChats(
          chatRes.map((chat) => ({
            ...chat,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
          })),
        );
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
        setToast("プロジェクトまたはチャットの読み込みに失敗しました");
      }
    };
    fetchSidebarData();
  }, [setToast]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (branchId) {
        try {
          const res = await apiClient.chat.branch.getMessages.query({
            branchId,
          });
          setMessages(res);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };

    fetchMessages();
  }, [branchId]);

  const handleCreateBranch = async (messageId: string) => {
    const targetMessage = messages.find((m) => m.id === messageId);
    if (!targetMessage) {
      setToast(
        "ブランチの作成に失敗しました: 対象のメッセージが見つかりません",
      );
      return;
    }

    try {
      const summary =
        targetMessage.promptText.substring(0, 50) +
        (targetMessage.promptText.length > 50 ? "..." : "");

      const res = await apiClient.chat.branch.new.mutate({
        summary,
        parentBranchId: branchId,
        chatId: chatId,
        messageId: messageId,
        promptText: targetMessage.promptText,
        response: targetMessage.response,
      });

      setToast("新しいブランチを作成しました");
      router.push(`/chat/${chatId}/branch/${res.id}`);
    } catch (error) {
      console.error("Failed to create branch:", error);
      setToast("ブランチの作成に失敗しました");
    }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", height: "100dvh" }}>
        <Sidebar projects={projects} chats={chats} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "grid",
            gridTemplateRows: "1fr auto",
            // 背景をほんのりグラデ
            background: (t) =>
              `linear-gradient(180deg, ${t.palette.background.default} 0%,
               ${alpha(t.palette.primary.light, 0.06)} 100%)`,
          }}
        >
          <ChatMessageList
            messages={messages}
            onCreateBranch={handleCreateBranch}
          />
          <Box
            sx={(t) => ({
              position: "sticky",
              bottom: 0,
              zIndex: 1,
              px: { xs: 1.25, md: 2 },
              py: 1.25,
              borderTop: `1px solid ${t.palette.divider}`,
              backdropFilter: "blur(6px)",
              background: alpha(t.palette.background.paper, 0.8),
            })}
          >
            <Box sx={{ maxWidth: "100%", px: { xs: 0.5, md: 2 } }}>
              <MessageInputBar {...messageInput} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={!!toast}
        autoHideDuration={2200}
        onClose={() => setToast(null)}
        message={toast ?? ""}
      />
    </Box>
  );
};

export default ChatPage;
