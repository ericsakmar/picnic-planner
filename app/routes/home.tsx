import { getSettings } from "~/services/settingsService.client";
import type { Route } from "./+types/home";
import { redirect } from "react-router";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // check for valid settings
  const settings = getSettings();

  // redirect to settings page if we don't have any yet
  if (settings === null) {
    return redirect("/settings");
  }

  // if we do have settings, continue to the forecast page
  return redirect("/forecast");
}

export default function Home() {
  return <h1>Picnic Planner</h1>;
}
