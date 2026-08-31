import { Form, Link, useNavigation } from "react-router";
import type { Route } from "./+types/grade-entry";
import { cloudflare } from "~/context";
import { requireStaff } from "~/lib/staff";
import { getRoster, getSectionSummary, saveDraftGrade } from "~/lib/grades";
import { LETTER_GRADES, fieldErrors, gradeEntrySchema } from "~/lib/validation";

export async function loader({ request, params, context }: Route.LoaderArgs) {
  requireStaff(request);
  const { env } = context.get(cloudflare);
  const section = await getSectionSummary(env.DB, params.sectionId);
  if (!section) throw new Response("Not found", { status: 404 });
  const roster = await getRoster(env.DB, params.sectionId);
  return { section, roster };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { email } = requireStaff(request);
  const { env } = context.get(cloudflare);
  const fd = await request.formData();

  const parsed = gradeEntrySchema.safeParse({
    enrollmentId: fd.get("enrollmentId"),
    letterGrade: fd.get("letterGrade"),
  });
  if (!parsed.success) {
    return { ok: false as const, errors: fieldErrors(parsed.error) };
  }

  await saveDraftGrade(env.DB, parsed.data, { changedBy: email });
  return { ok: true as const };
}

export default function GradeEntry({ loaderData, actionData }: Route.ComponentProps) {
  const { section, roster } = loaderData;
  const nav = useNavigation();
  const submitting = nav.state === "submitting";

  return (
    <>
      <p style={{ marginBottom: "1rem" }}>
        <Link to="/admin/grades">&larr; All sections</Link>
      </p>
      <h2 style={{ fontSize: "1.25rem", marginBottom: ".25rem" }}>
        {section.course_codes ?? "Section"} &middot; {section.term_name}
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        {section.campus ?? "—"} &middot; {section.meeting_info ?? "—"} &middot;{" "}
        {section.instructor_name ?? "—"}
      </p>

      {actionData?.ok === false && (
        <p className="form-error-summary" role="alert">
          {actionData.errors._form ?? "Could not save that grade. Try again."}
        </p>
      )}

      <p style={{ color: "var(--muted)", fontSize: ".85rem", marginBottom: "1rem" }}>
        Draft grades only in this phase — nothing here is submitted,
        reviewed, or finalized yet.
      </p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {roster.map((r) => (
            <tr key={r.enrollment_id}>
              <td>{r.student_id}</td>
              <td>{r.full_name}</td>
              <td>
                <span className="badge">{r.status ?? "no grade"}</span>
              </td>
              <td>
                <Form
                  method="post"
                  style={{ display: "flex", gap: ".5rem", alignItems: "center" }}
                >
                  <input type="hidden" name="enrollmentId" value={r.enrollment_id} />
                  <select name="letterGrade" defaultValue={r.letter_grade ?? ""} required>
                    <option value="" disabled>
                      Select
                    </option>
                    {LETTER_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn--ink" type="submit" disabled={submitting}>
                    Save draft
                  </button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
