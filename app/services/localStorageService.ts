import type { z } from "zod";

export function getItem<TSchema extends z.ZodType>(
  key: string,
  schema: TSchema
) {
  const rawValue = localStorage.getItem(key);
  if (rawValue === null) {
    return null;
  }

  try {
    const json = JSON.parse(rawValue);
    const parsed = schema.parse(json);
    return parsed;
  } catch {
    return null;
  }
}

// TODO try/catch?
export function setItem(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string) {
  localStorage.removeItem(key);
}
