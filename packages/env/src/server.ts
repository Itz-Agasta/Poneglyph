import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    // Comma-separated list of allowed origins, e.g.:
    // CORS_ORIGINS=http://localhost:3001,http://localhost:3000
    CORS_ORIGINS: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    // Cloudflare R2 (S3-compatible)
    S3_ACCESS_KEY: z.string().min(1),
    S3_SECRET_KEY: z.string().min(1),
    S3_BUCKET_NAME: z.string().min(1),
    S3_ENDPOINT: z.string().url(),
    S3_REGION: z.string().default("auto"),
    // RabbitMQ
    RABBITMQ_URL: z.string().min(1),
    RABBITMQ_QUEUE: z.string().min(1),
    // AI Providers
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
    GROQ_API_KEY: z.string().min(1),
    // Web Search
    TAVILY_API_KEY: z.string().min(1),
    // Redis Cache (Upstash)
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
