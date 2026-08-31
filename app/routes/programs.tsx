import { Link } from "react-router";
import type { Route } from "./+types/programs";
import { programs } from "~/data/programs";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Programs — Florida Theological Seminary" },
    {
      name: "description",
      content:
        "Five courses of study: Adult Bible Studies, Biblical Studies, Christian Education, Theology, and Master's & Doctorate. Evenings and weekends, no application fee.",
    },
  ];
}

export default function Programs() {
  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Courses of study</p>
          <h1>
            Five programs.
            <br />
            One <em>aim.</em>
          </h1>
          <p className="lede">
            Every track ends in the same place: a student who can open the Word
            before a congregation and handle it rightly. Where you begin depends
            only on where you stand today. Evenings and weekends, no application
            fee, four campuses.
          </p>
        </div>
      </header>

      <section className="band">
        <div className="wrap">
          <div className="ledger">
            {programs.map((p) => (
              <article
                key={p.slug}
                className="ledger-row"
                style={p.featured ? { background: "rgba(199,154,63,.07)" } : undefined}
              >
                <div>
                  <span className="track">{p.track}</span>
                  <span className="sub">{p.credential}</span>
                </div>
                <div>
                  <h2>{p.name}</h2>
                  <p>{p.description}</p>
                  <div className="courses">
                    {p.courses.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                </div>
                <div className="spec">
                  <div className="line">
                    <span className="k">Length</span>
                    <span className="v">{p.length}</span>
                  </div>
                  <div className="line">
                    <span className="k">Meets</span>
                    <span className="v">{p.meets}</span>
                  </div>
                  <div className="line">
                    <span className="k">Campuses</span>
                    <span className="v">{p.campuses}</span>
                  </div>
                  <Link
                    to="/admissions/apply"
                    style={{
                      display: "inline-block",
                      marginTop: "1rem",
                      fontFamily: "var(--util)",
                      textTransform: "uppercase",
                      letterSpacing: ".15em",
                      fontSize: ".8rem",
                      fontWeight: 600,
                      color: "var(--ink)",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--brass)",
                      paddingBottom: "2px",
                    }}
                  >
                    Apply to this track &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "2.5rem",
              flexWrap: "wrap",
            }}
          >
            <Link className="btn btn--ink" to="/admissions/apply">
              Start your application
            </Link>
            <Link className="btn btn--ghost" to="/admissions">
              Tuition &amp; catalog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
