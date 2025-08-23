"use client";

import MessageInputBar from "@/components/common/MessageInputBar";
import Sidebar from "@/components/common/Sidebar";
import { useMessageInput } from "@/hooks/common/useMessageInput";
import { Box, Snackbar, alpha } from "@mui/material";
import { useRouter } from "next/navigation";
import ChatMessageList, { type ChatMessageData } from "./ChatMessageList";

import { useParams } from "next/navigation"; // Added useParams import
/** Dummy data */
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

const dummyMessages: ChatMessageData[] = [
  {
    id: 1,
    sender: "user",
    text: "Hello, I need help with my project.",
    time: "10:12",
  },
  {
    id: 2,
    sender: "bot",
    text: "Of course! I can help with that. What seems to be the problem?",
    time: "10:12",
  },
  {
    id: 3,
    sender: "user",
    text: "I am having trouble with setting up the database connection.",
    time: "10:13",
  },
  {
    id: 4,
    sender: "bot",
    text: "I see. Can you please provide me with the database type and the error message you are receiving?",
    time: "10:14",
  },
];

/* ───────── ページ本体 ───────── */

const ChatPage = () => {
  const { toast, setToast, ...messageInput } = useMessageInput();
  const router = useRouter();
  const params = useParams();
  const chatId = (params?.id as string) ?? "unknown"; // ルート param ( /chat/[id] )
  const handleCreateBranch = async (messageId: string | number) => {
    try {
      // TODO: 実際の入力を整える (summary, parentBranchId, chatId)
      // const res = await apiClient.chat.branch.new.mutate(input);
      // 仮: 新規ブランチIDをダミー生成
      const newBranchId = `branch-${messageId}`; // TODO: 実際は API の戻り値
      // 成功トースト
      setToast("Branch created");
      // リダイレクト: (authenticated) はルートグループ名で URL には含まれない
      router.push(`/chat/${chatId}/branch/${newBranchId}`);
    } catch {
      setToast("Branch create failed");
    }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", height: "100dvh" }}>
        {/* 左サイドバー */}
        <Sidebar projects={dummyProjects} chats={dummyChats} />

        {/* 右：チャット本体 */}
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
          {/* メッセージリスト */}
          <ChatMessageList
            messages={dummyMessages}
            onCreateBranch={handleCreateBranch}
          />

          {/* 入力バー（ガラスのピルで浮かせる） */}
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
            {/* 中央寄せ用 Container を除去し全幅化 */}
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
