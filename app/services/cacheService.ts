import z from "zod";
import { getItem, removeItem, setItem } from "./localStorageService";

export function getItemFromCache<T>(key: string, schema: z.ZodSchema<T>) {
  const cacheSchema = z.object({
    expires: z.number(),
    value: schema,
  });

  const cached = getItem(key, cacheSchema);
  if (cached === null) {
    return null;
  }

  const now = new Date();
  if (now.getTime() > cached.expires) {
    removeItem(key);
    return null;
  }

  return cached.value;
}

export function setItemInCache(
  key: string,
  ttlMinutes: number,
  value: unknown
) {
  const now = new Date();

  const item = {
    expires: now.getTime() + ttlMinutes * 60 * 1000,
    value: value,
  };

  setItem(key, item);
}
