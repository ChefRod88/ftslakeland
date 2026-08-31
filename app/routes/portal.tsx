import { Link } from "react-router";
import type { Route } from "./+types/portal";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Student Portal — Florida Theological Seminary" }];
}

export default function Portal() {
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: "44rem" }}>
        <p className="eyebrow">Student Portal</p>
        <h1>Coming soon.</h1>
        <p className="lede" style={{ marginTop: "1rem" }}>
          The logged-in portal — course schedule, grades and transcript, tuition
          account, and registration — is being built. Until it is ready, the
          registrar handles these by phone and email.
        </p>
        <p style={{ marginTop: "1.5rem" }}>
          <a className="btn btn--ghost" href="tel:8636833879">
            Call the registrar
          </a>{" "}
          <Link className="btn btn--ghost" to="/admissions">
            Admissions
          </Link>
        </p>
      </div>
    </section>
  );
}
