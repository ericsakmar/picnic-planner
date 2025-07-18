import z from "zod";

// Forecasted temperature, precipitation, humidity, and wind details
export const forecastSchema = z.object({
  date: z.string(),
  temperatureMax: z.number(),
  precipProbability: z.number(),
  relativeHumidity: z.number(),
  windSpeedMax: z.number(),
});

export type Forecast = z.infer<typeof forecastSchema>;
