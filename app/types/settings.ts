import z from "zod";

export const settingsSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export type Settings = z.infer<typeof settingsSchema>;
