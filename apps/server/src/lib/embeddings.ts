import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { redis } from "./redis";
import { createHash } from "node:crypto";

const EMBEDDING_MODEL = google.textEmbeddingModel("gemini-embedding-exp-03-07");
const CACHE_TTL = 60 * 60 * 24; // 24 hours

function hashQuery(query: string): string {
  return createHash("sha256").update(query.trim().toLowerCase()).digest("hex");
}

/**
 * Embeds a query using Google's model. Results are cached in Redis for 24h
 * since the same user queries (or repeated ones) are common in chat UX.
 * Cache miss → call API → cache result. Simple and effective.
 */
export async function embedQuery(query: string): Promise<number[]> {
  const cacheKey = `emb:${hashQuery(query)}`;

  // Check Redis cache first
  const cached = await redis.get<number[]>(cacheKey);
  if (cached) return cached;

  const { embedding } = await embed({
    model: EMBEDDING_MODEL,
    value: query,
  });

  // Cache for 24h (fire-and-forget)
  redis.set(cacheKey, embedding, { ex: CACHE_TTL }).catch(() => {});

  return embedding;
}
