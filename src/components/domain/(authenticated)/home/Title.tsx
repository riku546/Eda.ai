import { Stack, Typography } from "@mui/material";

const Title = () => {
  return (
    <Stack spacing={1} alignItems="center" textAlign="center">
      <Typography
        variant="h4"
        fontWeight={900}
        letterSpacing={0.2}
        sx={{ lineHeight: 1.15 }}
      >
        EDA.ai
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Branch, Compare, Merge — まずはメッセージを入力。
      </Typography>
    </Stack>
  );
};

export default Title;
