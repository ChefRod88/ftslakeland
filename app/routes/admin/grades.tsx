import { Link } from "react-router";
import type { Route } from "./+types/grades";
import { cloudflare } from "~/context";
import { requireStaff } from "~/lib/staff";
import { listSections } from "~/lib/grades";

export async function loader({ request, context }: Route.LoaderArgs) {
  requireStaff(request);
  const { env } = context.get(cloudflare);
  const sections = await listSections(env.DB);
  return { sections };
}

export default function Grades({ loaderData }: Route.ComponentProps) {
  const { sections } = loaderData;
  return (
    <>
      <h2 style={{ fontSize: "1.25rem", marginBottom: ".75rem" }}>
        Sections ({sections.length})
      </h2>
      {sections.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          No sections yet. Sections, courses, and enrollments are added
          directly in the database for this phase — there is no admin UI to
          create them yet.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Term</th>
              <th>Course(s)</th>
              <th>Campus</th>
              <th>Meets</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => (
              <tr key={s.id}>
                <td>{s.term_name}</td>
                <td>
                  <Link to={`/admin/grades/${s.id}`}>{s.course_codes ?? "—"}</Link>
                </td>
                <td>{s.campus ?? "—"}</td>
                <td>{s.meeting_info ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
