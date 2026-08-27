import type { Route } from "./+types/accreditation";
import { site } from "~/data/site";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Accreditation — Florida Theological Seminary" },
    {
      name: "description",
      content:
        "As of 2026, Florida Theological Seminary and Bible College is an accredited institution.",
    },
  ];
}

export default function Accreditation() {
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: "52rem" }}>
        <p className="eyebrow">Accredited 2026</p>
        <h1>We are now an accredited institution.</h1>
        <p className="lede" style={{ marginTop: "1rem" }}>
          After a full review of our curriculum, faculty credentials, and student
          outcomes, {site.legalName} has been granted accreditation by{" "}
          <span className="tbc">{site.accreditingBody}</span>. It does not change
          our commitment to rightly dividing the Word. It changes who else has to
          recognize it.
        </p>
      </div>
    </section>
  );
}
