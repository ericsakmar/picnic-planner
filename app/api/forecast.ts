import { getForecast as getForecastBase } from "~/services/forecastService";
import type { Route } from "./+types/forecast";
import { parseQueryParams } from "~/services/utils";
import z from "zod";
import { data } from "react-router";
import { withCache } from "~/services/cacheService";
import { forecastSchema } from "~/types/forecast";
import memoryStorageService from "~/services/memoryStorageService";

const getForecast = withCache(getForecastBase, {
  keyPrefix: "forecast",
  ttlMinutes: 60, // weather forecasts are updated every hour
  schema: z.array(forecastSchema),
  storage: memoryStorageService,
});

export async function loader({ request }: Route.LoaderArgs) {
  const queryParamsRes = parseQueryParams(
    request,
    z.object({
      latitude: z.coerce.number(),
      longitude: z.coerce.number(),
    })
  );

  if (!queryParamsRes.success) {
    return data({ errors: queryParamsRes.error }, { status: 400 });
  }

  const { latitude, longitude } = queryParamsRes.data;

  const forecast = await getForecast(latitude, longitude);
  return forecast;
}
