import { newId, newReferenceCode } from "./ids";

const COLS = [
  "full_name",
  "email",
  "phone",
  "date_of_birth",
  "address",
  "home_church",
  "pastor_name",
  "pastor_email",
  "pastor_phone",
  "program",
  "campus",
  "start_term",
  "ministry_role",
  "education",
  "testimony",
] as const;

const FIELD_TO_COL: Record<string, string> = {
  fullName: "full_name",
  email: "email",
  phone: "phone",
  dateOfBirth: "date_of_birth",
  address: "address",
  homeChurch: "home_church",
  pastorName: "pastor_name",
  pastorEmail: "pastor_email",
  pastorPhone: "pastor_phone",
  program: "program",
  campus: "campus",
  startTerm: "start_term",
  ministryRole: "ministry_role",
  education: "education",
  testimony: "testimony",
};

export interface ApplicationRow {
  id: string;
  status: "draft" | "submitted";
  resume_token: string;
  reference_code: string | null;
  submitted_at: string | null;
  [col: string]: string | null;
}

export async function getApplicationByToken(
  db: D1Database,
  token: string,
): Promise<ApplicationRow | null> {
  return db
    .prepare(`SELECT * FROM applications WHERE resume_token = ?`)
    .bind(token)
    .first<ApplicationRow>();
}

/** Create or update a draft keyed by resume token. Returns the row id. */
export async function saveDraft(
  db: D1Database,
  token: string,
  data: Record<string, unknown>,
  meta: { ip: string | null; userAgent: string | null },
): Promise<string> {
  const existing = await getApplicationByToken(db, token);
  const values: Record<string, string | null> = {};
  for (const [field, col] of Object.entries(FIELD_TO_COL)) {
    const v = data[field];
    values[col] = typeof v === "string" && v.length > 0 ? v : null;
  }

  if (existing) {
    const sets = COLS.map((c) => `${c} = ?`).join(", ");
    await db
      .prepare(
        `UPDATE applications SET ${sets}, updated_at = datetime('now') WHERE resume_token = ?`,
      )
      .bind(...COLS.map((c) => values[c]), token)
      .run();
    return existing.id;
  }

  const id = newId();
  const cols = ["id", "resume_token", "ip", "user_agent", ...COLS];
  const placeholders = cols.map(() => "?").join(", ");
  await db
    .prepare(`INSERT INTO applications (${cols.join(", ")}) VALUES (${placeholders})`)
    .bind(id, token, meta.ip, meta.userAgent, ...COLS.map((c) => values[c]))
    .run();
  return id;
}

/** Mark a draft submitted and assign a reference code. */
export async function submitApplication(
  db: D1Database,
  token: string,
): Promise<string> {
  const code = newReferenceCode();
  await db
    .prepare(
      `UPDATE applications
         SET status = 'submitted',
             submitted_at = datetime('now'),
             updated_at = datetime('now'),
             reference_code = COALESCE(reference_code, ?)
       WHERE resume_token = ?`,
    )
    .bind(code, token)
    .run();
  const row = await getApplicationByToken(db, token);
  return row?.reference_code ?? code;
}

export async function attachFile(
  db: D1Database,
  applicationId: string,
  file: { kind: string; r2Key: string; filename: string; contentType: string; size: number },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO application_files
        (id, application_id, kind, r2_key, filename, content_type, size_bytes)
       VALUES (?,?,?,?,?,?,?)`,
    )
    .bind(
      newId(),
      applicationId,
      file.kind,
      file.r2Key,
      file.filename,
      file.contentType,
      file.size,
    )
    .run();
}
