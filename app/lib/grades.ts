import { newId } from "./ids";
import type { GradeEntryInput } from "./validation";

export type SectionSummary = {
  id: string;
  term_name: string;
  campus: string | null;
  instructor_name: string | null;
  meeting_info: string | null;
  course_codes: string | null;
};

export type SectionListRow = {
  id: string;
  term_name: string;
  campus: string | null;
  meeting_info: string | null;
  course_codes: string | null;
};

export type RosterRow = {
  enrollment_id: string;
  student_id: string;
  full_name: string;
  letter_grade: string | null;
  status: string | null;
};

export async function listSections(db: D1Database): Promise<SectionListRow[]> {
  const rows = await db
    .prepare(
      `SELECT sec.id, t.name as term_name, sec.campus, sec.meeting_info,
              GROUP_CONCAT(c.code, ', ') as course_codes
         FROM sections sec
         JOIN academic_terms t ON t.id = sec.term_id
         LEFT JOIN section_courses sc ON sc.section_id = sec.id
         LEFT JOIN courses c ON c.id = sc.course_id
        GROUP BY sec.id
        ORDER BY t.start_date DESC, sec.campus`,
    )
    .all();
  return rows.results as unknown as SectionListRow[];
}

export async function getSectionSummary(
  db: D1Database,
  sectionId: string,
): Promise<SectionSummary | null> {
  const row = await db
    .prepare(
      `SELECT sec.id, t.name as term_name, sec.campus, sec.instructor_name, sec.meeting_info,
              GROUP_CONCAT(c.code, ', ') as course_codes
         FROM sections sec
         JOIN academic_terms t ON t.id = sec.term_id
         LEFT JOIN section_courses sc ON sc.section_id = sec.id
         LEFT JOIN courses c ON c.id = sc.course_id
        WHERE sec.id = ?
        GROUP BY sec.id`,
    )
    .bind(sectionId)
    .first<SectionSummary>();
  return row ?? null;
}

export async function getRoster(db: D1Database, sectionId: string): Promise<RosterRow[]> {
  const rows = await db
    .prepare(
      `SELECT e.id as enrollment_id, s.student_id, s.full_name, g.letter_grade, g.status
         FROM enrollments e
         JOIN students s ON s.id = e.student_id
         LEFT JOIN grades g ON g.enrollment_id = e.id
        WHERE e.section_id = ?
        ORDER BY s.full_name`,
    )
    .bind(sectionId)
    .all();
  return rows.results as unknown as RosterRow[];
}

/**
 * Interim authorization note: the only gate in front of this today is
 * requireStaff() (any Cloudflare-Access-approved staff email), not a real
 * per-instructor role check — see the architecture plan's Section 10.
 */
export async function saveDraftGrade(
  db: D1Database,
  input: GradeEntryInput,
  meta: { changedBy: string },
): Promise<void> {
  const existing = await db
    .prepare(`SELECT id, letter_grade FROM grades WHERE enrollment_id = ?`)
    .bind(input.enrollmentId)
    .first<{ id: string; letter_grade: string | null }>();

  const oldValue = existing?.letter_grade ?? null;
  if (oldValue === input.letterGrade) return;

  if (existing) {
    await db
      .prepare(
        `UPDATE grades SET letter_grade = ?, status = 'draft', updated_at = datetime('now') WHERE id = ?`,
      )
      .bind(input.letterGrade, existing.id)
      .run();
  } else {
    await db
      .prepare(
        `INSERT INTO grades (id, enrollment_id, letter_grade, status) VALUES (?, ?, ?, 'draft')`,
      )
      .bind(newId(), input.enrollmentId, input.letterGrade)
      .run();
  }

  await recordGradeChange(db, {
    enrollmentId: input.enrollmentId,
    oldValue,
    newValue: input.letterGrade,
    changedBy: meta.changedBy,
  });
}

export async function recordGradeChange(
  db: D1Database,
  input: {
    enrollmentId: string;
    oldValue: string | null;
    newValue: string | null;
    changedBy: string;
    reason?: string;
  },
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO grade_changes (id, enrollment_id, old_value, new_value, reason, changed_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        newId(),
        input.enrollmentId,
        input.oldValue,
        input.newValue,
        input.reason ?? null,
        input.changedBy,
      )
      .run();
  } catch {
    // never let audit logging break a request
  }
}
