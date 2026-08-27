import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("programs", "routes/programs.tsx"),
    route("admissions", "routes/admissions.tsx"),
    route("admissions/apply", "routes/apply.tsx"),
    route("history", "routes/history.tsx"),
    route("accreditation", "routes/accreditation.tsx"),
    route("give", "routes/give.tsx"),
    route("portal", "routes/portal.tsx"),
    route("contact", "routes/contact.tsx"),
    route("privacy", "routes/privacy.tsx"),
  ]),
] satisfies RouteConfig;
