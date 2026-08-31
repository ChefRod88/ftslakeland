import type { Route } from "./+types/inquiries";
import { cloudflare } from "~/context";
import { requireStaff } from "~/lib/staff";

export async function loader({ request, context }: Route.LoaderArgs) {
  requireStaff(request);
  const { env } = context.get(cloudflare);
  const rows = await env.DB.prepare(
    `SELECT id, created_at, name, email, phone, home_church, campus, program, message, source
       FROM inquiries ORDER BY created_at DESC LIMIT 200`,
  ).all();
  return { rows: rows.results as Record<string, string | null>[] };
}

export default function Inquiries({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h2 style={{ fontSize: "1.25rem", marginBottom: ".75rem" }}>
        Inquiries ({loaderData.rows.length})
      </h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Received</th>
            <th>Name</th>
            <th>Email</th>
            <th>Campus / Program</th>
            <th>Message</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {loaderData.rows.map((r) => (
            <tr key={r.id as string}>
              <td>{r.created_at}</td>
              <td>{r.name}</td>
              <td>
                <a href={`mailto:${r.email}`}>{r.email}</a>
                {r.phone ? <br /> : null}
                {r.phone}
              </td>
              <td>
                {r.campus ?? "—"}
                {r.program ? ` / ${r.program}` : ""}
              </td>
              <td style={{ maxWidth: "22rem" }}>{r.message ?? "—"}</td>
              <td>{r.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
