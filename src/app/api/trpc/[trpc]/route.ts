import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { apiRoutes } from "./routers/_index";
function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: apiRoutes,
    createContext: () => ({}),
  });
}
export { handler as GET, handler as POST };
