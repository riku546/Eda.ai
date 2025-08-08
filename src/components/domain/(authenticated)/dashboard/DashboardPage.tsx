"use client";

import PageContainer from "@/components/common/PageContainer";
import { authClient } from "@/lib/auth-client";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
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
    </PageContainer>
  );
};

export default DashboardPage;
