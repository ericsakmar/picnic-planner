import type { z } from "zod";

const cache: { [key: string]: unknown } = {};

function getItem<TSchema extends z.ZodType>(key: string, schema: TSchema) {
  const rawValue = cache[key];
  if (rawValue === null) {
    return null;
  }

  try {
    const parsed = schema.parse(rawValue);
    return parsed;
  } catch {
    return null;
  }
}

function setItem(key: string, value: unknown) {
  cache[key] = value;
}

function removeItem(key: string) {
  delete cache[key];
}

export default { getItem, setItem, removeItem };
