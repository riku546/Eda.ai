import { initTRPC } from "@trpc/server";
import { projectRouter } from "../../project";

const t = initTRPC.create();

export const router = t.router;
export const procedure = t.procedure;

export const apiRoutes = router({ project: projectRouter });

export type ApiRoutes = typeof apiRoutes;
