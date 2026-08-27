import { Form, Link, useNavigation } from "react-router";
import type { Route } from "./+types/accreditation";
import { cloudflare } from "~/context";
import { Field, Turnstile } from "~/components/form";
import { processSponsorship } from "~/lib/forms.server";
import { site } from "~/data/site";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Accreditation — Florida Theological Seminary" },
    {
      name: "description",
      content:
        "As of 2026, Florida Theological Seminary and Bible College is an accredited institution. What that changes, and what it does not.",
    },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  const { env } = context.get(cloudflare);
  return { turnstileSiteKey: env.TURNSTILE_SITE_KEY };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { env } = context.get(cloudflare);
  return processSponsorship(request, env);
}

const cells = [
  {
    no: "Recognition",
    h: "Your degree travels",
    p: "Credentialing boards, denominational bodies, and chaplaincy programs recognize coursework from accredited institutions. Your transcript now carries that weight outside our walls.",
  },
  {
    no: "Continuation",
    h: "A path to further study",
    p: "Students who complete a program here are positioned to continue toward graduate work elsewhere, without repeating what they have already mastered.",
  },
  {
    no: "Assurance",
    h: "A reviewed standard",
    p: "Curriculum, faculty credentials, and student outcomes are now measured against a published standard and reviewed on a fixed cycle. The rigor is documented, not asserted.",
  },
];

export default function Accreditation({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const nav = useNavigation();
  const submitting = nav.state === "submitting";
  const errors = actionData?.ok === false ? actionData.errors : {};
  const values = actionData?.ok === false ? actionData.values : {};

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Announcement &middot; 2026</p>
          <h1>
            We are now an <em>accredited</em> institution.
          </h1>
          <p className="lede">
            After a full review of our curriculum, faculty credentials, and
            student outcomes, {site.legalName} has been granted accreditation by{" "}
            <span className="tbc">{site.accreditingBody}</span>. It does not
            change our commitment to rightly dividing the Word. It changes who
            else has to recognize it.
          </p>
          <p style={{ marginTop: "1.75rem" }}>
            <Link className="btn btn--brass" to="/admissions/apply">
              Apply for Fall 2026
            </Link>
          </p>
        </div>
      </header>

      <section className="band accred">
        <div className="wrap">
          <div className="accred-grid">
            {cells.map((c) => (
              <div key={c.no} className="accred-cell">
                <span className="no">{c.no}</span>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "clamp(2.5rem,6vw,3.5rem)",
              maxWidth: "44rem",
            }}
          >
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2rem)", marginBottom: ".5rem" }}>
              If you are already enrolled
            </h2>
            <p style={{ color: "#3B4150", fontWeight: 300 }}>
              Nothing you have completed is lost. Coursework taken before 2026 is
              being recorded against the accredited transcript, and the registrar
              is contacting current students by campus.
            </p>
          </div>
        </div>
      </section>

      <section className="band" style={{ background: "var(--oxblood)", color: "#F7ECE4" }}>
        <div className="wrap">
          <p className="eyebrow" style={{ color: "var(--brass-lt)" }}>
            For pastors and supporting churches
          </p>
          <h2 style={{ color: "#fff", maxWidth: "22ch" }}>
            Tell us who you have been training.
          </h2>
          <p style={{ fontWeight: 300, color: "rgba(247,236,228,.85)", maxWidth: "52ch" }}>
            Accredited standing means their study now counts toward a credential
            your association will recognize. Send us the names and the registrar
            will follow up.
          </p>

          {actionData?.ok ? (
            <div
              className="form-ok"
              style={{ marginTop: "1.5rem", background: "rgba(255,255,255,.1)", borderColor: "var(--brass-lt)" }}
            >
              <h2 style={{ color: "#fff" }}>Thank you.</h2>
              <p style={{ color: "rgba(247,236,228,.9)" }}>
                The registrar has your church&rsquo;s request and will be in
                touch about training your members.
              </p>
            </div>
          ) : (
            <Form method="post" className="form" noValidate style={{ marginTop: "1.75rem" }}>
              {errors._form && (
                <p className="form-error-summary" role="alert" style={{ color: "#fff", borderColor: "var(--brass-lt)" }}>
                  {errors._form}
                </p>
              )}
              <div className="form-grid">
                <Field label="Church name" name="churchName" required error={errors.churchName}>
                  <input id="f-churchName" name="churchName" required defaultValue={values.churchName} />
                </Field>
                <Field label="Your name" name="contactName" required error={errors.contactName}>
                  <input id="f-contactName" name="contactName" required defaultValue={values.contactName} />
                </Field>
                <Field label="Email" name="email" required error={errors.email}>
                  <input id="f-email" name="email" type="email" required defaultValue={values.email} />
                </Field>
                <Field label="Phone" name="phone" error={errors.phone}>
                  <input id="f-phone" name="phone" type="tel" defaultValue={values.phone} />
                </Field>
                <div className="field full">
                  <Field
                    label="Members you are training"
                    name="students"
                    hint="Names, and roughly where each is in their study."
                    error={errors.students}
                  >
                    <textarea id="f-students" name="students" defaultValue={values.students} />
                  </Field>
                </div>
                <div className="field full">
                  <Field label="Anything else" name="message" error={errors.message}>
                    <textarea id="f-message" name="message" defaultValue={values.message} />
                  </Field>
                </div>
              </div>

              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
                <label>
                  Company
                  <input name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <Turnstile siteKey={loaderData.turnstileSiteKey} />

              <div className="form-actions" style={{ borderColor: "rgba(247,236,228,.25)" }}>
                <button className="btn btn--brass" type="submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Send to the registrar"}
                </button>
              </div>
            </Form>
          )}
        </div>
      </section>
    </>
  );
}
