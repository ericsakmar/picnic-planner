import { settingsSchema, type Settings } from "~/types/settings";
import { getItem, setItem } from "./localStorageService";

const KEY = "app-settings";

// TODO consider naming to settingsService.client.ts, or some other way to enforce taht this only runs on client
export function getSettings(): Settings | null {
  return getItem(KEY, settingsSchema);
}

export function saveSettings(settings: Settings) {
  setItem(KEY, settings);
}
