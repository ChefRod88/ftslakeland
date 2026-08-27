import { Link } from "react-router";
import type { Route } from "./+types/admissions";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Admissions — Florida Theological Seminary" },
    {
      name: "description",
      content:
        "There is no application fee. Tuition is deliberately kept low. Classes begin in the fall.",
    },
  ];
}

export default function Admissions() {
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: "52rem" }}>
        <p className="eyebrow">Admissions &middot; Fall 2026</p>
        <h1>If you are called, cost should not keep you out.</h1>
        <p className="lede" style={{ marginTop: "1rem" }}>
          Tuition is deliberately kept low, there is no application fee, and the
          registrar will call you if anything is missing.
        </p>
        <p style={{ marginTop: "1.5rem" }}>
          <Link className="btn btn--brass" to="/admissions/apply">
            Begin your application
          </Link>
        </p>
      </div>
    </section>
  );
}
