import { format, getDay, parseISO } from "date-fns";
import type { Forecast } from "~/types/forecast";

interface Props {
  forecast: Forecast;
  selected: boolean;
  onClick: (date: string) => void;
}

export default function DailyForecast({ forecast, selected, onClick }: Props) {
  const date = parseISO(forecast.date);
  const month = format(date, "MMM");
  const day = format(date, "dd");
  const weekday = format(date, "EEE");
  const dayOfWeek = getDay(date);

  return (
    <div
      className="text-center bg-gray-700 p-1 aria-selected:bg-gray-500"
      aria-selected={selected}
      style={{ gridColumnStart: dayOfWeek + 1 }}
      onClick={() => onClick(forecast.date)}
    >
      <div className="text-sm">{weekday}</div>
      <div className="text-sm">{month}</div>
      <div className="text-2xl">{day}</div>
      <div className="text-sm">ideal!</div>
    </div>
  );
}
