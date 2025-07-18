import z from "zod";
import { getItem, removeItem, setItem } from "./localStorageService";

function getItemFromCache<T>(key: string, schema: z.ZodSchema<T>) {
  const cacheSchema = z.object({
    expires: z.number(),
    value: schema,
  });

  const cached = getItem(key, cacheSchema);
  if (cached === null) {
    console.log("cache miss", key);
    return null;
  }

  const now = new Date();
  if (now.getTime() > cached.expires) {
    console.log("expired", key);
    removeItem(key);
    return null;
  }

  console.log("cache hit", key);
  return cached.value;
}

function setItemInCache(key: string, ttlMinutes: number, value: unknown) {
  const now = new Date();

  const item = {
    expires: now.getTime() + ttlMinutes * 60 * 1000,
    value: value,
  };

  setItem(key, item);
}

// these types are a bit tricky to follow, but it allows us to accept a function
// and then return a function with those same args
export function withCache<TArgs extends any[], TResult>(
  keyPrefix: string,
  ttlMinutes: number,
  schema: z.ZodSchema<TResult>,
  fn: (...args: TArgs) => Promise<TResult>
): (...args: TArgs) => Promise<TResult> {
  return async function (...args: TArgs): Promise<TResult> {
    const cacheKey = `${keyPrefix}-${args.join("-")}`;

    const cached = getItemFromCache(cacheKey, schema);
    if (cached !== null) {
      return cached;
    }

    const value = await fn(...args);

    setItemInCache(cacheKey, ttlMinutes, value);

    return value;
  };
}
