import type { ApiRoutes } from "@/app/api/trpc/[trpc]/index";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

export const apiClient = createTRPCClient<ApiRoutes>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
    }),
  ],
});
