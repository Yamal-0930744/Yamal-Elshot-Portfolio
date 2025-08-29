
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/* ---------- Hooks ---------- */

function useKeyDown(active, handler) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => handler(e);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, handler]);
}

/** Lock page scroll (iOS-safe): fix body, store/restore scrollY */
function useBodyScrollLock(active) {
  const scrollYRef = useRef(0);
  useEffect(() => {
    if (!active) return;

    scrollYRef.current = window.scrollY || window.pageYOffset || 0;

    const prev = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      overflowY: document.body.style.overflowY,
      width: document.body.style.width,
    };

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.position = prev.position || "";
      document.body.style.top = prev.top || "";
      document.body.style.left = prev.left || "";
      document.body.style.right = prev.right || "";
      document.body.style.width = prev.width || "";
      document.body.style.overflowY = prev.overflowY || "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [active]);
}

/** Get/create a stable portal root with a huge z-index */
function usePortalRoot(id = "modal-root") {
  const ref = useRef(null);
  useEffect(() => {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      el.style.position = "relative";
      el.style.zIndex = "2000000000";
      document.body.appendChild(el);
    } else {
      el.style.zIndex = "2000000000";
    }
    ref.current = el;
  }, [id]);
  return ref.current;
}

/* ---------- Component ---------- */

export default function ProjectModal({ open, onClose, project = {} }) {
  useBodyScrollLock(!!open);

  // Media list (fallback to cover)
  const media = useMemo(() => {
    if (Array.isArray(project.media) && project.media.length) return project.media;
    if (project.cover) return [{ type: "image", src: project.cover, caption: project.title }];
    return [];
  }, [project]);

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (open) setIdx(0);
  }, [open, project?.id]);

  // Keyboard controls (ESC, arrows)
  useKeyDown(open, (e) => {
    if (e.key === "Escape") onClose?.();
    if (media.length > 1 && e.key === "ArrowRight") setIdx((i) => (i + 1) % media.length);
    if (media.length > 1 && e.key === "ArrowLeft")  setIdx((i) => (i - 1 + media.length) % media.length);
  });

  // Safe text sections
  const challenge =
    project.sections?.challenge ??
    project.subtitle ??
    "What needed to be solved and why it mattered.";
  const roadmap =
    project.sections?.roadmap ??
    project.content ??
    "The approach: constraints, iterations, and the key technical/design choices.";
  const results =
    project.sections?.results ??
    "Impact and outcomes — metrics, learnings, next steps.";

  const current = media[idx];

  // Use a dedicated portal root
  const portalRoot = usePortalRoot();
  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="modalOverlay projectModalOverlay" // <- keep old look + new safety
          style={{
            position: "fixed",   // immune to any external overrides
            inset: 0,
            zIndex: 2000000001,
            pointerEvents: "auto",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose?.();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title || "Project"} details`}
        >
          <motion.div
            className="modalCard projectModalCard" // <- keep glass + sizing tweaks
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ pointerEvents: "auto" }}
          >
            {/* Header */}
            <div className="modalHead">
              <div className="modalTitleWrap">
                <h3 className="modalTitle">{project.title}</h3>
                {project.subtitle && <p className="modalSubtitle">{project.subtitle}</p>}
              </div>
              <button className="modalClose" aria-label="Close" onClick={onClose} type="button">
                ×
              </button>
            </div>

            {/* Body: media + info */}
            <div className="modalBody">
              {/* Media column */}
              <div className="modalGallery">
                <div className="galleryMain">
                  <div className="galleryStage">
                    <MediaFrame item={current} key={`${current?.type}-${current?.src}-${idx}`} />
                  </div>

                  {media.length > 1 && (
                    <>
                      <button
                        className="galleryArrow left"
                        aria-label="Previous media"
                        onClick={() => setIdx((i) => (i - 1 + media.length) % media.length)}
                        type="button"
                      >
                        ‹
                      </button>
                      <button
                        className="galleryArrow right"
                        aria-label="Next media"
                        onClick={() => setIdx((i) => (i + 1) % media.length)}
                        type="button"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {media.length > 1 && (
                  <div className="galleryThumbs">
                    {media.map((m, i) => (
                      <button
                        key={`${m.type}-${m.src}-${i}`}
                        className={`thumb ${i === idx ? "active" : ""}`}
                        onClick={() => setIdx(i)}
                        aria-label={`Show media ${i + 1}`}
                        type="button"
                      >
                        {m.type === "video" ? (
                          <div className="thumbVideo">▶</div>
                        ) : (
                          <img src={m.poster || m.src} alt="" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info column */}
              <div className="infoPanel" style={{ overflow: "auto" }}>
                {/* Tags row */}
                {Array.isArray(project.tags) && project.tags.length > 0 && (
                  <div className="chipsRow" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    {project.tags.slice(0, 6).map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <Section title="Challenge" body={challenge} />
                <Section title="Roadmap"   body={roadmap} />
                <Section title="Results"   body={results} />

                {/* Links */}
                {Array.isArray(project.links) && project.links.length > 0 && (
                  <div className="linkRow" style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {project.links.map((l) => (
                      <a
                        key={l.href || l.label}
                        href={l.href || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="ghostBtn"
                      >
                        {l.label || "Open"}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
}

/* ---------- helpers ---------- */

function MediaFrame({ item }) {
  if (!item) return null;

  const common = {
    style: {
      width: "100%",
      height: "min(60vh, 560px)",
      objectFit: "cover",
      display: "block",
      background: "#0b0c10",
    },
  };

  switch (item.type) {
    case "video":
      return (
        <motion.video
          key={item.src}
          {...common}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          controls
          poster={item.poster}
          src={item.src}
        />
      );
    case "embed":
      return (
        <motion.iframe
          key={item.src}
          {...common}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          src={item.src}
          title={item.caption || "Embedded media"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    default:
      return (
        <motion.img
          key={item.src}
          {...common}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          src={item.src}
          alt={item.caption || ""}
        />
      );
  }
}

function Section({ title, body }) {
  const bodyNode = Array.isArray(body)
    ? listNode(body)
    : typeof body === "string" && body.trim().includes("\n")
    ? listNode(
        body
          .split("\n")
          .map((s) => s.replace(/^\s*[-•]\s*/, "").trim())
          .filter(Boolean)
      )
    : typeof body === "string"
    ? <p style={{ margin: "6px 0 0 0", color: "#cfd3db" }}>{body}</p>
    : null;

  return (
    <div className="section" style={{ marginBottom: 14 }}>
      <h4 style={{ margin: "0 0 6px 0", letterSpacing: ".02em" }}>{title}</h4>
      {bodyNode}
    </div>
  );
}

function listNode(items) {
  return (
    <ul style={{ margin: "6px 0 0 1rem", color: "#cfd3db" }}>
      {items.map((it, i) => (
        <li key={i} style={{ margin: "2px 0" }}>
          {it}
        </li>
      ))}
    </ul>
  );
}
