import { initTRPC } from "@trpc/server";
import { chatRouter } from "../../chat";
import { projectRouter } from "../../project";

const t = initTRPC.create();

export const router = t.router;
export const procedure = t.procedure;

export const apiRoutes = router({ project: projectRouter, chat: chatRouter });

export type ApiRoutes = typeof apiRoutes;
