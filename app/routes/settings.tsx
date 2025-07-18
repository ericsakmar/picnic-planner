import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Picnic Planner" }];
}

export default function Home() {
  return <h1>hello settings</h1>;
}
