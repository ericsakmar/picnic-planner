import z from "zod";

// Forecasted temperature, precipitation, humidity, and wind details
export const forecastSchema = z.object({
  date: z.iso.date(),
  temperatureMax: z.number(),
  precipProbability: z.number(),
  relativeHumidity: z.number(),
  windSpeedMax: z.number(),
});

// Historical weather statistics for that date from the past 10 years (average temperatures, precipitation patterns, etc.
export const weatherHistorySchema = forecastSchema.omit({
  // we don't have precip in the history
  // https://github.com/open-meteo/open-meteo/issues/1319
  precipProbability: true,
});

export type Forecast = z.infer<typeof forecastSchema>;
export type WeatherHistory = z.infer<typeof weatherHistorySchema>;
