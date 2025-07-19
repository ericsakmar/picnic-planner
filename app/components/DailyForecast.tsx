import { format, getDay, parseISO } from "date-fns";
import { Link } from "react-router";
import { getConditions } from "~/services/utils";
import type { Conditions, Forecast } from "~/types/forecast";
import type { Settings } from "~/types/settings";

interface Props {
  forecast: Forecast;
  selected: boolean;
  settings: Settings;
}

const colors: Record<Conditions, string> = {
  ideal: "text-green-400",
  fair: "text-yellow-400",
  poor: "text-red-400",
};

export default function DailyForecast({ forecast, selected, settings }: Props) {
  const date = parseISO(forecast.date);
  const month = format(date, "MMM");
  const day = format(date, "dd");
  const weekday = format(date, "EEE");
  const dayOfWeek = getDay(date);
  const conditions = getConditions(forecast, settings);
  const color = colors[conditions];

  return (
    <Link
      to={`/forecast?date=${forecast.date}`}
      className={`text-center bg-gray-800 ${color} p-1 aria-selected:bg-gray-600`}
      aria-selected={selected}
      style={{ gridColumnStart: dayOfWeek + 1 }}
    >
      <div className="text-sm">{weekday}</div>
      <div className="text-sm">{month}</div>
      <div className="text-2xl">{day}</div>
      <div className="text-sm">{conditions}</div>
    </Link>
  );
}
