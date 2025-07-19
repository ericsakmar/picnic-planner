import { settingsSchema, type Settings } from "~/types/settings";
import localStorageService from "./localStorageService.client";

const KEY = "app-settings";

export function getSettings(): Settings | null {
  return localStorageService.getItem(KEY, settingsSchema);
}

export function saveSettings(settings: Settings) {
  localStorageService.setItem(KEY, settings);
}
