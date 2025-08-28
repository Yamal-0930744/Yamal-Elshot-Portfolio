import React, { useEffect, useState } from "react";

const LINKS = [
  { id: "about",   label: "About"   },
  { id: "journey", label: "Journey" },
  { id: "work",    label: "Work"    },
  { id: "tools",   label: "Tools"   },
  { id: "contact", label: "Contact" },
];

export default function SiteHeader() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const targets = LINKS
      .map(l => document.getElementById(l.id))
      .filter(Boolean);

    const io = new IntersectionObserver(
      (entries) => {
        // pick the section with the highest intersection ratio
        const vis = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis?.target?.id) setActive(vis.target.id);
      },
      {
        // favor the center of the viewport and account for fixed header
        root: null,
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-18% 0px -56% 0px",
      }
    );

    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <header className="siteHeader" role="navigation" aria-label="Primary">
      <div className="siteHeader-inner">
        {/* brand hard-left */}
        <a href="#hero" onClick={go("hero")} className="brand" aria-label="Home">
          <span className="brandText">YEMS</span>
          <span className="brandDot">.</span>
        </a>

        {/* nav hard-right */}
        <nav className="nav">
          <ul className="navList">
            {LINKS.map(link => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  className={`navLink ${active === link.id ? "isActive" : ""}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
