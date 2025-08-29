import React from "react";

export default function ContactSection() {
  return (
    <section className="contactSection anchorSection" aria-label="Contact">
      <div className="contactCard glass">
        <h2 className="contactTitle">
          Let’s <span className="accent">build</span> something
        </h2>
        <p className="contactSub">
          Quick intro? I usually reply within 24–48 hours.
        </p>

        <div className="contactCTA">
          <a className="ctaPrimary" href="mailto:yamal.elshot@hotmail.com">
            Email me
          </a>
          <a
            className="ctaGhost"
            href="www.linkedin.com/in/yamal-elshot-aa0129332"
            target="_blank"
            rel="noreferrer"
          >
            Connect on LinkedIn
          </a>
        </div>

        <div className="socialRow" role="list" aria-label="Social links">
          <a role="listitem" aria-label="GitHub"
             href="https://github.com/Yamal-0930744" target="_blank" rel="noreferrer" className="social">
            {/* GitHub icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A12 12 0 0 0 0 12.7c0 5.4 3.5 10 8.2 11.7.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.5-1.4-1.9-1.4-1.9-1.2-.8.1-.8.1-.8 1.3.1 2 .  1.3 2 .  1.3 1.2 2.2 3.1 1.6 3.8 1.2.1-.9.5-1.6.9-2-2.6-.3-5.4-1.4-5.4-6.2 0-1.4.5-2.6 1.3-3.5-.1-.3-.6-1.6.1-3.3 0 0 1.1-.4 3.6 1.3a12 12 0 0 1 6.5 0c2.5-1.7 3.6-1.3 3.6-1.3.7 1.7.2 3 .1 3.3.8.9 1.3 2.1 1.3 3.5 0 4.8-2.8 5.9-5.4 6.2.5.4.9 1.2.9 2.5v3.7c0 .3.2.7.8.6A12 12 0 0 0 24 12.7 12 12 0 0 0 12 .5z"/></svg>
          </a>
          <a role="listitem" aria-label="LinkedIn"
             href="https://www.linkedin.com/in/yamal-elshot-aa0129332" target="_blank" rel="noreferrer" className="social">
            {/* LinkedIn icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.84-2.05 3.78-2.05C19.88 8 22 10.1 22 14.06V23h-4v-7.9c0-1.88-.03-4.3-2.62-4.3-2.62 0-3.02 2.05-3.02 4.17V23h-4V8z"/></svg>
          </a>
          <a role="listitem" aria-label="Email" href="mailto:yamal.elshot@hotmail.com" className="social">
            {/* Mail icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/></svg>
          </a>
        </div>
      </div>

      <p className="copyright">© {new Date().getFullYear()} Yamal</p>
    </section>
  );
}
