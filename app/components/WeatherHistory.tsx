import { format, parseISO } from "date-fns";
import type { Forecast, WeatherHistory } from "~/types/forecast";

interface Props {
  date: string;
  history: WeatherHistory[];
  forecast: Forecast;
}

// TODO move to utils and write tests
const getAverage = (
  history: WeatherHistory[],
  key: "temperatureMax" | "relativeHumidity" | "windSpeedMax"
) => history.map((h) => h[key]).reduce((acc, t) => acc + t, 0) / history.length;

const getMax = (
  history: WeatherHistory[],
  key: "temperatureMax" | "relativeHumidity" | "windSpeedMax"
) => history.reduce((max, cur) => (cur[key] > max[key] ? cur : max));

const getMin = (
  history: WeatherHistory[],
  key: "temperatureMax" | "relativeHumidity" | "windSpeedMax"
) => history.reduce((max, cur) => (cur[key] < max[key] ? cur : max));

const formatTemperature = (t: number) => `${Math.round(t)}°`;
const formatHumidity = (t: number) => `${Math.round(t)}%`;
const formatWind = (t: number) => `${Math.round(t)} mph`;
const formatYear = (d: string) => format(d, "yyyy");

export default function WeatherHistory({
  date: rawDate,
  history,
  forecast,
}: Props) {
  const date = parseISO(rawDate);
  const dateDisplay = format(date, "MMMM do");

  const tempAverage = getAverage(history, "temperatureMax");
  const tempMax = getMax(history, "temperatureMax");
  const tempMin = getMin(history, "temperatureMax");

  const humidityAverage = getAverage(history, "relativeHumidity");
  const humidityMax = getMax(history, "relativeHumidity");
  const humidityMin = getMin(history, "relativeHumidity");

  const windAverage = getAverage(history, "windSpeedMax");
  const windMax = getMax(history, "windSpeedMax");
  const windMin = getMin(history, "windSpeedMax");

  return (
    <>
      <h2 className="text-2xl">Weather Details for {dateDisplay}</h2>

      <p className="mt-4">
        🌡️ The high temperature will be{" "}
        <span className="font-bold">
          {formatTemperature(forecast.temperatureMax)}
        </span>
        . This is{" "}
        {forecast.temperatureMax > tempAverage ? " above " : " below "}
        the average for the last ten years ({formatTemperature(tempAverage)}).
        The highest temperature was {formatTemperature(tempMax.temperatureMax)}{" "}
        in {formatYear(tempMax.date)} and the lowest was{" "}
        {formatTemperature(tempMin.temperatureMax)} in{" "}
        {formatYear(tempMin.date)}.
      </p>

      <p className="mt-4">
        ☁️ The relative humidity will be{" "}
        <span className="font-bold">
          {formatHumidity(forecast.relativeHumidity)}
        </span>
        . This is{" "}
        {forecast.relativeHumidity > humidityAverage ? " above " : " below "}
        the average for the last ten years ({formatHumidity(humidityAverage)}).
        The highest relative humidity was{" "}
        {formatHumidity(humidityMax.relativeHumidity)} in{" "}
        {formatYear(humidityMax.date)} and the lowest was{" "}
        {formatTemperature(humidityMin.relativeHumidity)} in{" "}
        {formatYear(humidityMin.date)}.
      </p>

      <p className="mt-4">
        🌬️ The maximum wind speed will be{" "}
        <span className="font-bold">{formatWind(forecast.windSpeedMax)}</span>.
        This is {forecast.windSpeedMax > windAverage ? " above " : " below "}
        the average for the last ten years ({formatWind(windAverage)}). The
        highest max wind speed was {formatWind(windMax.windSpeedMax)} in{" "}
        {formatYear(windMax.date)} and the lowest was{" "}
        {formatWind(windMin.windSpeedMax)} in {formatYear(windMin.date)}.
      </p>
    </>
  );
}
