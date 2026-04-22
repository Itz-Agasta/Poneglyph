import { z } from "zod";

export const VolunteerListQuerySchema = z.object({
  city: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined),
  tags: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((value) => {
      if (!value) return [];

      const raw = Array.isArray(value) ? value : [value];
      return [
        ...new Set(
          raw
            .flatMap((item) => item.split(","))
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean),
        ),
      ];
    }),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
