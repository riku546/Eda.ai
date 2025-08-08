import type { FrourioSpec } from "@frourio/next";
import { z } from "zod";

export const frourioSpec = {
  post: {
    body: z.object({
      message: z.string(),
    }),
    res: {
      200: { body: z.object({ message: z.string() }) },
    //   500: { body: z.object({ message: z.string() }) },
    },
  },
} satisfies FrourioSpec;
