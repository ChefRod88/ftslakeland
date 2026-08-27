import type { Route } from "./+types/programs";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Programs — Florida Theological Seminary" },
    {
      name: "description",
      content:
        "Five courses of study: Adult Bible Studies, Biblical Studies, Christian Education, Theology, and Master's & Doctorate.",
    },
  ];
}

export default function Programs() {
  return (
    <section className="band">
      <div className="wrap">
        <p className="eyebrow">Courses of study</p>
        <h1>Five programs. One aim.</h1>
        <p className="lede" style={{ marginTop: "1rem", maxWidth: "44ch" }}>
          Full program detail is being brought over from the design. For now, the
          registrar can walk you through any track by phone.
        </p>
      </div>
    </section>
  );
}
