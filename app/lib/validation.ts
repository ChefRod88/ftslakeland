import { z } from "zod";

/** Coerce missing/null form values to "" so messages are ours, not Zod's type error. */
const asString = (schema: z.ZodType<string>) =>
  z.preprocess((v) => (v == null ? "" : v), schema);

const required = (label: string, max = 500) =>
  asString(z.string().trim().min(1, `${label} is required`).max(max));

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const email = asString(
  z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => EMAIL_RE.test(v), "Enter a valid email address"),
);

const optional = (max = 2000) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() !== "" ? v.trim() : undefined),
    z.string().max(max).optional(),
  );

const optionalEmail = z.preprocess(
  (v) => (typeof v === "string" ? v.trim().toLowerCase() : ""),
  z
    .string()
    .refine((v) => v === "" || EMAIL_RE.test(v), "Enter a valid email address")
    .transform((v) => (v === "" ? undefined : v)),
);

export const CAMPUSES = ["Lakeland", "Dunedin", "Lake City", "Jacksonville"] as const;

export const inquirySchema = z.object({
  name: required("Name"),
  email,
  phone: optional(40),
  homeChurch: optional(200),
  campus: z.enum(CAMPUSES).optional().or(z.literal("").transform(() => undefined)),
  program: optional(120),
  message: optional(4000),
});
export type InquiryInput = z.infer<typeof inquirySchema>;

export const sponsorshipSchema = z.object({
  churchName: required("Church name"),
  contactName: required("Your name"),
  email,
  phone: optional(40),
  students: optional(2000),
  message: optional(4000),
});
export type SponsorshipInput = z.infer<typeof sponsorshipSchema>;

/** Full application, enforced on final submit. */
export const applicationSchema = z.object({
  fullName: required("Full name"),
  email,
  phone: required("Phone", 40),
  dateOfBirth: optional(20),
  address: optional(400),

  homeChurch: required("Home church", 200),
  pastorName: required("Pastor's name", 200),
  pastorEmail: optionalEmail,
  pastorPhone: optional(40),

  program: required("Program", 120),
  campus: z.enum(CAMPUSES, { message: "Choose a campus" }),
  startTerm: optional(60),
  ministryRole: optional(200),
  education: optional(2000),
  testimony: optional(6000),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

/** Turn a ZodError into `{ field: message }` for the form UI. */
export function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "_form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
