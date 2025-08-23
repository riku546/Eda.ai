"use client";

import PageContainer from "@/components/common/PageContainer";
import Sidebar from "@/components/common/Sidebar";
import { authClient } from "@/lib/auth-client";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

// Dummy data for projects and chats
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

const DashboardPage = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // redirect to login page
        },
      },
    });
  };

  return (
    <PageContainer>
      <Box sx={{ display: "flex" }}>
        <Sidebar projects={dummyProjects} chats={dummyChats} />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Box
            sx={{
              display: "flex",
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button variant="contained" onClick={handleSignOut}>
              Logout
            </Button>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default DashboardPage;
