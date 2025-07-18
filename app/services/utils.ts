// TODO test these?

import { getDate, getMonth, type DateArg } from "date-fns";
import { formatISOWithOptions } from "date-fns/fp";
import type { Conditions, Forecast, WeatherHistory } from "~/types/forecast";

export function formDataToObject(formData: FormData): unknown {
  const entries = [...formData.entries()];

  return entries.reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: value,
    };
  }, {});
}

export const toISODateString = formatISOWithOptions({ representation: "date" });

// checks if only the month and day match for two dates
export function isSameMonthAndDay(d1: DateArg<Date>, d2: DateArg<Date>) {
  return getMonth(d1) === getMonth(d2) && getDate(d1) === getDate(d2);
}

export const getAverage = (
  history: WeatherHistory[],
  key: "temperatureMax" | "relativeHumidity" | "windSpeedMax"
) => history.map((h) => h[key]).reduce((acc, t) => acc + t, 0) / history.length;

export const getMax = (
  history: WeatherHistory[],
  key: "temperatureMax" | "relativeHumidity" | "windSpeedMax"
) => history.reduce((max, cur) => (cur[key] > max[key] ? cur : max));

export const getMin = (
  history: WeatherHistory[],
  key: "temperatureMax" | "relativeHumidity" | "windSpeedMax"
) => history.reduce((max, cur) => (cur[key] < max[key] ? cur : max));

const idealTempMin = 70;
const idealTempMax = 80;

const fairTempMin = 65;
const fairTempMax = 85;

const idealPrecipMax = 30;
const fairPrecipMax = 50;

export function getConditions(forecast: Forecast): Conditions {
  if (
    forecast.temperatureMax <= idealTempMax &&
    forecast.temperatureMax >= idealTempMin &&
    forecast.precipProbability <= idealPrecipMax
  ) {
    return "ideal";
  }

  if (
    forecast.temperatureMax <= fairTempMax &&
    forecast.temperatureMax >= fairTempMin &&
    forecast.precipProbability <= fairPrecipMax
  ) {
    return "fair";
  }

  return "poor";
}
