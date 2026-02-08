import { Hono } from "hono";
import { getAuth } from "../../lib/auth";

export const authRoutes = new Hono();

// Better Auth handler - return directly to preserve CORS headers
authRoutes.on(["POST", "GET"], "/*", async (c) => {
  try {
    const auth = getAuth();
    return auth.handler(c.req.raw);
  } catch (error) {
    console.error("Auth handler error:", error);
    return c.json({ error: "Authentication service error" }, 500);
  }
});
