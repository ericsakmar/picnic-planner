import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Picnic Planner" }];
}

export default function Forecast() {
  return <h1>hello forecast</h1>;
}
