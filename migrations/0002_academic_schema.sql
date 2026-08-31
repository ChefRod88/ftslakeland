-- Academic Student Information System, Phase 1: schema for final grade entry.
-- Draft-only workflow (grades.status is always 'draft' in this phase — no
-- submitted/reviewed/finalized/locked transitions yet, see NEXT_STEPS.md /
-- the architecture plan for why). academic_terms and grade_scales are laid
-- down now so the later transcript-generation phase doesn't require a
-- disruptive schema rework, even though nothing in this phase reads them
-- for anything but the grade-entry dropdown.

CREATE TABLE academic_terms (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,          -- e.g. "Fall 2026"
  start_date  TEXT,
  end_date    TEXT
);

-- Quality points are left NULL for WP/WF/I until the institution confirms
-- how withdrawals and incompletes affect GPA (open policy question).
CREATE TABLE grade_scales (
  code            TEXT PRIMARY KEY,   -- A | B | C | D | F | WP | WF | I
  label           TEXT NOT NULL,
  quality_points  REAL
);

INSERT INTO grade_scales (code, label, quality_points) VALUES
  ('A',  'Distinguished',       4.0),
  ('B',  'Superior',            3.0),
  ('C',  'Average',             2.0),
  ('D',  'Below Average',       1.0),
  ('F',  'Failure',             0.0),
  ('WP', 'Withdrawal, Passing', NULL),
  ('WF', 'Withdrawal, Failing', NULL),
  ('I',  'Incomplete',          NULL);

-- Catalog entity. credit_hours is nullable — values must come from
-- institutional policy per course, not an assumed default.
CREATE TABLE courses (
  id            TEXT PRIMARY KEY,
  code          TEXT NOT NULL UNIQUE,   -- e.g. "BP203"
  title         TEXT NOT NULL,
  credit_hours  REAL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- One scheduled instructional offering. campus/instructor are free-text
-- placeholders — there's no campuses or staff/instructor table yet.
CREATE TABLE sections (
  id               TEXT PRIMARY KEY,
  term_id          TEXT NOT NULL REFERENCES academic_terms (id),
  campus           TEXT,
  instructor_name  TEXT,
  meeting_info     TEXT,             -- free-text day/time, e.g. "Tue 5:00-6:30pm"
  capacity         INTEGER,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_sections_term ON sections (term_id);

-- Cross-listing join table. A section can serve more than one catalog
-- course code (e.g. one Quincy section teaching BP203 + BP503 + BP703
-- together) — this must stay a join table, never a comma-separated
-- column on courses or sections.
CREATE TABLE section_courses (
  id          TEXT PRIMARY KEY,
  section_id  TEXT NOT NULL REFERENCES sections (id),
  course_id   TEXT NOT NULL REFERENCES courses (id),
  UNIQUE (section_id, course_id)
);

CREATE INDEX idx_section_courses_section ON section_courses (section_id);
CREATE INDEX idx_section_courses_course ON section_courses (course_id);

-- Real student identity, distinct from the admissions `applications` table.
-- student_id is the institutional ID (format TBD institutionally — kept
-- distinct from applications.reference_code's "FTS-XXXXXX" admissions
-- codes, which are a different ID space for a different purpose).
CREATE TABLE students (
  id          TEXT PRIMARY KEY,
  student_id  TEXT NOT NULL UNIQUE,
  full_name   TEXT NOT NULL,
  email       TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- A student enrolled in a section (not directly in a course — the course(s)
-- taught are reached via section_courses).
CREATE TABLE enrollments (
  id          TEXT PRIMARY KEY,
  student_id  TEXT NOT NULL REFERENCES students (id),
  section_id  TEXT NOT NULL REFERENCES sections (id),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (student_id, section_id)
);

CREATE INDEX idx_enrollments_section ON enrollments (section_id);
CREATE INDEX idx_enrollments_student ON enrollments (student_id);

-- One grade per enrollment. status is always 'draft' in Phase 1; the
-- column exists now so the submitted/reviewed/finalized/locked workflow
-- (not yet designed) doesn't require adding it later.
CREATE TABLE grades (
  id             TEXT PRIMARY KEY,
  enrollment_id  TEXT NOT NULL UNIQUE REFERENCES enrollments (id),
  letter_grade   TEXT REFERENCES grade_scales (code),
  status         TEXT NOT NULL DEFAULT 'draft',
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Append-only audit trail for grade changes: who, when, old value, new
-- value. Deliberately a dedicated table rather than an extension of
-- form_events, since audit-grade queries need typed old/new columns.
CREATE TABLE grade_changes (
  id             TEXT PRIMARY KEY,
  enrollment_id  TEXT NOT NULL REFERENCES enrollments (id),
  old_value      TEXT,
  new_value      TEXT,
  reason         TEXT,
  changed_by     TEXT NOT NULL,     -- staff email from requireStaff()
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_grade_changes_enrollment ON grade_changes (enrollment_id);
