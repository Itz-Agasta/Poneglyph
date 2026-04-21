import { createDb } from "@Poneglyph/db";
import * as authSchema from "@Poneglyph/db/schema/auth";
import { user } from "@Poneglyph/db/schema/users";
import { env } from "@Poneglyph/env/server";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const schema = {
  ...authSchema,
  user,
};

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",

      schema: schema,
    }),
    trustedOrigins: env.CORS_ORIGINS.split(",").map((o) => o.trim()),
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [admin()],
  });
}

export const auth = createAuth();
