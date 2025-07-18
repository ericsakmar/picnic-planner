import { getSettings } from "~/services/settingsService";
import type { Route } from "./+types/home";
import { getForecast } from "~/services/forecastService";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Picnic Planner" }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  var settings = getSettings();
  if (settings === null) {
    return redirect("/settings");
  }

  // fetch the forecast
  const forecast = await getForecast(settings.latitude, settings.longitude);
  console.log(forecast);

  // fetch the history if requested
  return { settings, forecast };
}

export default function Forecast() {
  return <h1>hello forecast</h1>;
}
