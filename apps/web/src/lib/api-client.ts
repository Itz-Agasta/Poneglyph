import { env } from "@Poneglyph/env/web";
import { headers as getHeaders } from "next/headers";

const BASE_URL = env.NEXT_PUBLIC_SERVER_URL;
const CREDENTIALS: RequestCredentials = "include";

function buildUrl(path: string, query?: Record<string, string | string[]>): URL {
  const url = new URL(path, BASE_URL);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (Array.isArray(v)) v.forEach((vv) => url.searchParams.append(k, vv));
      else url.searchParams.set(k, v);
    }
  }
  return url;
}

export async function apiClientWithCookies() {
  const headerStore = await getHeaders();
  const cookieHeader = headerStore.get("cookie") ?? "";

  const headers: Record<string, string> = {};
  if (cookieHeader) headers["Cookie"] = cookieHeader;

  return {
    get(
      path: string,
      opts?: { query?: Record<string, string | string[]>; param?: Record<string, string> },
    ): Promise<Response> {
      const url = buildUrl(path, opts?.query);
      if (opts?.param) {
        for (const [k, v] of Object.entries(opts.param)) {
          url.pathname = url.pathname.replace(`:${k}`, v);
        }
      }
      return fetch(url.toString(), { credentials: CREDENTIALS, headers });
    },

    post(path: string, body: unknown): Promise<Response> {
      const url = new URL(path, BASE_URL);
      return fetch(url.toString(), {
        credentials: CREDENTIALS,
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body),
      });
    },
  };
}

export type ApiClientWithCookies = Awaited<ReturnType<typeof apiClientWithCookies>>;
