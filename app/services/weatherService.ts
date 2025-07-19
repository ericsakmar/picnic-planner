import { fetchWeatherApi } from "openmeteo";
import type { Forecast, WeatherHistory } from "~/types/forecast";
import { isSameMonthAndDay, toISODateString } from "./utils";
import { addWeeks, addYears, eachDayOfInterval } from "date-fns";

export async function getForecast(
  latitude: number,
  longitude: number,
  timezone: string
): Promise<Forecast[]> {
  const params = {
    latitude,
    longitude,
    daily: [
      "precipitation_probability_max",
      "temperature_2m_max",
      "relative_humidity_2m_mean",
      "wind_speed_10m_max",
    ],
    timezone,
    forecast_days: 14,
    wind_speed_unit: "mph",
    temperature_unit: "fahrenheit",
    precipitation_unit: "inch",
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];
  const daily = response.daily()!;

  const dates = [
    ...Array(
      (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval()
    ),
  ]
    .map(
      (_, i) => new Date((Number(daily.time()) + i * daily.interval()) * 1000)
    )
    .map(toISODateString);

  const precipProbabilities = daily.variables(0)!.valuesArray()!;
  const temperatureMaximums = daily.variables(1)!.valuesArray()!;
  const relativeHumidities = daily.variables(2)!.valuesArray()!;
  const windSpeedMaximums = daily.variables(3)!.valuesArray()!;

  const forecast = dates.map((d, i) => ({
    date: d,
    precipProbability: Math.round(precipProbabilities[i]),
    temperatureMax: Math.round(temperatureMaximums[i]),
    relativeHumidity: Math.round(relativeHumidities[i]),
    windSpeedMax: Math.round(windSpeedMaximums[i]),
  }));

  return forecast;
}

// this gets the whole forecast which will be kind of big, about 4000 records,
// but each record will be small and we will then filter it down to only the dates we care about
export async function getHistory(
  latitude: number,
  longitude: number,
  timezone: string
): Promise<WeatherHistory[]> {
  // these represent the dates in the ui
  const forecastStart = new Date(); // July 18, 2025
  const forecastEnd = addWeeks(forecastStart, 2); // Aug 1, 2025
  const forecastRange = eachDayOfInterval({
    start: forecastStart,
    end: forecastEnd,
  }).map(toISODateString);

  const historyStartDate = addYears(forecastStart, -10); // July 18, 2015
  const historyEndDate = addYears(forecastEnd, -1); // Aug 1, 2024

  const params = {
    latitude,
    longitude,
    start_date: toISODateString(historyStartDate),
    end_date: toISODateString(historyEndDate),
    daily: [
      "temperature_2m_max",
      "wind_speed_10m_max",
      "relative_humidity_2m_mean",
    ],
    timezone,
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    precipitation_unit: "inch",
  };

  const url = "https://archive-api.open-meteo.com/v1/archive";
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];
  const daily = response.daily()!;

  const dates = [
    ...Array(
      (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval()
    ),
  ]
    .map(
      (_, i) => new Date((Number(daily.time()) + i * daily.interval()) * 1000)
    )
    .map(toISODateString);

  const temperatureMaximums = daily.variables(0)!.valuesArray()!;
  const windSpeedMaximums = daily.variables(1)!.valuesArray()!;
  const relativeHumidityMeans = daily.variables(2)!.valuesArray()!;

  const history = dates
    .map((d, i) => ({
      date: d,
      temperatureMax: temperatureMaximums[i],
      windSpeedMax: windSpeedMaximums[i],
      relativeHumidity: relativeHumidityMeans[i],
    }))
    .filter(({ date: d1 }) =>
      forecastRange.some((d2) => isSameMonthAndDay(d1, d2))
    )
    .map((d) => ({
      ...d,
      temperatureMax: Math.round(d.temperatureMax),
      windSpeedMax: Math.round(d.windSpeedMax),
      relativeHumidity: Math.round(d.relativeHumidity),
    }));

  return history;
}
