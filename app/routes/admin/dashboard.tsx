import { Link } from "react-router";
import type { Route } from "./+types/dashboard";
import { cloudflare } from "~/context";
import { requireStaff } from "~/lib/staff";

export async function loader({ request, context }: Route.LoaderArgs) {
  requireStaff(request);
  const { env } = context.get(cloudflare);
  const count = async (sql: string) =>
    Number((await env.DB.prepare(sql).first<{ c: number }>())?.c ?? 0);

  const [apps, submitted, inquiries, sponsorships] = await Promise.all([
    count("SELECT COUNT(*) c FROM applications"),
    count("SELECT COUNT(*) c FROM applications WHERE status='submitted'"),
    count("SELECT COUNT(*) c FROM inquiries"),
    count("SELECT COUNT(*) c FROM sponsorship_requests"),
  ]);

  const recent = await env.DB.prepare(
    `SELECT id, reference_code, full_name, email, program, campus, status, created_at
       FROM applications ORDER BY created_at DESC LIMIT 15`,
  ).all<{
    id: string;
    reference_code: string | null;
    full_name: string | null;
    email: string | null;
    program: string | null;
    campus: string | null;
    status: string;
    created_at: string;
  }>();

  return { apps, submitted, inquiries, sponsorships, recent: recent.results };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { apps, submitted, inquiries, sponsorships, recent } = loaderData;
  return (
    <>
      <div className="stat-row">
        <div className="stat">
          <div className="n">{submitted}</div>
          <div className="l">Applications submitted</div>
        </div>
        <div className="stat">
          <div className="n">{apps - submitted}</div>
          <div className="l">Drafts in progress</div>
        </div>
        <div className="stat">
          <div className="n">{inquiries}</div>
          <div className="l">Inquiries</div>
        </div>
        <div className="stat">
          <div className="n">{sponsorships}</div>
          <div className="l">Sponsorship requests</div>
        </div>
      </div>

      <h2 style={{ fontSize: "1.25rem", marginBottom: ".75rem" }}>
        Recent applications
      </h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Ref</th>
            <th>Name</th>
            <th>Program</th>
            <th>Campus</th>
            <th>Status</th>
            <th>Received</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((r) => (
            <tr key={r.id}>
              <td>
                <Link to={`/admin/applications/${r.id}`}>
                  {r.reference_code ?? "draft"}
                </Link>
              </td>
              <td>{r.full_name ?? "—"}</td>
              <td>{r.program ?? "—"}</td>
              <td>{r.campus ?? "—"}</td>
              <td>
                <span className={`badge${r.status === "submitted" ? " badge--submitted" : ""}`}>
                  {r.status}
                </span>
              </td>
              <td>{r.created_at}</td>
            </tr>
          ))}
          {recent.length === 0 && (
            <tr>
              <td colSpan={6}>No applications yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
