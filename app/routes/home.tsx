import type { Route } from "./+types/home";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Picnic Planner" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // check for valid settings. redirect to forecast if we have them,
  // redirect to settings page if not
  return redirect("/settings");
}

export default function Home() {
  return <h1>Picnic Planner</h1>;
}
