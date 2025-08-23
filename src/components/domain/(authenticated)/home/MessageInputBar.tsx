import ToolIcon from "@/components/common/ToolIcon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  alpha,
} from "@mui/material";
import type { ChangeEvent, KeyboardEvent, RefObject } from "react";

interface MessageInputBarProps {
  text: string;
  sending: boolean;
  file: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKey: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
  openPicker: () => void;
  onPicked: (e: ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
}

export default function MessageInputBar({
  text,
  sending,
  file,
  fileInputRef,
  onChange,
  onKey,
  onSend,
  openPicker,
  onPicked,
  clearFile,
}: MessageInputBarProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.25, sm: 1.5 },
        borderRadius: 6,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: (t) => alpha(t.palette.background.paper, 0.7),
        backdropFilter: "blur(8px)", // うっすらガラス感
        boxShadow: (t) => `0 10px 30px ${alpha(t.palette.common.black, 0.08)}`,
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

      <input ref={fileInputRef} type="file" hidden onChange={onPicked} />
    </Paper>
  );
}
