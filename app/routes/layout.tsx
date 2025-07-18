import type { Route } from "./+types/forecast";
import { Outlet } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Picnic Planner" }];
}

export default function Layout() {
  return (
    <div className="m-4 max-w-lg mx-auto">
      <h1 className="text-6xl">Picnic Planner</h1>
      <Outlet />
    </div>
  );
}
