import { createMiddleware } from "hono/factory";

export const logger = createMiddleware(async (c, next) => {
  await next();
});
