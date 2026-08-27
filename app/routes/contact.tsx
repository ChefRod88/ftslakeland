import { Form, useNavigation } from "react-router";
import type { Route } from "./+types/contact";
import { cloudflare } from "~/context";
import { Field, Turnstile } from "~/components/form";
import { processInquiry } from "~/lib/forms.server";
import { site } from "~/data/site";
import { CAMPUSES } from "~/lib/validation";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Contact — Florida Theological Seminary" }];
}

export function loader({ context }: Route.LoaderArgs) {
  const { env } = context.get(cloudflare);
  return { turnstileSiteKey: env.TURNSTILE_SITE_KEY };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { env } = context.get(cloudflare);
  return processInquiry(request, env, "contact");
}

export default function Contact({ loaderData, actionData }: Route.ComponentProps) {
  const nav = useNavigation();
  const submitting = nav.state === "submitting";

  if (actionData?.ok) {
    return (
      <section className="band">
        <div className="wrap">
          <div className="form-ok">
            <p className="eyebrow">Contact</p>
            <h2>Your message is on its way.</h2>
            <p>
              The registrar has it and will reply by email or phone. If it is
              urgent, call <a href={site.phone.href}>{site.phone.display}</a>.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const errors = actionData?.ok === false ? actionData.errors : {};
  const values = actionData?.ok === false ? actionData.values : {};

  return (
    <section className="band">
      <div className="wrap">
        <p className="eyebrow">Contact</p>
        <h1>Write, call, or visit.</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: "clamp(2rem,6vw,4rem)",
            marginTop: "2rem",
            alignItems: "start",
          }}
        >
          <address style={{ fontStyle: "normal", lineHeight: 2 }}>
            {site.address.street}
            <br />
            {site.address.city}, {site.address.state} {site.address.zip}
            <br />
            <a href={site.phone.href}>{site.phone.display}</a>
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <br />
            <br />
            <span style={{ color: "var(--muted)", fontSize: ".9rem" }}>
              Registrar: {site.registrarName}
            </span>
          </address>

          <Form method="post" className="form" noValidate>
            {errors._form && (
              <p className="form-error-summary" role="alert">
                {errors._form}
              </p>
            )}
            <div className="form-grid">
              <Field label="Name" name="name" required error={errors.name}>
                <input id="f-name" name="name" required defaultValue={values.name} />
              </Field>
              <Field label="Email" name="email" required error={errors.email}>
                <input
                  id="f-email"
                  name="email"
                  type="email"
                  required
                  defaultValue={values.email}
                />
              </Field>
              <Field label="Phone" name="phone" error={errors.phone}>
                <input id="f-phone" name="phone" type="tel" defaultValue={values.phone} />
              </Field>
              <Field label="Home church" name="homeChurch" error={errors.homeChurch}>
                <input
                  id="f-homeChurch"
                  name="homeChurch"
                  defaultValue={values.homeChurch}
                />
              </Field>
              <Field label="Nearest campus" name="campus" error={errors.campus}>
                <select id="f-campus" name="campus" defaultValue={values.campus ?? ""}>
                  <option value="">No preference</option>
                  {CAMPUSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Program of interest" name="program" error={errors.program}>
                <input id="f-program" name="program" defaultValue={values.program} />
              </Field>
              <div className="field full">
                <Field label="Message" name="message" error={errors.message}>
                  <textarea
                    id="f-message"
                    name="message"
                    defaultValue={values.message}
                  />
                </Field>
              </div>
            </div>

            {/* honeypot */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
              <label>
                Company
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <Turnstile siteKey={loaderData.turnstileSiteKey} />

            <div className="form-actions">
              <button className="btn btn--ink" type="submit" disabled={submitting}>
                {submitting ? "Sending…" : "Send message"}
              </button>
              <span className="form-note">
                We reply by email or phone, usually within two business days.
              </span>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
}
