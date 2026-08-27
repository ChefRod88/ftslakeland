import { Form, useNavigation } from "react-router";
import type { Route } from "./+types/apply";
import { cloudflare } from "~/context";
import { Field, Turnstile } from "~/components/form";
import { site } from "~/data/site";
import { programs } from "~/data/programs";
import { CAMPUSES, applicationSchema, fieldErrors } from "~/lib/validation";
import {
  attachFile,
  getApplicationByToken,
  saveDraft,
  submitApplication,
} from "~/lib/applications";
import { logEvent } from "~/lib/db";
import { clientIp, rateLimit } from "~/lib/ratelimit";
import { verifyTurnstile } from "~/lib/turnstile";
import { kvLines, sendEmailSafe } from "~/lib/email";
import { newToken } from "~/lib/ids";

const MAX_FILE = 5 * 1024 * 1024;
const OK_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function meta(_: Route.MetaArgs) {
  return [{ title: "Apply — Florida Theological Seminary" }];
}

type FormFields = ReturnType<typeof fields>;
type ActionData =
  | { ok: true; referenceCode: string }
  | {
      ok: false;
      errors: Record<string, string>;
      values: FormFields;
      token: string;
      saved?: boolean;
      resumeUrl?: string;
    };

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.get(cloudflare);
  const url = new URL(request.url);
  const resume = url.searchParams.get("resume");
  let draft: Record<string, string | null> | null = null;
  if (resume) {
    const row = await getApplicationByToken(env.DB, resume);
    if (row) draft = row;
  }
  return {
    turnstileSiteKey: env.TURNSTILE_SITE_KEY,
    uploadsEnabled: Boolean((env as Env & { UPLOADS?: R2Bucket }).UPLOADS),
    token: resume || newToken(),
    resumed: Boolean(draft),
    draft: draft && {
      fullName: draft.full_name,
      email: draft.email,
      phone: draft.phone,
      dateOfBirth: draft.date_of_birth,
      address: draft.address,
      homeChurch: draft.home_church,
      pastorName: draft.pastor_name,
      pastorEmail: draft.pastor_email,
      pastorPhone: draft.pastor_phone,
      program: draft.program,
      campus: draft.campus,
      startTerm: draft.start_term,
      ministryRole: draft.ministry_role,
      education: draft.education,
      testimony: draft.testimony,
    },
    submitted: draft?.status === "submitted" ? draft.reference_code : null,
  };
}

function fields(fd: FormData) {
  const v: Record<string, string> = {};
  for (const [k, val] of fd.entries()) if (typeof val === "string") v[k] = val;
  return {
    fullName: v.fullName,
    email: v.email,
    phone: v.phone,
    dateOfBirth: v.dateOfBirth,
    address: v.address,
    homeChurch: v.homeChurch,
    pastorName: v.pastorName,
    pastorEmail: v.pastorEmail,
    pastorPhone: v.pastorPhone,
    program: v.program,
    campus: v.campus,
    startTerm: v.startTerm,
    ministryRole: v.ministryRole,
    education: v.education,
    testimony: v.testimony,
  };
}

