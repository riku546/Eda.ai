"use client";

import PageContainer from "@/components/common/PageContainer";
import Sidebar from "@/components/common/Sidebar";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CallSplitRoundedIcon from "@mui/icons-material/CallSplitRounded";
import CloseIcon from "@mui/icons-material/Close";
import DifferenceRoundedIcon from "@mui/icons-material/DifferenceRounded";
import MergeTypeRoundedIcon from "@mui/icons-material/MergeTypeRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import { memo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";

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
/** ─────────────────────────────────────────
 * 小さな表示専用コンポーネント
 * ───────────────────────────────────────── */
const Title = memo(function Title() {
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
});

const ToolIcon = memo(function ToolIcon({
  title,
  label,
  Icon,
  onClick,
}: {
  title: string;
  label: string;
  Icon: typeof AttachFileIcon;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <Tooltip title={title}>
      <IconButton
        aria-label={label}
        onClick={onClick}
        size="small"
        sx={{
          color: "text.secondary",
          p: 0.75,
          borderRadius: 2,
          "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
        }}
      >
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
});

/** ─────────────────────────────────────────
 * ページ本体
 * ───────────────────────────────────────── */
export default function HomePage() {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 入力・送信
  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value);

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const withCmd = isMac ? e.metaKey : e.ctrlKey;
    if (e.key === "Enter" && (withCmd || !e.shiftKey)) {
      e.preventDefault();
      onSend();
    }
  };

  const onSend = async () => {
    const payload = text.trim();
    if (!payload && !file) {
      setToast("テキストまたはファイルを入力してください");
      return;
    }
    try {
      setSending(true);
      // TODO: /api/messages へ送信
      await new Promise((r) => setTimeout(r, 450));
      setText("");
      setFile(null);
      setToast("送信しました（ダミー）");
    } finally {
      setSending(false);
    }
  };

  // 添付
  const openPicker = () => fileInputRef.current?.click();
  const onPicked = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setToast(`添付: ${f.name}`);
  };
  const clearFile = () => setFile(null);

  // 未実装ショートカット
  const notImpl = (label: string) => () => setToast(`${label} は未実装です`);

  return (
    <PageContainer>
      <Sidebar projects={dummyProjects} chats={dummyChats} />
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

          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.25, sm: 1.5 },
              borderRadius: 6,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: (t) => alpha(t.palette.background.paper, 0.7),
              backdropFilter: "blur(8px)", // うっすらガラス感
              boxShadow: (t) =>
                `0 10px 30px ${alpha(t.palette.common.black, 0.08)}`,
            }}
          >
            {/* 添付があれば上に出す */}
            {file && (
              <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                <Chip
                  label={file.name}
                  size="small"
                  onDelete={clearFile}
                  deleteIcon={<CloseIcon />}
                  sx={{ maxWidth: "100%" }}
                />
              </Stack>
            )}

            {/* ピル型の入力バー：アイコン群を内包 */}
            <TextField
              aria-label="message input"
              placeholder="メッセージを入力…（Enter送信 / Shift+Enter改行 / Ctrl or Cmd+Enter送信）"
              value={text}
              onChange={onChange}
              onKeyDown={onKey}
              disabled={sending}
              multiline
              minRows={2}
              maxRows={10}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ gap: 0.5 }}>
                    <ToolIcon
                      title="ファイルを添付"
                      label="attach file"
                      Icon={AttachFileIcon}
                      onClick={openPicker}
                    />
                    <ToolIcon
                      title="ブランチ作成（未実装）"
                      label="create branch"
                      Icon={CallSplitRoundedIcon}
                      onClick={notImpl("ブランチ作成")}
                    />
                    <ToolIcon
                      title="差分を見る（未実装）"
                      label="show diff"
                      Icon={DifferenceRoundedIcon}
                      onClick={notImpl("差分表示")}
                    />
                    <ToolIcon
                      title="要約 / 提案（未実装）"
                      label="summarize"
                      Icon={SummarizeRoundedIcon}
                      onClick={notImpl("要約/提案")}
                    />
                    <ToolIcon
                      title="マージ（未実装）"
                      label="merge"
                      Icon={MergeTypeRoundedIcon}
                      onClick={notImpl("マージ")}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      aria-label="send message"
                      variant="contained"
                      onClick={onSend}
                      disabled={!text.trim() && !file}
                      sx={{
                        minWidth: 44,
                        height: 36,
                        borderRadius: 999,
                        px: 1.5,
                        boxShadow: "none",
                      }}
                    >
                      {sending ? (
                        <CircularProgress size={20} />
                      ) : (
                        <SendRoundedIcon fontSize="small" />
                      )}
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  pr: 1, // 右端のボタンと密着しないように
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": {
                    borderColor: (t) => alpha(t.palette.text.primary, 0.28),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 1.5,
                  },
                  // 入力時の背景をほんのり
                  bgcolor: (t) => alpha(t.palette.background.default, 0.6),
                },
                "& .MuiInputBase-input": {
                  py: 1.25,
                },
              }}
            />

            {/* ファイル入力（hidden） */}
            <input ref={fileInputRef} type="file" hidden onChange={onPicked} />
          </Paper>
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
