import { fetchWeatherApi } from "openmeteo";
import type { Forecast } from "~/types/forecast";
import { toISODateString } from "./utils";

export async function getForecast(
  latitude: number,
  longitude: number
): Promise<Forecast[]> {
  const params = {
    latitude,
    longitude,
    daily: ["precipitation_probability_max", "temperature_2m_max"],
    timezone: "America/New_York", // TODO get from client
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

  const forecast = dates.map((d, i) => ({
    date: d,
    precipProbability: precipProbabilities[i],
    temperatureMax: temperatureMaximums[i],
  }));

  return forecast;
}
