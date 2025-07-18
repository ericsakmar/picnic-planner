import { getSettings } from "~/services/settingsService";
import type { Route } from "./+types/home";
import { getForecast } from "~/services/forecastService";
import { redirect } from "react-router";
import { getItemFromCache, setItemInCache } from "~/services/cacheService";
import { forecastSchema } from "~/types/forecast";
import z from "zod";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Picnic Planner" }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  var settings = getSettings();
  if (settings === null) {
    return redirect("/settings");
  }

  const cacheKey = `forecast-${settings.latitude}-${settings.longitude}`;

  const cached = getItemFromCache(cacheKey, z.array(forecastSchema));
  if (cached !== null) {
    return { settings, forecast: cached };
  }

  const forecast = await getForecast(settings.latitude, settings.longitude);

  setItemInCache(cacheKey, 15, forecast);

  return { settings, forecast };
}

export default function Forecast() {
  return <h1>hello forecast</h1>;
}
