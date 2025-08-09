import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { sendMessageInChat } from "../../(LLM)/gemini";

const t = initTRPC.create();

export const router = t.router;
export const procedure = t.procedure;

export const apiRoutes = router({
  gemini: procedure
    .input(
      z.object({
        message: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await sendMessageInChat(
        [],
        input.message,
        "gemini-2.0-flash-lite",
      );
      return res;
    }),
});

export type ApiRoutes = typeof apiRoutes;
