import type { Route } from "./+types/contact";
import { site } from "~/data/site";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Contact — Florida Theological Seminary" }];
}

export default function Contact() {
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: "44rem" }}>
        <p className="eyebrow">Contact</p>
        <h1>Write, call, or visit.</h1>
        <address style={{ fontStyle: "normal", marginTop: "1.25rem", lineHeight: 1.9 }}>
          {site.address.street}
          <br />
          {site.address.city}, {site.address.state} {site.address.zip}
          <br />
          <a href={site.phone.href}>{site.phone.display}</a>
          <br />
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </address>
        <p className="lede" style={{ marginTop: "1.5rem" }}>
          A contact form that reaches the registrar directly is being added.
        </p>
      </div>
    </section>
  );
}
