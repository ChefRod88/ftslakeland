import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Announce } from "~/components/Announce";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";

/** Reveal-on-scroll for elements with `.rev`, matching the original site. */
function useScrollReveal() {
  const location = useLocation();
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(document.querySelectorAll<HTMLElement>(".rev"));
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [location.pathname]);
}

export default function SiteLayout() {
  useScrollReveal();
  return (
    <>
      <Announce />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
