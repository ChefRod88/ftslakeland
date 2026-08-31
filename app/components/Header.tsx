import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { images, primaryNav } from "~/data/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`masthead${stuck ? " is-stuck" : ""}`} id="masthead">
      <div className="wrap">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <img src={images.logo} alt="Florida Theological Seminary and Bible College" />
          <span className="brand-txt">
            <span className="n">Florida Theological Seminary</span>
            <span className="s">&amp; Bible College &middot; Est. 1901</span>
          </span>
        </Link>

        <nav className={`nav${open ? " open" : ""}`} id="nav">
          {primaryNav.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <Link
            className="btn btn--brass"
            to="/admissions/apply"
            onClick={() => setOpen(false)}
          >
            Apply
          </Link>
        </nav>

        <button
          className="burger"
          id="burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
