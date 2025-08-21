"use client";

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

/** ─────────────────────────────────────────
 * 小さな表示専用コンポーネント（読みやすさのため分割）
 * ───────────────────────────────────────── */
const Title = memo(function Title() {
  return (
    <Stack spacing={0.75} alignItems="center" textAlign="center">
      <Typography variant="h4" fontWeight={800} letterSpacing={0.2}>
        EDA.ai
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Branch, Compare, Merge. — まずはメッセージを入力。
      </Typography>
    </Stack>
  );
});

const ToolbarIcon = memo(function ToolbarIcon({
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
      <span>
        <IconButton
          aria-label={label}
          size="small"
          onClick={onClick}
          sx={{
            bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
            "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.12) },
            borderRadius: 2,
            p: 1,
          }}
        >
          <Icon fontSize="small" />
        </IconButton>
      </span>
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

  // 入力・送信系
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
    const payloadText = text.trim();
    if (!payloadText && !file) {
      setToast("テキストまたはファイルを入力してください");
      return;
    }
    try {
      setSending(true);
      // TODO: 本番は /api/messages へ fetch
      await new Promise((r) => setTimeout(r, 450));
      setText("");
      setFile(null);
      setToast("送信しました（ダミー）");
    } finally {
      setSending(false);
    }
  };

  // 添付系
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
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 6,
        bgcolor: (t) => t.palette.background.default,
      }}
    >
      <Stack spacing={3} sx={{ width: "100%", maxWidth: 760 }}>
        <Title />

        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {/* ツールバー：最小限＆フラット */}
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mb: 1 }}
          >
            <ToolbarIcon
              title="ファイルを添付"
              label="attach file"
              Icon={AttachFileIcon}
              onClick={openPicker}
            />
            <ToolbarIcon
              title="ブランチ作成（未実装）"
              label="create branch"
              Icon={CallSplitRoundedIcon}
              onClick={notImpl("ブランチ作成")}
            />
            <ToolbarIcon
              title="差分を見る（未実装）"
              label="show diff"
              Icon={DifferenceRoundedIcon}
              onClick={notImpl("差分表示")}
            />
            <ToolbarIcon
              title="要約 / 提案（未実装）"
              label="summarize"
              Icon={SummarizeRoundedIcon}
              onClick={notImpl("要約/提案")}
            />
            <ToolbarIcon
              title="マージ（未実装）"
              label="merge"
              Icon={MergeTypeRoundedIcon}
              onClick={notImpl("マージ")}
            />
          </Stack>

          {/* 添付表示（あれば） */}
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

          {/* 入力＋送信：視線の終点を右端ボタンに */}
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              aria-label="message input"
              placeholder="メッセージを入力…（Enter送信 / Shift+Enter改行 / Ctrl or Cmd+Enter送信）"
              value={text}
              onChange={onChange}
              onKeyDown={onKey}
              disabled={sending}
              multiline
              minRows={3}
              maxRows={12}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            <Button
              aria-label="send message"
              variant="contained"
              onClick={onSend}
              disabled={!text.trim() && !file}
              sx={{
                alignSelf: "stretch",
                minWidth: 64,
                borderRadius: 3,
                px: 2,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {sending ? <CircularProgress size={22} /> : <SendRoundedIcon />}
            </Button>
          </Stack>

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
  );
}
