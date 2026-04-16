import { hc } from "hono/client";
import type { AppType } from "../../../server/src/index";
import { env } from "@Poneglyph/env/web";

export type Client = ReturnType<typeof hc<AppType>>;

export const apiClient = hc<AppType>(env.NEXT_PUBLIC_SERVER_URL);
