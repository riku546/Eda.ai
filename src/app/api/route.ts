import { createRoute } from "./frourio.server";

export const { GET, POST } = createRoute({
  get: async () => {
    return { status: 200, body: { value: "ok" } };
  },
  post: async ({ body: { name } }) => {
    return { status: 200, body: { message: name } };
  },
});
