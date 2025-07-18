import z from "zod";

export const forecastSchema = z.object({
  date: z.string(),
  precipProbability: z.coerce.number(),
  temperatureMax: z.coerce.number(),
});

export type Forecast = z.infer<typeof forecastSchema>;
