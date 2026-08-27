import type { Route } from "./+types/sponsorships";
import { cloudflare } from "~/context";
import { requireStaff } from "~/lib/staff";

export async function loader({ request, context }: Route.LoaderArgs) {
  requireStaff(request);
  const { env } = context.get(cloudflare);
  const rows = await env.DB.prepare(
    `SELECT id, created_at, church_name, contact_name, email, phone, students, message
       FROM sponsorship_requests ORDER BY created_at DESC LIMIT 200`,
  ).all();
  return { rows: rows.results as Record<string, string | null>[] };
}

export default function Sponsorships({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h2 style={{ fontSize: "1.25rem", marginBottom: ".75rem" }}>
        Sponsorship requests ({loaderData.rows.length})
      </h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Received</th>
            <th>Church</th>
            <th>Contact</th>
            <th>Students to train</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {loaderData.rows.map((r) => (
            <tr key={r.id as string}>
              <td>{r.created_at}</td>
              <td>{r.church_name}</td>
              <td>
                {r.contact_name}
                <br />
                <a href={`mailto:${r.email}`}>{r.email}</a>
                {r.phone ? <br /> : null}
                {r.phone}
              </td>
              <td style={{ maxWidth: "20rem" }}>{r.students ?? "—"}</td>
              <td style={{ maxWidth: "20rem" }}>{r.message ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
