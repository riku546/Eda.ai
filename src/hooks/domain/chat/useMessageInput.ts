import { useMessageInputBase } from "@/hooks/common/useMessageInputBase";
import { apiClient } from "@/lib/trpc";

export function useMessageInput(
  _unused: string,
  branchId: string,
  latestMessageId: string | null,
) {
  const { onSend, ...rest } = useMessageInputBase(
    async (promptText, promptFile) => {
      if (latestMessageId === null) {
        rest.setToast("メッセージを送信できませんでした");
        return;
      }
      await apiClient.chat.branch.sendMessage.mutate({
        promptText,
        promptFile,
        branchId: branchId as string,
        latestMessageId,
      });
      await new Promise((r) => setTimeout(r, 450));
    },
  );

  return {
    onSend,
    ...rest,
  };
}
