// src/components/ProjectModal.jsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/* Small helper: keydown listener while modal is open */
function useKeyDown(active, handler) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => handler(e);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, handler]);
}

export default function ProjectModal({ open, onClose, project = {} }) {
  // Lock page scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflowY;
    document.documentElement.style.overflowY = "hidden";
    return () => {
      document.documentElement.style.overflowY = prev || "";
    };
  }, [open]);

  // Build media list (fallback to cover if no explicit media)
  const media = useMemo(() => {
    if (Array.isArray(project.media) && project.media.length) return project.media;
    if (project.cover) return [{ type: "image", src: project.cover, caption: project.title }];
    return [];
  }, [project]);

  const [idx, setIdx] = useState(0);
  useEffect(() => { if (open) setIdx(0); }, [open, project?.id]);

  // Keyboard controls
  useKeyDown(open, (e) => {
    if (e.key === "Escape") onClose?.();
    if (media.length > 1 && e.key === "ArrowRight") setIdx((i) => (i + 1) % media.length);
    if (media.length > 1 && e.key === "ArrowLeft")  setIdx((i) => (i - 1 + media.length) % media.length);
  });

  if (!open) return null;

  // Text sections (safe fallbacks)
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

  const overlay = (
    <AnimatePresence>
      <motion.div
        className="modalOverlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modalCard"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} details`}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="modalHead">
            <div className="modalTitleWrap">
              <h3 className="modalTitle">{project.title}</h3>
              {project.subtitle && <p className="modalSubtitle">{project.subtitle}</p>}
            </div>
            <button className="modalClose" aria-label="Close" onClick={onClose}>×</button>
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
                    >
                      ‹
                    </button>
                    <button
                      className="galleryArrow right"
                      aria-label="Next media"
                      onClick={() => setIdx((i) => (i + 1) % media.length)}
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
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              )}

              <Section title="Challenge" body={challenge} />
              <Section title="Roadmap" body={roadmap} />
              <Section title="Results"  body={results}  />

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
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
}

/* ---------- helpers ---------- */

function MediaFrame({ item }) {
  if (!item) return null;

  const common = { style: { width: "100%", height: "min(60vh, 560px)", objectFit: "cover", display: "block" } };

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
  // Accept string or multiline string (turn bullet-like lines into a list)
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
