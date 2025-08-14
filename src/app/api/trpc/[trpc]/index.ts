import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { generateContent } from "../../(LLM)/gemini";

const t = initTRPC.create();

export const router = t.router;
export const procedure = t.procedure;

export const apiRoutes = router({
  gemini: procedure
    .input(
      z.object({
        messageContent: z.object({
          text: z.string(),
          file: z
            .object({
              /** Optional. Display name of the blob. Used to provide a label or filename to distinguish blobs. This field is not currently used in the Gemini GenerateContent calls. */
              displayName: z.string().optional(),
              /*Encoded as base64 string. */
              data: z.string().optional(),
              /** Required. The IANA standard MIME type of the source data. */
              mimeType: z.string().optional(),
            })
            .optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await generateContent(
        [],
        input.messageContent,
        "gemini-2.0-flash-lite",
      );
      return res;
    }),
});

export type ApiRoutes = typeof apiRoutes;
