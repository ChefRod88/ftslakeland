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

  ...prefix("admin", [
    layout("routes/admin/layout.tsx", [
      index("routes/admin/dashboard.tsx"),
      route("applications", "routes/admin/applications.tsx"),
      route("applications/:id", "routes/admin/application.tsx"),
      route("inquiries", "routes/admin/inquiries.tsx"),
      route("sponsorships", "routes/admin/sponsorships.tsx"),
      route("files/:id", "routes/admin/file.tsx"),
    ]),
  ]),

  route("sitemap.xml", "routes/sitemap.tsx"),
  route("robots.txt", "routes/robots.tsx"),
] satisfies RouteConfig;
