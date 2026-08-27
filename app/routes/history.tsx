import type { Route } from "./+types/history";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Our History — Florida Theological Seminary" },
    {
      name: "description",
      content:
        "1901 to 2026. Twice the buildings burned; the classes never stopped.",
    },
  ];
}

export default function History() {
  return (
    <section className="band">
      <div className="wrap">
        <p className="eyebrow">Since 1901</p>
        <h1>Twice the buildings burned. The classes never stopped.</h1>
        <p className="lede" style={{ marginTop: "1rem", maxWidth: "52ch" }}>
          The full 1901&ndash;2026 timeline, with the 1921 and 1927 fires, is
          being brought over from the design.
        </p>
      </div>
    </section>
  );
}
