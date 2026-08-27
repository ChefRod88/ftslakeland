import type { Route } from "./+types/history";
import { markBold, timeline } from "~/data/timeline";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Our History — Florida Theological Seminary" },
    {
      name: "description",
      content:
        "1901 to 2026. Fire took the dormitory in 1921 and the academic building a few years later. The classes never stopped.",
    },
  ];
}

export default function History() {
  return (
    <div style={{ background: "var(--ink-3)", color: "var(--bone)" }}>
      <header className="page-hero page-hero--center" style={{ background: "transparent" }}>
        <div className="wrap">
          <p className="eyebrow">1901 &mdash; 2026 &middot; One hundred twenty-five years</p>
          <h1>
            Twice the buildings burned.
            <br />
            <em>The classes never stopped.</em>
          </h1>
          <p className="lede">
            Fire took the dormitory in 1921 and the academic building a few years
            later. For eleven years the seminary met in the sanctuaries of
            Harmony Baptist and St. Paul Baptist, because the work was never the
            building.
          </p>
        </div>
      </header>

      <section style={{ paddingBottom: "clamp(4rem,8vw,6rem)" }}>
        <div className="wrap">
          <div className="timeline">
            {timeline.map((e) => (
              <div key={e.year} className={`timeline-row timeline-row--${e.kind}`}>
                <span className="timeline-yr">{e.year}</span>
                <div>
                  <p className="ev">
                    {markBold(e.body).map((seg, i) =>
                      seg.bold ? <b key={i}>{seg.text}</b> : <span key={i}>{seg.text}</span>,
                    )}
                  </p>
                  {e.imagePlaceholder && (
                    <div className="img-placeholder" style={{ marginTop: "1rem" }}>
                      {e.imagePlaceholder}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--ink-2)", textAlign: "center", paddingBlock: "clamp(4rem,8vw,6rem)" }}>
        <div className="wrap">
          <p
            style={{
              fontFamily: "var(--display)",
              fontStyle: "italic",
              fontSize: "clamp(1.5rem,3.4vw,2rem)",
              lineHeight: 1.44,
              color: "#fff",
              maxWidth: "26ch",
              margin: "0 auto",
            }}
          >
            Study to shew thyself approved unto God, a workman that needeth not be
            ashamed.
          </p>
          <cite
            style={{
              display: "block",
              marginTop: "1.6rem",
              fontStyle: "normal",
              fontFamily: "var(--util)",
              textTransform: "uppercase",
              letterSpacing: ".26em",
              fontSize: ".85rem",
              color: "var(--brass)",
            }}
          >
            II Timothy 2:15
          </cite>
        </div>
      </section>
    </div>
  );
}
