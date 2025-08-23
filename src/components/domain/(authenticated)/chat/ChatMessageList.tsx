"use client";
import type { apiClient } from "@/lib/trpc";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = Awaited<
  ReturnType<typeof apiClient.chat.branch.getMessages.query>
>[number];

export type ChatActor = "user" | "bot";

/* Bubble */
interface BubbleProps {
  mine?: boolean;
  text: string;
  time?: string;
  groupedTop?: boolean;
  groupedBottom?: boolean;
}
const Bubble = memo(function Bubble({
  mine,
  text,
  time,
  groupedTop,
  groupedBottom,
}: BubbleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: mine ? "flex-end" : "flex-start",
        mb: groupedBottom ? 0.5 : 1.25,
      }}
    >
      <Paper
        elevation={mine ? 1 : 0}
        sx={(t) => ({
          maxWidth: "100%",
          px: 1.5,
          py: 1,
          borderRadius: 3,
          borderTopLeftRadius: mine ? 3 : groupedTop ? 3 : 1.25,
          borderTopRightRadius: mine ? (groupedTop ? 3 : 1.25) : 3,
          borderBottomLeftRadius: mine ? 3 : groupedBottom ? 3 : 1.25,
          borderBottomRightRadius: mine ? (groupedBottom ? 3 : 1.25) : 3,
          bgcolor: mine ? t.palette.primary.main : t.palette.background.paper,
          color: mine ? t.palette.primary.contrastText : t.palette.text.primary,
          border: mine ? "none" : `1px solid ${t.palette.divider}`,
          boxShadow: mine
            ? `0 2px 10px ${alpha(t.palette.common.black, 0.15)}`
            : "none",
          transition: "transform .12s ease, opacity .12s ease",
        })}
      >
        <Typography variant="body1" component="div" sx={{ lineHeight: 1.6 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </Typography>
        {!!time && (
          <Typography
            variant="caption"
            sx={{
              opacity: 0.6,
              display: "block",
              textAlign: "right",
              mt: 0.25,
            }}
          >
            {time}
          </Typography>
        )}
      </Paper>
    </Box>
  );
});

export const DateSeparator = memo(function DateSeparator({
  label,
}: { label: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 2.5 }}>
      <Box sx={{ flex: 1, height: 1, bgcolor: "divider" }} />
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: 1, bgcolor: "divider" }} />
    </Stack>
  );
});

export interface ChatMessageListProps {
  messages: Message[];
  dateLabel?: string;
  onCreateBranch?: (messageId: string) => void;
}
export const ChatMessageList = ({
  messages,
  dateLabel = "Today",
  onCreateBranch,
}: ChatMessageListProps) => {
  return (
    <Box sx={{ width: "100%", overflowY: "auto", py: 3, px: { xs: 2, md: 3 } }}>
      <DateSeparator label={dateLabel} />
      {messages.map((msg) => (
        <Box key={msg.id}>
          {msg.promptText && (
            <Bubble mine text={msg.promptText} groupedBottom />
          )}

          {msg.response && <Bubble text={msg.response} groupedTop />}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              mt: 0.25,
              pl: 1,
            }}
          >
            <Tooltip title="この対話からブランチを作成" arrow>
              <span>
                <IconButton
                  size="small"
                  onClick={() => onCreateBranch?.(msg.id)}
                >
                  <CallSplitIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ChatMessageList;
