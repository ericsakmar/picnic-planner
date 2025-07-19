import z from "zod";
import { forecastSchema, weatherHistorySchema } from "~/types/forecast";
import { withCache } from "./cacheService";
import localStorageService from "~/services/localStorageService.client";

async function getForecastBase(latitude: number, longitude: number) {
  const res = await fetch(
    `/api/forecast?latitude=${latitude}&longitude=${longitude}`
  );

  const json = await res.json();
  const data = z.array(forecastSchema).parse(json);
  return data;
}

async function getHistoryBase(latitude: number, longitude: number) {
  const res = await fetch(
    `/api/history?latitude=${latitude}&longitude=${longitude}`
  );

  const json = await res.json();
  const data = z.array(weatherHistorySchema).parse(json);
  return data;
}

export const getForecast = withCache(getForecastBase, {
  keyPrefix: "forecast",
  ttlMinutes: 60, // weather forecasts are updated every hour
  schema: z.array(forecastSchema),
  storage: localStorageService,
});

export const getHistory = withCache(getHistoryBase, {
  keyPrefix: "history",
  ttlMinutes: 12 * 60, // 12 hours, history doesn't change, but we might need to get a new range
  schema: z.array(weatherHistorySchema),
  storage: localStorageService,
});
