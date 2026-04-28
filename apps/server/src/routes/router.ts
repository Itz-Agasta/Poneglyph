import { Hono } from "hono";
import { chatRouter } from "./v1/chat";
import { uploadRouter } from "./v1/upload";
import { datasetsRouter } from "./v1/datasets";
import { discoverRouter } from "./v1/discover";
import { volunteerRouter } from "./v1/volunteer";
import { messagesRouter } from "./v1/messages";

const apiRouter = new Hono();

// Mount v1 routes
apiRouter.route("/datasets", datasetsRouter);
apiRouter.route("/chat", chatRouter);
apiRouter.route("/upload", uploadRouter);
apiRouter.route("/discover", discoverRouter);
apiRouter.route("/volunteer", volunteerRouter);
apiRouter.route("/messages", messagesRouter);

export { apiRouter };
