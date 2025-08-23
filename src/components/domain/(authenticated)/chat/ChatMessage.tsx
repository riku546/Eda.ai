import { Paper, Stack, Typography } from "@mui/material";

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

export default ChatMessage;
