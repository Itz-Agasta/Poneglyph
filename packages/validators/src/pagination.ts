import { z } from "zod";

// Server-side pagination prevents massive memory payloads and browser freezes.
// Zod coerces URL strings to safe, capped integers to protect the DB from DDoS.
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export function PaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
  });
}

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
