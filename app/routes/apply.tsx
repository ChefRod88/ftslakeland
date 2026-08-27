import type { Route } from "./+types/apply";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Apply — Florida Theological Seminary" }];
}

export default function Apply() {
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: "44rem" }}>
        <p className="eyebrow">Application &middot; Fall 2026</p>
        <h1>Begin your application.</h1>
        <p className="lede" style={{ marginTop: "1rem" }}>
          The multi-step application form is being wired up. It will save your
          progress so you can finish later, and there is no fee.
        </p>
      </div>
    </section>
  );
}
