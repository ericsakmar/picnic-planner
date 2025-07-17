import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Picnic Planner" }];
}

export default function Home() {
  return <h1>hello settings</h1>;
}
