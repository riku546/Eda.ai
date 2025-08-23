"use client";

import MessageInputBar from "@/components/common/MessageInputBar";
import PageContainer from "@/components/common/PageContainer";
import Sidebar from "@/components/common/Sidebar";
import { useMessageInput } from "@/hooks/common/useMessageInput";
import { Box, Paper, Snackbar, Stack, Typography } from "@mui/material";

// Dummy data for projects and chats for Sidebar
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

// Dummy data for chat messages
const dummyMessages = [
  { id: 1, sender: "user", text: "Hello, I need help with my project." },
  {
    id: 2,
    sender: "bot",
    text: "Of course! I can help with that. What seems to be the problem?",
  },
  {
    id: 3,
    sender: "user",
    text: "I am having trouble with setting up the database connection.",
  },
  {
    id: 4,
    sender: "bot",
    text: "I see. Can you please provide me with the database type and the error message you are receiving?",
  },
];

const ChatMessage = ({
  sender,
  text,
}: { sender: "user" | "bot"; text: string }) => {
  const isBot = sender === "bot";
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: isBot ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: isBot ? "grey.200" : "primary.main",
          color: isBot ? "black" : "primary.contrastText",
          maxWidth: "70%",
        }}
      >
        <Typography variant="body1">{text}</Typography>
      </Paper>
    </Stack>
  );
};

const ChatPage = () => {
  const { toast, setToast, ...messageInput } = useMessageInput();

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
            {dummyMessages.map((msg) => (
              <ChatMessage
                key={msg.id}
                sender={msg.sender as "user" | "bot"}
                text={msg.text}
              />
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
