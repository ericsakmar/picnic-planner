import z from "zod";

export const settingsSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export type Settings = z.infer<typeof settingsSchema>;
