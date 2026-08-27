import { Link } from "react-router";
import type { Route } from "./+types/accreditation";
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

export default function Accreditation() {
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
          <p style={{ marginTop: "1.75rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(2rem,5vw,3rem)",
              marginTop: "clamp(2.5rem,6vw,3.5rem)",
            }}
          >
            <div>
              <h2 style={{ fontSize: "clamp(1.6rem,3vw,2rem)", marginBottom: "1rem" }}>
                If you are already enrolled
              </h2>
              <p style={{ color: "#3B4150", fontWeight: 300 }}>
                Nothing you have completed is lost. Coursework taken before 2026
                is being recorded against the accredited transcript, and the
                registrar is contacting current students by campus.
              </p>
            </div>
            <div style={{ background: "var(--oxblood)", color: "#F7ECE4", padding: "clamp(1.75rem,4vw,2.25rem)" }}>
              <h2 style={{ fontSize: "clamp(1.5rem,2.6vw,1.8rem)", color: "#fff", marginBottom: ".75rem" }}>
                For pastors and supporting churches
              </h2>
              <p style={{ fontWeight: 300, color: "rgba(247,236,228,.85)", marginBottom: "1.25rem" }}>
                Send us the names of members you have been training informally.
                Accredited standing means their study now counts toward a
                credential your association will recognize.
              </p>
              <a
                className="btn btn--brass"
                href={`mailto:${site.email}?subject=Church-sponsored%20students`}
              >
                Talk to the registrar
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
