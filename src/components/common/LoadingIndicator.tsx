import { CircularProgress, Stack, Typography } from "@mui/material";

export default function LoadingIndicator({ text }: { text: string }) {
  return (
    <Stack spacing={2} alignItems="center">
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Stack>
  );
}
