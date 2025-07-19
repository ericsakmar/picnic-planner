import { getDate, getMonth, type DateArg } from "date-fns";
import { formatISOWithOptions } from "date-fns/fp";
import type z from "zod";
import type { Conditions, Forecast, WeatherHistory } from "~/types/forecast";
import type { Settings } from "~/types/settings";

// TODO can this use objectfromentries?
export function formDataToObject(formData: FormData): unknown {
  const entries = [...formData.entries()];

  return entries.reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: value,
    };
  }, {});
}

// i'd use zodix for this, but they haven't updated to zod 4 yet
export function parseQueryParams<T>(request: Request, schema: z.ZodSchema<T>) {
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams);
  const parseRes = schema.safeParse(queryParams);
  return parseRes;
}

export const toISODateString = formatISOWithOptions({ representation: "date" });

// checks if only the month and day match for two dates
export function isSameMonthAndDay(d1: DateArg<Date>, d2: DateArg<Date>) {
  return getMonth(d1) === getMonth(d2) && getDate(d1) === getDate(d2);
}

export const getAverage = (
  history: WeatherHistory[],
  key: "temperatureMax" | "relativeHumidity" | "windSpeedMax"
) =>
  history.length === 0
    ? undefined
    : history.map((h) => h[key]).reduce((acc, t) => acc + t, 0) /
      history.length;

export const getMax = (
  history: WeatherHistory[],
  key: "temperatureMax" | "relativeHumidity" | "windSpeedMax"
) =>
  history.length === 0
    ? undefined
    : history.reduce((max, cur) => (cur[key] > max[key] ? cur : max));

export const getMin = (
  history: WeatherHistory[],
  key: "temperatureMax" | "relativeHumidity" | "windSpeedMax"
) =>
  history.length === 0
    ? undefined
    : history.reduce((max, cur) => (cur[key] < max[key] ? cur : max));

// THESE SHOULD BE ROUNDED. DO THAT HERE OR ON SERVER?
export function getConditions(
  forecast: Forecast,
  settings: Settings
): Conditions {
  if (
    forecast.temperatureMax <= settings.idealTempMax &&
    forecast.temperatureMax >= settings.idealTempMin &&
    forecast.precipProbability <= settings.idealPrecipMax
  ) {
    return "ideal";
  }

  if (
    forecast.temperatureMax <= settings.fairTempMax &&
    forecast.temperatureMax >= settings.fairTempMin &&
    forecast.precipProbability <= settings.fairPrecipMax
  ) {
    return "fair";
  }

  return "poor";
}
