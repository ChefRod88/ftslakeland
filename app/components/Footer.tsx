import { Link } from "react-router";
import { images, site } from "~/data/site";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <img src={images.seal} alt="Seal of Florida Theological Seminary and Bible College" />
            <p>
              {site.legalName} Preparing the called for ministry since{" "}
              {site.founded}.
            </p>
          </div>
          <div>
            <h4>Academics</h4>
            <ul>
              <li><Link to="/programs">Adult Bible Studies</Link></li>
              <li><Link to="/programs">Biblical Studies</Link></li>
              <li><Link to="/programs">Christian Education</Link></li>
              <li><Link to="/programs">Theology</Link></li>
              <li><Link to="/programs">Master&rsquo;s &amp; Doctorate</Link></li>
            </ul>
          </div>
          <div>
            <h4>Students</h4>
            <ul>
              <li><Link to="/admissions/apply">Apply</Link></li>
              <li><Link to="/admissions">Course catalog</Link></li>
              <li><Link to="/admissions">Fall 2026 schedule</Link></li>
              <li><Link to="/programs">Degree requirements</Link></li>
              <li><Link to="/portal">Student portal</Link></li>
            </ul>
          </div>
          <div>
            <h4>Visit or write</h4>
            <address>
              {site.address.street}
              <br />
              {site.address.city}, {site.address.state} {site.address.zip}
              <br />
              <a href={site.phone.href}>{site.phone.display}</a>
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </address>
          </div>
        </div>
        <div className="foot-bar">
          <span>
            &copy; {site.accreditedYear} {site.legalName}
          </span>
          <div className="social">
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
