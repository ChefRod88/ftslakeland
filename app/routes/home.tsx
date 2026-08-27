import { Link } from "react-router";
import type { Route } from "./+types/home";
import { images } from "~/data/site";

export function meta(_: Route.MetaArgs) {
  return [
    {
      title:
        "Florida Theological Seminary and Bible College — Preparing the Called for Ministry",
    },
    {
      name: "description",
      content:
        "Founded 1901 in Lakeland, Florida. Now accredited. Florida Theological Seminary and Bible College trains pastors, Christian educators, and missionaries across the South.",
    },
  ];
}

export default function Home() {
  return (
    <>
      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow rev">Founded 1901 &middot; Lakeland, Florida</p>
            <h1 className="rev d1">
              Preparing the called
              <br />
              for <em>ministry.</em>
            </h1>
            <p className="hero-sub rev d2">
              For one hundred and twenty-five years, this seminary has trained
              pastors, Christian educators, and missionaries for the churches of
              Florida and the South. As of 2026, that training is accredited.
            </p>
            <div className="hero-cta rev d3">
              <Link className="btn btn--brass" to="/admissions/apply">
                Apply for Fall 2026
              </Link>
              <Link className="btn btn--outline" to="/programs">
                Explore programs
              </Link>
            </div>
            <div className="hero-facts rev d4">
              <div className="fact">
                <span className="k">1901</span>
                <span className="v">Year founded</span>
              </div>
              <div className="fact">
                <span className="k">4</span>
                <span className="v">Florida campuses</span>
              </div>
              <div className="fact">
                <span className="k">5</span>
                <span className="v">Courses of study</span>
              </div>
              <div className="fact">
                <span className="k">2026</span>
                <span className="v">Accredited</span>
              </div>
            </div>
          </div>
          <div className="hero-art rev d2">
            <div className="frame">
              <span className="frame-off"></span>
              <img
                src={images.sanctuary}
                alt="The sanctuary altar where classes have been held since 1901"
              />
            </div>
            <img
              className="seal"
              src={images.seal}
              alt="Seal of Florida Theological Seminary and Bible College"
            />
          </div>
        </div>
      </section>

      <section className="band accred" id="accreditation">
        <div className="wrap">
          <div className="accred-head">
            <div className="rev">
              <p className="eyebrow">Accredited 2026</p>
              <h2>
                What accreditation
                <br />
                changes for you.
              </h2>
            </div>
            <p className="lede rev d1">
              Accreditation by <span className="tbc">[accrediting body]</span> is
              an outside review of how we teach, who we hire, and what a degree
              from this seminary is worth. It does not change our commitment to
              rightly dividing the Word of God. It changes who else has to
              recognize it.
            </p>
          </div>
          <div className="accred-grid">
            <div className="accred-cell rev">
              <span className="no">Recognition</span>
              <h3>Your degree travels</h3>
              <p>
                Credentialing boards, denominational bodies, and chaplaincy
                programs recognize coursework from accredited institutions. Your
                transcript now carries that weight outside our walls.
              </p>
            </div>
            <div className="accred-cell rev d1">
              <span className="no">Continuation</span>
              <h3>A path to further study</h3>
              <p>
                Students who complete a program here are positioned to continue
                toward graduate work elsewhere, without repeating what they have
                already mastered.
              </p>
            </div>
            <div className="accred-cell rev d2">
              <span className="no">Assurance</span>
              <h3>A reviewed standard</h3>
              <p>
                Curriculum, faculty credentials, and student outcomes are now
                measured against a published standard and reviewed on a fixed
                cycle. The rigor is documented, not asserted.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="band programs" id="programs">
        <div className="wrap">
          <div className="programs-head">
            <div className="rev">
              <p className="eyebrow">Courses of study</p>
              <h2>Five programs. One aim.</h2>
            </div>
            <p className="lede rev d1">
              Whether you are a deacon studying at night, a licensed minister
              preparing to pastor, or a doctor of ministry already serving a
              congregation, there is a track built for where you stand.
            </p>
          </div>
          <div className="prog-list">
            {[
              {
                track: "Foundational",
                name: "Adult Bible Studies",
                desc: "For church members who want to read Scripture with confidence. No prior study required.",
                d: "",
              },
              {
                track: "Undergraduate",
                name: "Biblical Studies",
                desc: "Book-by-book work in the Old and New Testaments, with hermeneutics and exegesis.",
                d: "d1",
              },
              {
                track: "Undergraduate",
                name: "Christian Education",
                desc: "For superintendents, youth directors, and anyone who carries a teaching ministry.",
                d: "d1",
              },
              {
                track: "Undergraduate",
                name: "Theology",
                desc: "Doctrine, church history, and homiletics for licensed ministers preparing to preach.",
                d: "d2",
              },
              {
                track: "Graduate",
                name: "Master’s & Doctorate",
                desc: "Advanced study for credentialed ministers already leading a congregation or ministry.",
                d: "d2",
              },
            ].map((p) => (
              <Link
                key={p.name}
                className={`prog rev ${p.d}`.trim()}
                to="/programs"
              >
                <span className="prog-track">{p.track}</span>
                <span className="prog-name">{p.name}</span>
                <span className="prog-desc">{p.desc}</span>
                <span className="prog-go">View program &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band legacy" id="legacy">
        <div className="wrap">
          <div className="legacy-head rev">
            <p className="eyebrow">Since 1901</p>
            <h2>
              Twice the buildings burned.
              <br />
              <span>The classes never stopped.</span>
            </h2>
            <p className="lede">
              Fire took the dormitory in 1921 and the academic building a few
              years later. For eleven years the seminary met in the sanctuaries
              of Harmony Baptist and St. Paul Baptist, because the work was never
              the building.
            </p>
          </div>
        </div>
        <div className="wrap rail-outer rev d1">
          <div
            className="rail"
            tabIndex={0}
            aria-label="Timeline of the seminary, 1901 to 2026"
          >
            {[
              { yr: "1901", mod: "", ev: <>Organized in October at <b>Providence Baptist Church</b> in Bartow, under the South Florida Association, as Florida Baptist Seminary.</> },
              { yr: "1902", mod: "", ev: <>Moved to <b>Lakeland</b> for a more central location, meeting in local churches while a campus was raised.</> },
              { yr: "1903–04", mod: "", ev: <>The <b>dormitory and academic buildings</b> are erected. The seminary has a home of its own.</> },
              { yr: "1921", mod: "node--fire", ev: <>The <b>dormitory burns down</b> in November. Classes move into the sanctuaries of Harmony Baptist and St. Paul Baptist.</> },
              { yr: "1925", mod: "", ev: <>The State of Florida issues a <b>charter of incorporation</b> under the name Florida Seminary.</> },
              { yr: "1927–28", mod: "node--fire", ev: <>The <b>academic building burns</b>. Teaching continues uninterrupted in borrowed pews.</> },
              { yr: "1932", mod: "", ev: <>A <b>new building rises</b> and the seminary returns to its own property after eleven years.</> },
              { yr: "Today", mod: "", ev: <>Campuses in Lakeland, <b>Dunedin, Lake City, and Jacksonville</b>. Alumni pastor churches across the South.</> },
              { yr: "2026", mod: "node--now", ev: <><b>Accreditation granted.</b> One hundred and twenty-five years of teaching, formally recognized.</> },
            ].map((n) => (
              <div key={n.yr} className={`node ${n.mod}`.trim()}>
                <span className="yr">{n.yr}</span>
                <p className="ev">{n.ev}</p>
              </div>
            ))}
          </div>
          <p className="rail-hint">Scroll the timeline &rarr;</p>
        </div>
      </section>

      <section className="band pres">
        <div className="wrap pres-grid">
          <div className="pres-photo rev">
            <img
              src={images.president}
              alt="Dr. Frank O’Harroll, Sr., President"
            />
          </div>
          <div className="rev d1">
            <p className="eyebrow">From the President</p>
            <blockquote>
              <p>
                &ldquo;We believe religious leaders need to be wise, grounded,
                and trained to teach and preach God&rsquo;s Word. Every student
                here is given attention where he or she has need, by faculty who
                will do all in their power to help them excel.&rdquo;
              </p>
            </blockquote>
            <div className="sig">
              <div className="nm">Dr. Frank O&rsquo;Harroll, Sr.</div>
              <div className="rl">President</div>
            </div>
          </div>
        </div>
      </section>

      <section className="band campus" id="campuses">
        <div className="wrap">
          <div className="rev">
            <p className="eyebrow">Where we teach</p>
            <h2>Four campuses across Florida.</h2>
          </div>
          <div className="campus-grid">
            <div className="site is-main rev">
              <span className="tag">Main campus</span>
              <h3>Lakeland</h3>
              <p>
                115 W 5th St, Lakeland, FL 33805. Administration, registrar, and
                the seminary&rsquo;s home since 1902.
              </p>
            </div>
            <div className="site rev d1">
              <span className="tag">Satellite</span>
              <h3>Dunedin</h3>
              <p>Serving Pinellas County congregations on the Gulf coast.</p>
            </div>
            <div className="site rev d2">
              <span className="tag">Satellite</span>
              <h3>Lake City</h3>
              <p>Serving North Florida churches and associations.</p>
            </div>
            <div className="site rev d3">
              <span className="tag">Satellite</span>
              <h3>Jacksonville</h3>
              <p>Serving the First Coast and Southeast Georgia.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="verse">
        <div className="wrap rev">
          <p>
            Study to shew thyself approved unto God, a workman that needeth not
            be ashamed, rightly dividing the word of truth.
          </p>
          <cite>II Timothy 2:15</cite>
        </div>
      </section>

      <section className="band admit" id="admissions">
        <div className="wrap">
          <div className="admit-head">
            <div className="rev">
              <p className="eyebrow">Admissions &middot; Fall 2026</p>
              <h2>Four steps to enroll.</h2>
            </div>
            <p className="lede rev d1">
              Tuition is deliberately kept low. If you are called, cost should
              not be what keeps you out of the classroom.
            </p>
          </div>
          <div className="steps">
            <div className="step rev">
              <span className="n">Step one</span>
              <h3>Read the catalog</h3>
              <p>
                Programs, requirements, and tuition in one document. Download it
                or ask us to mail a copy.
              </p>
            </div>
            <div className="step rev d1">
              <span className="n">Step two</span>
              <h3>Apply</h3>
              <p>
                Complete the application. There is no fee, and the registrar will
                call you if anything is missing.
              </p>
            </div>
            <div className="step rev d2">
              <span className="n">Step three</span>
              <h3>Register</h3>
              <p>
                Send your registration form to Sis. Linda Silas at{" "}
                <a href="mailto:fltheologicalseminary@gmail.com">
                  fltheologicalseminary@gmail.com
                </a>
                .
              </p>
            </div>
            <div className="step rev d3">
              <span className="n">Step four</span>
              <h3>Begin classes</h3>
              <p>
                Choose your campus and start with the Fall 2026 schedule. Classes
                meet on evenings and weekends.
              </p>
            </div>
          </div>
          <div className="admit-foot rev">
            <Link className="btn btn--ink" to="/admissions/apply">
              Start your application
            </Link>
            <Link className="btn btn--ghost" to="/admissions">
              Tuition &amp; catalog
            </Link>
            <Link className="btn btn--ghost" to="/admissions">
              Fall 2026 schedule
            </Link>
          </div>
        </div>
      </section>

      <section className="band give">
        <div className="wrap rev">
          <p className="eyebrow eyebrow--c">Support the seminary</p>
          <h2>Every pastor trained here was paid for by someone.</h2>
          <p>
            Gifts to Florida Theological Seminary keep tuition within reach of
            bivocational ministers and cover the classrooms, books, and faculty
            that a called student cannot afford alone.
          </p>
          <Link className="btn btn--brass" to="/give">
            Make a gift
          </Link>
        </div>
      </section>
    </>
  );
}
