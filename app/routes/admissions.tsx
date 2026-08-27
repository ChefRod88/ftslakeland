import { Link } from "react-router";
import type { Route } from "./+types/admissions";
import { admissionSteps, faq, tuition } from "~/data/admissions";
import { site } from "~/data/site";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Admissions — Florida Theological Seminary" },
    {
      name: "description",
      content:
        "There is no application fee. Tuition is deliberately kept low. The registrar will call you if anything is missing.",
    },
  ];
}

export default function Admissions() {
  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Admissions &middot; Fall 2026</p>
          <h1>
            If you are called, cost
            <br />
            should not keep you out.
          </h1>
          <p className="lede">
            Tuition is deliberately kept low, there is no application fee, and the
            registrar will call you if anything is missing.
          </p>
          <p style={{ marginTop: "1.75rem" }}>
            <Link className="btn btn--brass" to="/admissions/apply">
              Begin your application
            </Link>
          </p>
        </div>
      </header>

      <section className="band">
        <div className="wrap">
          <p className="eyebrow">What happens after you apply</p>
          <div className="steps" style={{ marginTop: "1.5rem" }}>
            {admissionSteps.map((s) => (
              <div key={s.title} className="step">
                <span className="n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(2rem,5vw,3.5rem)",
              marginTop: "clamp(2.5rem,6vw,4rem)",
              borderTop: "1px solid var(--bone-2)",
              paddingTop: "clamp(2rem,4vw,3rem)",
            }}
          >
            <div>
              <h2 style={{ fontSize: "clamp(1.6rem,3vw,2rem)" }}>
                Tuition, plainly
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: ".85rem",
                  margin: ".5rem 0 1rem",
                }}
              >
                Figures for the 2026&ndash;27 year. Placeholder pending final
                board approval.
              </p>
              {tuition.map((t) => (
                <div key={t.label} className="tuition-row">
                  <span>{t.label}</span>
                  <span className={`amt${t.none ? " amt--none" : ""}`}>
                    {t.amount}
                  </span>
                </div>
              ))}
              <p
                style={{
                  marginTop: "1rem",
                  fontSize: ".95rem",
                  color: "var(--muted)",
                  fontWeight: 300,
                }}
              >
                Church-sponsored students may be invoiced directly to the
                congregation. Ask {site.registrarName} about the bivocational
                payment plan.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "clamp(1.6rem,3vw,2rem)", marginBottom: "1rem" }}>
                Common questions
              </h2>
              <div className="faq">
                {faq.map((item, i) => (
                  <details key={item.q} open={i === 2}>
                    <summary>{item.q}</summary>
                    <p className="answer">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link className="btn btn--ink" to="/admissions/apply">
              Start your application
            </Link>
            <a className="btn btn--ghost" href={`mailto:${site.email}`}>
              Ask the registrar
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
