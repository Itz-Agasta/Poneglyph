import { Hono } from "hono";
import { chatRouter } from "./v1/chat";
import { uploadRouter } from "./v1/upload";
import { datasetsRouter } from "./v1/datasets";

const apiRouter = new Hono();

// Mount v1 routes
apiRouter.route("/datasets", datasetsRouter);
apiRouter.route("/chat", chatRouter);
apiRouter.route("/upload", uploadRouter);

export { apiRouter };
