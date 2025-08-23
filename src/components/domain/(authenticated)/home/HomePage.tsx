"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import MessageInputBar from "@/components/common/MessageInputBar";
import PageContainer from "@/components/common/PageContainer";
import Sidebar from "@/components/common/Sidebar";
import { useMessageInput } from "@/hooks/common/useMessageInput";
import { useProjects } from "@/hooks/common/useProjects";
import { Box, Snackbar, Stack, alpha } from "@mui/material";
import { useEffect } from "react";
import Title from "./Title";

const dummyChats = [
  { id: "chat-1", title: "Chat about Next.js" },
  { id: "chat-2", title: "Chat about Prisma" },
  { id: "chat-3", title: "Chat about Tailwind" },
];

export default function HomePage() {
  const { projects, loading, error: projectError } = useProjects();
  const { toast, setToast, ...messageInput } = useMessageInput();

  useEffect(() => {
    if (projectError) {
      setToast(projectError);
    }
  }, [projectError, setToast]);

  if (loading) {
    return (
      <PageContainer>
        <Sidebar projects={[]} chats={dummyChats} />
        <Box
          sx={{
            minHeight: "100dvh",
            width: "100%",
            display: "grid",
            placeItems: "center",
          }}
        >
          <LoadingIndicator text="プロジェクトを読み込み中..." />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Sidebar projects={projects} chats={dummyChats} />
      <Box
        sx={{
          minHeight: "100dvh",
          width: "100%",
          display: "grid",
          placeItems: "center",
          px: 2,
          py: 6,
          // 背景：ごく薄いグラデ＋パターン
          background: (t) =>
            `linear-gradient(180deg, ${alpha(t.palette.primary.light, 0.06)} 0%, transparent 30%),
             linear-gradient(0deg, ${alpha(t.palette.common.black, 0.02)} 0%, transparent 60%)`,
        }}
      >
        <Stack spacing={4} sx={{ width: "100%", maxWidth: 820 }}>
          <Title />
          <MessageInputBar {...messageInput} />
        </Stack>

        <Snackbar
          open={!!toast}
          autoHideDuration={2200}
          onClose={() => setToast(null)}
          message={toast ?? ""}
        />
      </Box>
    </PageContainer>
  );
}
