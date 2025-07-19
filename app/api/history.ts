import { getHistory as getHistoryBase } from "~/services/forecastService";
import type { Route } from "./+types/forecast";
import { parseQueryParams } from "~/services/utils";
import z from "zod";
import { data } from "react-router";
import { withCache } from "~/services/cacheService";
import { weatherHistorySchema } from "~/types/forecast";
import memoryStorageService from "~/services/memoryStorageService";

const getHistory = withCache(getHistoryBase, {
  keyPrefix: "history",
  ttlMinutes: 12 * 60, // 12 hours, history doesn't change, but we might need to get a new range
  schema: z.array(weatherHistorySchema),
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

  const forecast = await getHistory(latitude, longitude);
  return forecast;
}
