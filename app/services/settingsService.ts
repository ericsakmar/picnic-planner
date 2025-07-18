import { settingsSchema, type Settings } from "~/types/settings";

const KEY = "app-settings";

// TODO consider naming to settingsService.client.ts, or some other way to enforce taht this only runs on client
export function getSettings(): Settings | null {
  const rawSettings = localStorage.getItem(KEY);
  if (rawSettings === null) {
    return null;
  }

  // TODO try/catch this?
  const json = JSON.parse(rawSettings);

  const zodResult = settingsSchema.safeParse(json);
  if (zodResult.success) {
    return zodResult.data;
  }

  return null;
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