export async function action({
  request,
  context,
}: Route.ActionArgs): Promise<ActionData> {
  const { env } = context.get(cloudflare);
  const fd = await request.formData();
  const ip = clientIp(request);
  const token = String(fd.get("token") || newToken());
  const intent = String(fd.get("intent") || "save");
  const data = fields(fd);
  const meta = { ip, userAgent: request.headers.get("user-agent") };

  if ((fd.get("company") as string)?.length) {
    return { ok: false as const, errors: { _form: "Blocked." }, values: data, token };
  }

  const rl = await rateLimit(env.KV, `apply:${ip ?? "anon"}`, {
    limit: 12,
    windowSeconds: 600,
  });
  if (!rl.ok)
    return {
      ok: false as const,
      errors: { _form: "Too many attempts. Please wait a few minutes." },
      values: data,
      token,
    };

  if (intent === "save") {
    await saveDraft(env.DB, token, data, meta);
    await logEvent(env.DB, "application.save", { refId: token, ip });
    const resumeUrl = `${env.SITE_URL}/admissions/apply?resume=${token}`;
    if (typeof data.email === "string" && data.email.includes("@")) {
      await sendEmailSafe(env, {
        to: data.email,
        subject: "Your saved application — Florida Theological Seminary",
        text: `Your application is saved. Finish it any time with this link:\n\n${resumeUrl}\n\nThe link is private to you; do not share it.`,
      });
    }
    return {
      ok: false as const,
      saved: true,
      resumeUrl,
      values: data,
      token,
      errors: {} as Record<string, string>,
    };
  }

  // intent === "submit"
  const passed = await verifyTurnstile(
    fd.get("cf-turnstile-response"),
    env.TURNSTILE_SECRET_KEY,
    ip,
  );
  if (!passed)
    return {
      ok: false as const,
      errors: { _form: "Please complete the challenge and try again." },
      values: data,
      token,
    };

  const parsed = applicationSchema.safeParse(data);
  if (!parsed.success) {
    await saveDraft(env.DB, token, data, meta); // keep their typing
    return {
      ok: false as const,
      errors: fieldErrors(parsed.error),
      values: data,
      token,
    };
  }

  const appId = await saveDraft(env.DB, token, parsed.data, meta);

  const uploads = (env as Env & { UPLOADS?: R2Bucket }).UPLOADS;
  const file = fd.get("pastorLetter");
  if (file instanceof File && file.size > 0 && uploads) {
    if (file.size > MAX_FILE || !OK_TYPES.has(file.type)) {
      return {
        ok: false as const,
        errors: {
          pastorLetter: "Attach a PDF, image, or Word document under 5 MB.",
        },
        values: data,
        token,
      };
    }
    const key = `applications/${appId}/pastor-letter-${Date.now()}-${file.name}`;
    await uploads.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    });
    await attachFile(env.DB, appId, {
      kind: "pastor_letter",
      r2Key: key,
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });
  }

  const referenceCode = await submitApplication(env.DB, token);
  await logEvent(env.DB, "application.submit", { refId: referenceCode, ip });

  const summary = kvLines({
    Reference: referenceCode,
    Name: parsed.data.fullName,
    Email: parsed.data.email,
    Phone: parsed.data.phone,
    "Home church": parsed.data.homeChurch,
    Pastor: parsed.data.pastorName,
    Program: parsed.data.program,
    Campus: parsed.data.campus,
    "Start term": parsed.data.startTerm,
  });
  await sendEmailSafe(env, {
    to: env.REGISTRAR_EMAIL,
    replyTo: parsed.data.email,
    subject: `New application — ${parsed.data.fullName} (${referenceCode})`,
    text: `${summary}\n\nMinistry role:\n${parsed.data.ministryRole ?? "(none)"}\n\nEducation:\n${parsed.data.education ?? "(none)"}\n\nTestimony / call:\n${parsed.data.testimony ?? "(none)"}\n`,
  });
  await sendEmailSafe(env, {
    to: parsed.data.email,
    subject: `Application received — ${referenceCode}`,
    text: `Thank you for applying to Florida Theological Seminary.\n\nYour reference number is ${referenceCode}. The registrar will call you to confirm your courses and campus, usually within a week. There is no application fee.\n\nIf anything changes, reply to this email or call ${site.phone.display}.`,
  });

  return { ok: true as const, referenceCode };
}

