import { kvLines, sendEmailSafe } from "./email";
import { insertInquiry, insertSponsorship, logEvent } from "./db";
import { clientIp, rateLimit } from "./ratelimit";
import { verifyTurnstile } from "./turnstile";
import {
  fieldErrors,
  inquirySchema,
  sponsorshipSchema,
} from "./validation";

export type FormResult =
  | { ok: true; kind: "inquiry" | "sponsorship" }
  | { ok: false; errors: Record<string, string>; values: Record<string, string> };

function formValues(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string") out[k] = v;
  delete out["cf-turnstile-response"];
  return out;
}

async function guard(
  request: Request,
  env: Env,
  fd: FormData,
  bucket: string,
): Promise<{ ip: string | null } | { fail: Record<string, string> }> {
  // Honeypot: real users never fill this.
  if ((fd.get("company") as string)?.length) return { fail: { _form: "Blocked." } };

  const ip = clientIp(request);
  const secret = (env as unknown as { TURNSTILE_SECRET_KEY?: string })
    .TURNSTILE_SECRET_KEY;
  const passed = await verifyTurnstile(
    fd.get("cf-turnstile-response"),
    secret,
    ip,
  );
  if (!passed) return { fail: { _form: "Please complete the challenge and try again." } };

  const rl = await rateLimit(env.KV, `${bucket}:${ip ?? "anon"}`, {
    limit: 5,
    windowSeconds: 600,
  });
  if (!rl.ok)
    return {
      fail: { _form: "Too many submissions. Please wait a few minutes and try again." },
    };

  return { ip };
}

export async function processInquiry(
  request: Request,
  env: Env,
  source = "admissions",
): Promise<FormResult> {
  const fd = await request.formData();
  const values = formValues(fd);

  const g = await guard(request, env, fd, "inquiry");
  if ("fail" in g) {
    await logEvent(env.DB, "inquiry.rejected", { detail: JSON.stringify(g.fail) });
    return { ok: false, errors: g.fail, values };
  }

  const parsed = inquirySchema.safeParse({
    name: values.name,
    email: values.email,
    phone: values.phone,
    homeChurch: values.homeChurch,
    campus: values.campus,
    program: values.program,
    message: values.message,
  });
  if (!parsed.success)
    return { ok: false, errors: fieldErrors(parsed.error), values };

  const id = await insertInquiry(
    env.DB,
    { ...parsed.data, source },
    { ip: g.ip, userAgent: request.headers.get("user-agent") },
  );
  await logEvent(env.DB, "inquiry.submit", { refId: id, ip: g.ip });

  const summary = kvLines({
    Name: parsed.data.name,
    Email: parsed.data.email,
    Phone: parsed.data.phone,
    "Home church": parsed.data.homeChurch,
    Campus: parsed.data.campus,
    Program: parsed.data.program,
    Source: source,
  });

  await sendEmailSafe(env, {
    to: env.REGISTRAR_EMAIL,
    replyTo: parsed.data.email,
    subject: `Website inquiry — ${parsed.data.name}`,
    text: `${summary}\n\nMessage:\n${parsed.data.message ?? "(none)"}\n`,
  });
  await sendEmailSafe(env, {
    to: parsed.data.email,
    subject: "We received your message — Florida Theological Seminary",
    text: `Thank you for writing to Florida Theological Seminary. The registrar has your message and will be in touch.\n\nWhat we received:\n${summary}\n\nIf you need us sooner, call 863-683-3879.`,
  });

  return { ok: true, kind: "inquiry" };
}

export async function processSponsorship(
  request: Request,
  env: Env,
): Promise<FormResult> {
  const fd = await request.formData();
  const values = formValues(fd);

  const g = await guard(request, env, fd, "sponsorship");
  if ("fail" in g) {
    await logEvent(env.DB, "sponsorship.rejected", { detail: JSON.stringify(g.fail) });
    return { ok: false, errors: g.fail, values };
  }

  const parsed = sponsorshipSchema.safeParse({
    churchName: values.churchName,
    contactName: values.contactName,
    email: values.email,
    phone: values.phone,
    students: values.students,
    message: values.message,
  });
  if (!parsed.success)
    return { ok: false, errors: fieldErrors(parsed.error), values };

  const id = await insertSponsorship(env.DB, parsed.data, {
    ip: g.ip,
    userAgent: request.headers.get("user-agent"),
  });
  await logEvent(env.DB, "sponsorship.submit", { refId: id, ip: g.ip });

  const summary = kvLines({
    Church: parsed.data.churchName,
    Contact: parsed.data.contactName,
    Email: parsed.data.email,
    Phone: parsed.data.phone,
  });
  await sendEmailSafe(env, {
    to: env.REGISTRAR_EMAIL,
    replyTo: parsed.data.email,
    subject: `Church sponsorship request — ${parsed.data.churchName}`,
    text: `${summary}\n\nStudents to train:\n${parsed.data.students ?? "(none listed)"}\n\nMessage:\n${parsed.data.message ?? "(none)"}\n`,
  });
  await sendEmailSafe(env, {
    to: parsed.data.email,
    subject: "We received your sponsorship request — Florida Theological Seminary",
    text: `Thank you. The registrar has your church's request and will follow up about training your members toward an accredited credential.\n\n${summary}`,
  });

  return { ok: true, kind: "sponsorship" };
}
