import { TRPCError, initTRPC } from "@trpc/server";
import { getUserInfo } from "../../lib";

const t = initTRPC.create();

export const authMiddleware = t.middleware(async (opts) => {
  const user = await getUserInfo();
  if (!user)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "ログインしてください。",
    });

  return opts.next({
    ctx: {
      user,
    },
  });
});