export default function Apply({ loaderData, actionData }: Route.ComponentProps) {
  const nav = useNavigation();
  const busy = nav.state !== "idle";
  const pendingIntent = nav.formData?.get("intent");

  const alreadySubmitted = loaderData.submitted;
  if (alreadySubmitted && !actionData) {
    return (
      <section className="band">
        <div className="wrap">
          <div className="form-ok">
            <p className="eyebrow">Application</p>
            <h2>This application is already submitted.</h2>
            <p>
              Reference <span className="code">{alreadySubmitted}</span>. The
              registrar has it. Call <a href={site.phone.href}>{site.phone.display}</a>{" "}
              with questions.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (actionData?.ok) {
    return (
      <section className="band">
        <div className="wrap">
          <div className="form-ok">
            <p className="eyebrow">Application received</p>
            <h2>
              Your reference number is{" "}
              <span className="code">{actionData.referenceCode}</span>
            </h2>
            <p>
              We emailed a copy to you. The registrar will call to confirm your
              courses and campus, usually within a week. There is no application
              fee.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const failed = actionData && actionData.ok === false ? actionData : null;
  const errors: Record<string, string> = failed?.errors ?? {};
  const saved = failed?.saved ? failed : null;
  const d = (loaderData.draft ?? {}) as Record<string, string | null>;
  const v = (failed?.values ?? {}) as Record<string, string | undefined>;
  const val = (k: string) => v[k] ?? d[k] ?? "";

  return (
    <section className="band">
      <div className="wrap">
        <p className="eyebrow">Application &middot; Fall 2026</p>
        <h1>Apply to Florida Theological Seminary.</h1>
        <p className="lede" style={{ marginTop: ".75rem", maxWidth: "52ch" }}>
          One page. No fee. Use <b>Save &amp; finish later</b> and we will email
          you a private link back to this form.
        </p>

        {loaderData.resumed && !saved && (
          <p className="form-ok" style={{ marginTop: "1.25rem" }}>
            Welcome back — we loaded your saved answers.
          </p>
        )}
        {saved && (
          <p className="form-ok" style={{ marginTop: "1.25rem" }}>
            <b>Saved.</b> Finish any time at{" "}
            <a href={saved.resumeUrl}>this link</a> — we also emailed it to you.
          </p>
        )}

        <Form
          method="post"
          className="form"
          encType="multipart/form-data"
          noValidate
          style={{ marginTop: "2rem", maxWidth: "48rem" }}
        >
          <input type="hidden" name="token" value={loaderData.token} />
          {errors._form && (
            <p className="form-error-summary" role="alert">
              {errors._form}
            </p>
          )}

          <fieldset>
            <legend>1 · About you</legend>
            <div className="form-grid">
              <Field label="Full name" name="fullName" required error={errors.fullName}>
                <input id="f-fullName" name="fullName" required defaultValue={val("fullName")} />
              </Field>
              <Field label="Email" name="email" required error={errors.email}>
                <input id="f-email" name="email" type="email" required defaultValue={val("email")} />
              </Field>
              <Field label="Phone" name="phone" required error={errors.phone}>
                <input id="f-phone" name="phone" type="tel" required defaultValue={val("phone")} />
              </Field>
              <Field label="Date of birth" name="dateOfBirth" error={errors.dateOfBirth}>
                <input id="f-dateOfBirth" name="dateOfBirth" type="date" defaultValue={val("dateOfBirth")} />
              </Field>
              <div className="field full">
                <Field label="Mailing address" name="address" error={errors.address}>
                  <input id="f-address" name="address" defaultValue={val("address")} />
                </Field>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>2 · Your church</legend>
            <p className="legend-note">
              Your application needs a letter from your pastor. Attach it here or
              have them email it to {site.email}.
            </p>
            <div className="form-grid">
              <Field label="Home church" name="homeChurch" required error={errors.homeChurch}>
                <input id="f-homeChurch" name="homeChurch" required defaultValue={val("homeChurch")} />
              </Field>
              <Field label="Pastor's name" name="pastorName" required error={errors.pastorName}>
                <input id="f-pastorName" name="pastorName" required defaultValue={val("pastorName")} />
              </Field>
              <Field label="Pastor's email" name="pastorEmail" error={errors.pastorEmail}>
                <input id="f-pastorEmail" name="pastorEmail" type="email" defaultValue={val("pastorEmail")} />
              </Field>
              <Field label="Pastor's phone" name="pastorPhone" error={errors.pastorPhone}>
                <input id="f-pastorPhone" name="pastorPhone" type="tel" defaultValue={val("pastorPhone")} />
              </Field>
              {loaderData.uploadsEnabled ? (
                <div className="field full">
                  <Field
                    label="Pastor's letter (optional)"
                    name="pastorLetter"
                    hint="PDF, image, or Word document, under 5 MB."
                    error={errors.pastorLetter}
                  >
                    <input
                      id="f-pastorLetter"
                      name="pastorLetter"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </Field>
                </div>
              ) : (
                <p className="field full legend-note" style={{ margin: 0 }}>
                  Have your pastor email the letter to {site.email}.
                </p>
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend>3 · Program</legend>
            <div className="form-grid">
              <Field label="Program" name="program" required error={errors.program}>
                <select id="f-program" name="program" required defaultValue={val("program")}>
                  <option value="">Choose a program</option>
                  {programs.map((p) => (
                    <option key={p.slug} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Campus" name="campus" required error={errors.campus}>
                <select id="f-campus" name="campus" required defaultValue={val("campus")}>
                  <option value="">Choose a campus</option>
                  {CAMPUSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Start term" name="startTerm" error={errors.startTerm}>
                <input id="f-startTerm" name="startTerm" placeholder="e.g. Fall 2026" defaultValue={val("startTerm")} />
              </Field>
              <Field label="Current ministry role" name="ministryRole" error={errors.ministryRole}>
                <input id="f-ministryRole" name="ministryRole" defaultValue={val("ministryRole")} />
              </Field>
              <div className="field full">
                <Field label="Education so far" name="education" error={errors.education}>
                  <textarea id="f-education" name="education" defaultValue={val("education")} />
                </Field>
              </div>
              <div className="field full">
                <Field
                  label="Your call to ministry"
                  name="testimony"
                  hint="A few sentences on why you are applying."
                  error={errors.testimony}
                >
                  <textarea id="f-testimony" name="testimony" defaultValue={val("testimony")} />
                </Field>
              </div>
            </div>
          </fieldset>

          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
            <label>
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <Turnstile siteKey={loaderData.turnstileSiteKey} />

          <div className="form-actions">
            <button
              className="btn btn--brass"
              type="submit"
              name="intent"
              value="submit"
              disabled={busy}
            >
              {busy && pendingIntent === "submit" ? "Submitting…" : "Submit application"}
            </button>
            <button
              className="btn btn--ghost"
              type="submit"
              name="intent"
              value="save"
              formNoValidate
              disabled={busy}
            >
              {busy && pendingIntent === "save" ? "Saving…" : "Save & finish later"}
            </button>
          </div>
        </Form>
      </div>
    </section>
  );
}
