import ToolIcon from "@/components/common/ToolIcon";
import { sendKeyMapping } from "@/utils/keyMapping";
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
import type { ChangeEvent, RefObject } from "react";

interface MessageInputBarProps {
  text: string;
  setText: (text: string) => void;
  sending: boolean;
  files: File[] | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onSend: () => void;
  openPicker: () => void;
  onPicked: (e: ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
}

export default function MessageInputBar({
  text,
  setText,
  sending,
  files,
  fileInputRef,
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
        backdropFilter: "blur(8px)",
        boxShadow: (t) => `0 10px 30px ${alpha(t.palette.common.black, 0.08)}`,
      }}
    >
      {files && files.length > 0 && (
        <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
          <Chip
            label={files[0].name || ""}
            size="small"
            onDelete={clearFile}
            deleteIcon={<CloseIcon />}
            sx={{ maxWidth: "100%" }}
          />
        </Stack>
      )}

      <TextField
        aria-label="message input"
        placeholder="メッセージを入力…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => sendKeyMapping(e.nativeEvent, onSend)}
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
                disabled={!text.trim() && !files}
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
