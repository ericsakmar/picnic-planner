import { getSettings } from "~/services/settingsService.client";
import type { Route } from "./+types/forecast";
import { getForecast, getHistory } from "~/services/weatherService.client";
import { Link, redirect } from "react-router";
import z from "zod";
import {
  isSameMonthAndDay,
  parseQueryParams,
  toISODateString,
} from "~/services/utils";
import DailyForecast from "~/components/DailyForecast";
import WeatherHistory from "~/components/WeatherHistory";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // check for settings and redirect if we don't have them yet
  var settings = getSettings();
  if (settings === null) {
    return redirect("/settings");
  }

  // check for a selected date and select the first date if we don't have one
  const queryParamsRes = parseQueryParams(
    request,
    z.object({ date: z.iso.date() })
  );
  if (!queryParamsRes.success) {
    const date = toISODateString(new Date());
    return redirect(`/forecast?date=${date}`);
  }

  const date = queryParamsRes.data.date;
  const forecast = await getForecast(settings.latitude, settings.longitude);
  const history = await getHistory(settings.latitude, settings.longitude);
  const historyForDay = history.filter((h) => isSameMonthAndDay(date, h.date));

  return { settings, forecast, historyForDay, date };
}

export default function Forecast({ loaderData }: Route.ComponentProps) {
  const { forecast, date, historyForDay, settings } = loaderData;
  const selectedForecast = forecast.find((f) => f.date === date)!;

  return (
    <>
      <div className="grid grid-cols-7 gap-2 mt-8">
        {forecast.map((f) => (
          <DailyForecast
            key={f.date}
            forecast={f}
            selected={f.date === date}
            settings={settings}
          />
        ))}
      </div>

      <div className="mt-8">
        <WeatherHistory
          date={date}
          history={historyForDay}
          forecast={selectedForecast}
          settings={settings}
        />
      </div>

      <Link to="/settings" className="block mt-8 underline text-blue-500">
        Settings
      </Link>
    </>
  );
}
