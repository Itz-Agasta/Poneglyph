import { auth } from "@Poneglyph/auth";
import { env } from "@Poneglyph/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import upload from "./routes/upload";
import chat from "./routes/chat";
import { datasetsRoute } from "./routes/datasets";
import { discoverRoutes } from "./routes/discover";

// Parse the comma-separated CORS_ORIGINS string into an array.
// e.g. "http://localhost:3001,http://localhost:3000" → ["http://localhost:3001", "http://localhost:3000"]
const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim());

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: allowedOrigins,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
app.route("/api/upload", upload);
app.route("/api/chat", chat);

app.get("/", (c) => {
  c.header("Content-Type", "text/plain");
  return c.text("OK from Agasta");
});

app.get("/health", (c) =>
  c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  }),
);

const routes = app
  .route("/api/v1/datasets", datasetsRoute)
  .route("/api/v1/discover", discoverRoutes);

export type AppType = typeof routes;

export default app;
