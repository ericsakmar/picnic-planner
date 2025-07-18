import { getSettings } from "~/services/settingsService";
import type { Route } from "./+types/forecast";
import {
  getForecast as getForecastBase,
  getHistory as getHistoryBase,
} from "~/services/forecastService";
import { redirect, useNavigate } from "react-router";
import { withCache } from "~/services/cacheService";
import { forecastSchema, weatherHistorySchema } from "~/types/forecast";
import z from "zod";
import { isSameMonthAndDay, toISODateString } from "~/services/utils";
import DailyForecast from "~/components/DailyForecast";
import WeatherHistory from "~/components/WeatherHistory";

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
  12 * 60, // 12 hours, history doesn't change, but we might need to get a new range
  z.array(weatherHistorySchema),
  getHistoryBase
);

const dateSchema = z.iso.date();

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  var settings = getSettings();
  if (settings === null) {
    return redirect("/settings");
  }

  // gets the date for history
  // i'd use zodix for this, but they haven't updated to zod 4 yet
  const url = new URL(request.url);
  const queryParams = url.searchParams;
  const dateRaw = queryParams.get("date");
  const dateParseRes = dateSchema.safeParse(dateRaw);
  if (!dateParseRes.success) {
    // if we don't have a valid date, default to today
    const date = toISODateString(new Date());
    return redirect(`/forecast?date=${date}`);
  }

  const date = dateParseRes.data;
  const forecast = await getForecast(settings.latitude, settings.longitude);
  const history = await getHistory(settings.latitude, settings.longitude);
  const historyForDay = history.filter((h) => isSameMonthAndDay(date, h.date));

  return { settings, forecast, historyForDay, date };
}

export default function Forecast({ loaderData }: Route.ComponentProps) {
  const { forecast, date, historyForDay } = loaderData;
  const navigate = useNavigate();

  const handleClick = (date: string) => {
    navigate(`/forecast?date=${date}`);
  };

  const selectedForecast = forecast.find((f) => f.date === date)!;

  return (
    <div className="m-4">
      <h1 className="text-6xl text-center">Picnic Planner</h1>

      <div className="grid grid-cols-7 gap-2 mt-8">
        {forecast.map((f) => (
          <DailyForecast
            key={f.date}
            forecast={f}
            selected={f.date === date}
            onClick={handleClick}
          />
        ))}
      </div>

      <div className="mt-8">
        <WeatherHistory
          date={date}
          history={historyForDay}
          forecast={selectedForecast}
        />
      </div>
    </div>
  );
}
