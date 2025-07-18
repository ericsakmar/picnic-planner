import { getSettings } from "~/services/settingsService";
import type { Route } from "./+types/home";
import {
  getForecast as getForecastBase,
  getHistory as getHistoryBase,
} from "~/services/forecastService";
import { redirect } from "react-router";
import { withCache } from "~/services/cacheService";
import { forecastSchema } from "~/types/forecast";
import z from "zod";
import { toISODateString } from "~/services/utils";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Picnic Planner" }];
}

const getForecast = withCache(
  "forecast",
  60, // weather forecasts are updated every hour
  z.array(forecastSchema),
  getForecastBase
);

const getHistory = withCache(
  "history",
  60, // but probably longer?
  z.object(),
  getHistoryBase
);

const dateSchema = z.iso.date();

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  var settings = getSettings();
  if (settings === null) {
    return redirect("/settings");
  }

  // i'd use zodix for this, but they haven't updated to zod 4 yet
  const url = new URL(request.url);
  const queryParams = url.searchParams;
  const historyParam = queryParams.get("history");
  const historyDateParseRes = dateSchema.safeParse(historyParam);
  if (!historyDateParseRes.success) {
    // if we don't have a valid date, default to today
    const date = toISODateString(new Date());
    return redirect(`/forecast?history=${date}`);
  }

  const forecast = await getForecast(settings.latitude, settings.longitude);
  console.log(forecast);

  return { settings, forecast };
}

export default function Forecast() {
  return <h1>hello forecast</h1>;
}
