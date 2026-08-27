import type { Route } from "./+types/privacy";
import { site } from "~/data/site";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Privacy — Florida Theological Seminary" }];
}

export default function Privacy() {
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: "44rem" }}>
        <p className="eyebrow">Privacy</p>
        <h1>How we handle your information.</h1>

        <h3 style={{ marginTop: "2rem" }}>What we collect</h3>
        <p>
          When you submit an inquiry, a sponsorship request, or an application on
          this site, we collect the information you enter — such as your name,
          contact details, home church, and program of interest — and any files
          you choose to attach.
        </p>

        <h3 style={{ marginTop: "1.5rem" }}>How we use it</h3>
        <p>
          It is used solely to respond to you and to process your request with
          the seminary registrar. We do not sell it or use it for advertising.
        </p>

        <h3 style={{ marginTop: "1.5rem" }}>Who it is shared with</h3>
        <p>
          Submissions are stored on infrastructure operated by Cloudflare and are
          accessible only to seminary staff. We use Resend to deliver
          notification email and Cloudflare Turnstile to screen out automated
          spam. We share your information with no one else.
        </p>

        <h3 style={{ marginTop: "1.5rem" }}>Retention and access</h3>
        <p>
          Inquiry and application records are kept for as long as needed to serve
          you and to meet the seminary&rsquo;s recordkeeping needs. To ask what
          we hold about you, to correct it, or to have it deleted, write to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
          <a href={site.phone.href}>{site.phone.display}</a>.
        </p>

        <p style={{ marginTop: "1.5rem", color: "var(--muted)" }}>
          {site.legalName}, {site.address.street}, {site.address.city},{" "}
          {site.address.state} {site.address.zip}.
        </p>
      </div>
    </section>
  );
}
