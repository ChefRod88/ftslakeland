import type { Route } from "./+types/give";
import { site } from "~/data/site";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Give — Florida Theological Seminary" },
    {
      name: "description",
      content:
        "Support Florida Theological Seminary. Gifts keep tuition within reach of bivocational ministers and cover classrooms, books, and faculty.",
    },
  ];
}

export default function Give() {
  return (
    <section className="band give">
      <div className="wrap">
        <p className="eyebrow eyebrow--c">Support the seminary</p>
        <h1>Every pastor trained here was paid for by someone.</h1>
        <p>
          Tuition covers less than half of what it costs to teach a student. The
          rest has always come from churches and members who decided a called man
          or woman should not be turned away for want of a credit hour.
          {" "}
          {site.legalName} is a 501(c)(3); gifts are tax-deductible.
        </p>
        <a className="btn btn--brass" href={site.giveUrl}>
          Make a gift
        </a>
      </div>
    </section>
  );
}
