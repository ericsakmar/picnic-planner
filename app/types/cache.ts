import z from "zod";

export const cacheableSchema = z.object({
  expires: z.number(),
  // value: ??
});

export type Cacheable = z.infer<typeof cacheableSchema>;
