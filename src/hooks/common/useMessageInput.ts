import { useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

export function useMessageInput() {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const openPicker = () => fileInputRef.current?.click();

  const onPicked = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setToast(`添付: ${f.name}`);
  };

  const clearFile = () => setFile(null);

  return {
    text,
    sending,
    file,
    toast,
    fileInputRef,
    onChange,
    onKey,
    onSend,
    openPicker,
    onPicked,
    clearFile,
    setToast,
  };
}
