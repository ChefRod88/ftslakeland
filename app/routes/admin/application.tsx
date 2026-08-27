import { Link } from "react-router";
import type { Route } from "./+types/application";
import { cloudflare } from "~/context";
import { requireStaff } from "~/lib/staff";

const LABELS: [string, string][] = [
  ["full_name", "Full name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["date_of_birth", "Date of birth"],
  ["address", "Address"],
  ["home_church", "Home church"],
  ["pastor_name", "Pastor"],
  ["pastor_email", "Pastor email"],
  ["pastor_phone", "Pastor phone"],
  ["program", "Program"],
  ["campus", "Campus"],
  ["start_term", "Start term"],
  ["ministry_role", "Ministry role"],
  ["education", "Education"],
  ["testimony", "Call to ministry"],
];

export async function loader({ request, params, context }: Route.LoaderArgs) {
  requireStaff(request);
  const { env } = context.get(cloudflare);
  const row = await env.DB.prepare(`SELECT * FROM applications WHERE id = ?`)
    .bind(params.id)
    .first<Record<string, string | null>>();
  if (!row) throw new Response("Not found", { status: 404 });
  const files = await env.DB.prepare(
    `SELECT id, kind, filename, size_bytes, created_at FROM application_files WHERE application_id = ?`,
  )
    .bind(params.id)
    .all();
  return { row, files: files.results as Record<string, string | null>[] };
}

export default function Application({ loaderData }: Route.ComponentProps) {
  const { row, files } = loaderData;
  return (
    <>
      <p style={{ marginBottom: "1rem" }}>
        <Link to="/admin/applications">&larr; All applications</Link>
      </p>
      <h2 style={{ fontSize: "1.5rem", marginBottom: ".25rem" }}>
        {row.full_name ?? "Draft application"}
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        {row.reference_code ?? "no reference yet"} &middot; {row.status} &middot;
        received {row.created_at}
        {row.submitted_at ? ` · submitted ${row.submitted_at}` : ""}
      </p>

      <dl className="dl">
        {LABELS.map(([k, label]) =>
          row[k] ? (
            <div key={k} style={{ display: "contents" }}>
              <dt>{label}</dt>
              <dd>{row[k]}</dd>
            </div>
          ) : null,
        )}
      </dl>

      {files.length > 0 && (
        <>
          <h3 style={{ marginTop: "2rem", fontSize: "1.1rem" }}>Attachments</h3>
          <ul>
            {files.map((f) => (
              <li key={f.id as string}>
                <a href={`/admin/files/${f.id}`}>{f.filename}</a> ({f.kind},{" "}
                {Math.round(Number(f.size_bytes ?? 0) / 1024)} KB)
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
