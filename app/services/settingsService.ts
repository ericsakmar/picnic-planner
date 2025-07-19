import { settingsSchema, type Settings } from "~/types/settings";
import localStorageService from "./localStorageService.client";

const KEY = "app-settings";

// TODO consider naming to settingsService.client.ts, or some other way to enforce taht this only runs on client
export function getSettings(): Settings | null {
  return localStorageService.getItem(KEY, settingsSchema);
}

export function saveSettings(settings: Settings) {
  localStorageService.setItem(KEY, settings);
}
