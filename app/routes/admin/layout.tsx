import { NavLink, Outlet } from "react-router";
import type { Route } from "./+types/layout";
import { requireStaff } from "~/lib/staff";

export function loader({ request }: Route.LoaderArgs) {
  const { email } = requireStaff(request);
  return { email };
}

export function meta(_: Route.MetaArgs) {
  return [{ title: "Admin — Florida Theological Seminary" }, { name: "robots", content: "noindex" }];
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div className="admin">
      <div className="admin-top">
        <span className="brand">FTS Admin</span>
        <nav className="admin-nav">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/applications">Applications</NavLink>
          <NavLink to="/admin/inquiries">Inquiries</NavLink>
          <NavLink to="/admin/sponsorships">Sponsorships</NavLink>
        </nav>
        <span className="admin-who">{loaderData.email}</span>
      </div>
      <Outlet />
    </div>
  );
}
