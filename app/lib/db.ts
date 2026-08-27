import { newId } from "./ids";
import type { InquiryInput, SponsorshipInput } from "./validation";

type Meta = { ip: string | null; userAgent: string | null };

export async function insertInquiry(
  db: D1Database,
  input: InquiryInput & { source?: string },
  meta: Meta,
): Promise<string> {
  const id = newId();
  await db
    .prepare(
      `INSERT INTO inquiries
        (id, name, email, phone, home_church, campus, program, message, source, ip, user_agent)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    )
    .bind(
      id,
      input.name,
      input.email,
      input.phone ?? null,
      input.homeChurch ?? null,
      input.campus ?? null,
      input.program ?? null,
      input.message ?? null,
      input.source ?? "admissions",
      meta.ip,
      meta.userAgent,
    )
    .run();
  return id;
}

export async function insertSponsorship(
  db: D1Database,
  input: SponsorshipInput,
  meta: Meta,
): Promise<string> {
  const id = newId();
  await db
    .prepare(
      `INSERT INTO sponsorship_requests
        (id, church_name, contact_name, email, phone, students, message, ip, user_agent)
       VALUES (?,?,?,?,?,?,?,?,?)`,
    )
    .bind(
      id,
      input.churchName,
      input.contactName,
      input.email,
      input.phone ?? null,
      input.students ?? null,
      input.message ?? null,
      meta.ip,
      meta.userAgent,
    )
    .run();
  return id;
}

export async function logEvent(
  db: D1Database,
  kind: string,
  opts: { refId?: string; ip?: string | null; detail?: string } = {},
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO form_events (id, kind, ref_id, ip, detail) VALUES (?,?,?,?,?)`,
      )
      .bind(newId(), kind, opts.refId ?? null, opts.ip ?? null, opts.detail ?? null)
      .run();
  } catch {
    // never let audit logging break a request
  }
}
