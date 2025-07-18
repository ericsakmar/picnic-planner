import { getSettings } from "~/services/settingsService";
import type { Route } from "./+types/home";
import { getForecast as getForecastBase } from "~/services/forecastService";
import { redirect } from "react-router";
import { withCache } from "~/services/cacheService";
import { forecastSchema } from "~/types/forecast";
import z from "zod";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Picnic Planner" }];
}

const getForecast = withCache(
  "forecast",
  15,
  z.array(forecastSchema),
  getForecastBase
);

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  var settings = getSettings();
  if (settings === null) {
    return redirect("/settings");
  }

  const forecast = await getForecast(settings.latitude, settings.longitude);
  console.log(forecast);

  return { settings, forecast };
}

export default function Forecast() {
  return <h1>hello forecast</h1>;
}
