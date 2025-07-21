import z from "zod";

type KeyFn = (args: any[]) => string;
type GetItemFn = <T>(key: string, schema: z.ZodSchema<T>) => T | null;
type SetItemFn = <T>(key: string, value: T) => void;
type RemoveItemFn = (key: string) => void;

interface Storage {
  getItem: GetItemFn;
  setItem: SetItemFn;
  removeItem: RemoveItemFn;
}

function getItemFromCache<T>(
  key: string,
  schema: z.ZodSchema<T>,
  storage: Storage
) {
  const cacheSchema = z.object({
    expires: z.number(),
    value: schema,
  });

  const cached = storage.getItem(key, cacheSchema);
  if (cached === null) {
    // console.log("cache miss", key);
    return null;
  }

  const now = new Date();
  if (now.getTime() > cached.expires) {
    // console.log("expired", key);
    storage.removeItem(key);
    return null;
  }

  // console.log("cache hit", key);
  return cached.value;
}

function setItemInCache(
  key: string,
  ttlMinutes: number,
  value: unknown,
  storage: Storage
) {
  const now = new Date();

  const item = {
    expires: now.getTime() + ttlMinutes * 60 * 1000,
    value: value,
  };

  storage.setItem(key, item);
}

// these types are a bit tricky to follow, but it allows us to accept a function
// and then return a function with those same args
export function withCache<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: {
    getKey: KeyFn;
    ttlMinutes: number;
    schema: z.ZodSchema<TResult>;
    storage: Storage;
  }
): (...args: TArgs) => Promise<TResult> {
  return async function (...args: TArgs): Promise<TResult> {
    const cacheKey = options.getKey(args);

    const cached = getItemFromCache(cacheKey, options.schema, options.storage);
    if (cached !== null) {
      return cached;
    }

    const value = await fn(...args);

    setItemInCache(cacheKey, options.ttlMinutes, value, options.storage);

    return value;
  };
}
