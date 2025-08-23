export const sendKeyMapping = (e: KeyboardEvent, handleSend: () => void) => {
  const isMac = navigator.userAgent.toLowerCase().includes("mac");
  const withCmd = isMac ? e.metaKey : e.ctrlKey;
  if (e.key === "Enter" && withCmd) {
    e.preventDefault();
    handleSend();
  }
};
