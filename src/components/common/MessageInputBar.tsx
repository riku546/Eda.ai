import ToolIcon from "@/components/common/ToolIcon";
import { sendKeyMapping } from "@/utils/keyMapping";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Stack,
  type SxProps,
  TextField,
  type Theme,
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
  sx?: SxProps<Theme>;
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
  sx,
}: MessageInputBarProps) {
  return (
    <Box sx={{ ...sx }}>
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <TextField
          aria-label="message input"
          placeholder="メッセージを入力…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => sendKeyMapping(e.nativeEvent, onSend)}
          disabled={sending}
          multiline
          minRows={1}
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
              height: "auto",
            },
            "& .MuiInputBase-input": {
              py: 0.625,
            },
          }}
        />
      </Box>
      <input ref={fileInputRef} type="file" hidden onChange={onPicked} />
    </Box>
  );
}
