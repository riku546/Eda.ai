import type { FrourioSpec } from "@frourio/next";
import { z } from "zod";
import { models } from "../(LLM)/gemini";

export const frourioSpec = {
  post: {
    body: z.object({
      message: z.string(),
      model: z.enum(models),
    }),
    res: {
      200: { body: z.object({ message: z.string() }) },
      //   500: { body: z.object({ message: z.string() }) },
    },
  },
} satisfies FrourioSpec;
