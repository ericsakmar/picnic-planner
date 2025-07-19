import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("settings", "routes/settings.tsx"),
    route("forecast", "routes/forecast.tsx"),
    route("/api/forecast", "api/forecast.ts"),
    route("/api/history", "api/history.ts"),
  ]),
] satisfies RouteConfig;
