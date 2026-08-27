import { Link } from "react-router";
import type { Route } from "./+types/applications";
import { cloudflare } from "~/context";
import { requireStaff } from "~/lib/staff";

export async function loader({ request, context }: Route.LoaderArgs) {
  requireStaff(request);
  const { env } = context.get(cloudflare);
  const rows = await env.DB.prepare(
    `SELECT id, reference_code, full_name, email, phone, program, campus, status, created_at, submitted_at
       FROM applications ORDER BY created_at DESC LIMIT 200`,
  ).all();
  return { rows: rows.results as Record<string, string | null>[] };
}

export default function Applications({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h2 style={{ fontSize: "1.25rem", marginBottom: ".75rem" }}>
        Applications ({loaderData.rows.length})
      </h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Ref</th>
            <th>Name</th>
            <th>Email</th>
            <th>Program</th>
            <th>Campus</th>
            <th>Status</th>
            <th>Received</th>
          </tr>
        </thead>
        <tbody>
          {loaderData.rows.map((r) => (
            <tr key={r.id as string}>
              <td>
                <Link to={`/admin/applications/${r.id}`}>
                  {r.reference_code ?? "draft"}
                </Link>
              </td>
              <td>{r.full_name ?? "—"}</td>
              <td>{r.email ?? "—"}</td>
              <td>{r.program ?? "—"}</td>
              <td>{r.campus ?? "—"}</td>
              <td>
                <span
                  className={`badge${r.status === "submitted" ? " badge--submitted" : ""}`}
                >
                  {r.status}
                </span>
              </td>
              <td>{r.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
