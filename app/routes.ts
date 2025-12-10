import {
  type RouteConfig,
  index,
  prefix,
  route
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("healthcheck", "routes/healthcheck.tsx"),
  route("about", "routes/about.tsx"),
  route("notifications", "routes/notifications.tsx"),

  // ペット関連
  ...prefix("pets", [
    index("routes/pets/index.tsx"),
    route(":id", "routes/pets/pet.tsx"),
    route(":id/reservation", "routes/pets/reservation.tsx")
  ])
] satisfies RouteConfig;
