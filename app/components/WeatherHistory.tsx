import { format, parseISO } from "date-fns";
import { getAverage, getConditions, getMax, getMin } from "~/services/utils";
import type { Conditions, Forecast, WeatherHistory } from "~/types/forecast";
import type { Settings } from "~/types/settings";

interface Props {
  date: string;
  history: WeatherHistory[];
  forecast: Forecast;
  settings: Settings;
}

const formatTemperature = (t: number) => `${Math.round(t)}°`;
const formatHumidity = (t: number) => `${Math.round(t)}%`;
const formatWind = (t: number) => `${Math.round(t)} mph`;
const formatYear = (d: string) => format(d, "yyyy");

function getRecommendation(conditions: Conditions) {
  if (conditions === "ideal") {
    return "this would be an ideal day for a picnic!";
  }

  if (conditions === "fair") {
    return "this would be a fair day for a picnic!";
  }

  return "this would be a poor day for a picnic.";
}

export default function WeatherHistory({
  date: rawDate,
  history,
  forecast,
  settings,
}: Props) {
  const date = parseISO(rawDate);
  const dateDisplay = format(date, "MMMM do");
  const conditions = getConditions(forecast, settings);

  const tempAverage = getAverage(history, "temperatureMax");
  const tempMax = getMax(history, "temperatureMax");
  const tempMin = getMin(history, "temperatureMax");

  const humidityAverage = getAverage(history, "relativeHumidity");
  const humidityMax = getMax(history, "relativeHumidity");
  const humidityMin = getMin(history, "relativeHumidity");

  const windAverage = getAverage(history, "windSpeedMax");
  const windMax = getMax(history, "windSpeedMax");
  const windMin = getMin(history, "windSpeedMax");

  if (
    tempAverage === undefined ||
    tempMax === undefined ||
    tempMin === undefined ||
    humidityAverage === undefined ||
    humidityMax === undefined ||
    humidityMin === undefined ||
    windAverage === undefined ||
    windMax === undefined ||
    windMin === undefined
  ) {
    return null;
  }

  return (
    <>
      <h2 className="text-2xl">Weather Details for {dateDisplay}</h2>

      <p className="mt-4">
        With a high temperature of {formatTemperature(forecast.temperatureMax)}{" "}
        and a {formatHumidity(forecast.precipProbability)} chance of
        precipitation, {getRecommendation(conditions)}
      </p>

      <p className="mt-4">
        🌡️ The high temperature will be{" "}
        {formatTemperature(forecast.temperatureMax)}. This is{" "}
        {forecast.temperatureMax > tempAverage ? " above " : " below "}
        the average for the last ten years ({formatTemperature(tempAverage)}).
        The highest temperature was {formatTemperature(tempMax.temperatureMax)}{" "}
        in {formatYear(tempMax.date)} and the lowest was{" "}
        {formatTemperature(tempMin.temperatureMax)} in{" "}
        {formatYear(tempMin.date)}.
      </p>

      <p className="mt-4">
        ☁️ The relative humidity will be{" "}
        {formatHumidity(forecast.relativeHumidity)}. This is{" "}
        {forecast.relativeHumidity > humidityAverage ? " above " : " below "}
        the average for the last ten years ({formatHumidity(humidityAverage)}).
        The highest relative humidity was{" "}
        {formatHumidity(humidityMax.relativeHumidity)} in{" "}
        {formatYear(humidityMax.date)} and the lowest was{" "}
        {formatTemperature(humidityMin.relativeHumidity)} in{" "}
        {formatYear(humidityMin.date)}.
      </p>

      <p className="mt-4">
        🌬️ The maximum wind speed will be {formatWind(forecast.windSpeedMax)}.
        This is {forecast.windSpeedMax > windAverage ? " above " : " below "}
        the average for the last ten years ({formatWind(windAverage)}). The
        highest max wind speed was {formatWind(windMax.windSpeedMax)} in{" "}
        {formatYear(windMax.date)} and the lowest was{" "}
        {formatWind(windMin.windSpeedMax)} in {formatYear(windMin.date)}.
      </p>
    </>
  );
}
