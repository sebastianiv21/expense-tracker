import { Hono } from "hono";
import { pinoLogger } from "hono-pino";
import { requestId } from "hono/request-id";

const app = new Hono();

app.use(requestId());
app.use(
  pinoLogger({
    pino: {
      level: "info",
    },
  }),
);

app.get("/", (c) => {
  const { logger } = c.var;
  logger.info("Request received");
  return c.text("Hello Cloudflare Workers!");
});

export default app;
