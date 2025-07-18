import { format, getDay, parseISO } from "date-fns";
import { getConditions } from "~/services/utils";
import type { Conditions, Forecast } from "~/types/forecast";

interface Props {
  forecast: Forecast;
  selected: boolean;
  onClick: (date: string) => void;
}

const colors: Record<Conditions, string> = {
  ideal: "text-green-400",
  fair: "text-yellow-400",
  poor: "text-red-400",
};

export default function DailyForecast({ forecast, selected, onClick }: Props) {
  const date = parseISO(forecast.date);
  const month = format(date, "MMM");
  const day = format(date, "dd");
  const weekday = format(date, "EEE");
  const dayOfWeek = getDay(date);
  const conditions = getConditions(forecast);
  const color = colors[conditions];

  return (
    <div
      className={`text-center bg-gray-700 ${color} p-1 aria-selected:bg-gray-500`}
      aria-selected={selected}
      style={{ gridColumnStart: dayOfWeek + 1 }}
      onClick={() => onClick(forecast.date)}
    >
      <div className="text-sm">{weekday}</div>
      <div className="text-sm">{month}</div>
      <div className="text-2xl">{day}</div>
      <div className="text-sm">{conditions}</div>
    </div>
  );
}
