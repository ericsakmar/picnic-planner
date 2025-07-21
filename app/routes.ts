import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("settings", "routes/settings.tsx"),
    route("forecast", "routes/forecast.tsx"),
  ]),
  ...prefix("api", [
    route("forecast", "api/forecast.ts"),
    route("history", "api/history.ts"),
  ]),
] satisfies RouteConfig;
