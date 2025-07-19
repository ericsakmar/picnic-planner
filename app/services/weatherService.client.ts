import z from "zod";
import { forecastSchema, weatherHistorySchema } from "~/types/forecast";
import { withCache } from "./cacheService";
import localStorageService from "~/services/localStorageService.client";

async function getForecastBase(
  latitude: number,
  longitude: number,
  timezone: string
) {
  const res = await fetch(
    `/api/forecast?latitude=${latitude}&longitude=${longitude}&tz=${timezone}`
  );

  const json = await res.json();
  const data = z.array(forecastSchema).parse(json);
  return data;
}

async function getHistoryBase(
  latitude: number,
  longitude: number,
  timezone: string
) {
  const res = await fetch(
    `/api/history?latitude=${latitude}&longitude=${longitude}&tz=${timezone}`
  );

  const json = await res.json();
  const data = z.array(weatherHistorySchema).parse(json);
  return data;
}

export const getForecast = withCache(getForecastBase, {
  getKey: (args) => `forecast__${args.join("__")}`,
  ttlMinutes: 30, // weather forecasts are updated every hour
  schema: z.array(forecastSchema),
  storage: localStorageService,
});

export const getHistory = withCache(getHistoryBase, {
  getKey: (args) => `history__${args.join("__")}`,
  ttlMinutes: 12 * 60, // 12 hours, history doesn't change, but we might need to get a new range
  schema: z.array(weatherHistorySchema),
  storage: localStorageService,
});
