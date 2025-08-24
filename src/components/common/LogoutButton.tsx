import { authClient } from "@/lib/auth-client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
const LogoutButton = () => {
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
    <Button
      onClick={handleSignOut}
      variant="outlined"
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 50,
        color: "black",
        borderColor: "black",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          borderColor: "black",
        },
      }}
    >
      ログアウト
    </Button>
  );
};

export default LogoutButton;
