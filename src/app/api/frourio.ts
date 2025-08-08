import type { FrourioSpec } from "@frourio/next";
import { z } from "zod";

export const frourioSpec = {
  get: {
    res: { 200: { body: z.object({ value: z.string() }) } },
  },
  post: {
    body: z.object({
      name: z.string(),
    }),
    res: {
      200: {
        body: z.object({
          message: z.string(),
        }),
      },
    },
  },
} satisfies FrourioSpec;
