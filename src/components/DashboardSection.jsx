
import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import GlassContainer from "./GlassContainer";
import ProjectModal from "./ProjectModal";
import { projects } from "../data/projects";

const tints = [
  { bg: "rgba(123,227,198,0.12)", ring: "rgba(123,227,198,0.45)", glow: "rgba(123,227,198,0.35)" }, // green
  { bg: "rgba(138,180,255,0.12)", ring: "rgba(138,180,255,0.45)", glow: "rgba(138,180,255,0.35)" }, // blue
  { bg: "rgba(255,183,77,0.12)",  ring: "rgba(255,183,77,0.45)",  glow: "rgba(255,183,77,0.35)"  }, // orange
  { bg: "rgba(255,99,146,0.12)",  ring: "rgba(255,99,146,0.45)",  glow: "rgba(255,99,146,0.35)"  }, // pink
];

const PAGE_SIZE = 4;
const chunk = (arr, size) =>
  arr.reduce((pages, _, i) => (i % size ? pages : [...pages, arr.slice(i, i + size)]), []);

// Headline variants (animate per-page and with viewport)
const headParent = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(6px)",
    transition: { duration: 0.35, ease: [0.25, 1, 0.3, 1], staggerChildren: 0.04, staggerDirection: -1 },
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.04 },
  },
};
const headChild = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function DashboardSection() {
  const [active, setActive] = useState(null);
  const [page, setPage]   = useState(0);

  const sectionRef = useRef(null);
  // animate when visible; NO "once" so it can animate out when leaving
  const sectionInView = useInView(sectionRef, { amount: 0.35 });

  const pages = useMemo(() => chunk(projects, PAGE_SIZE), []);
  const total = pages.length || 1;

  const baseBg   = "rgba(20,30,24,0.28)";
  const baseRing = "rgba(123,227,198,0.22)";
  const baseShad = "0 10px 40px rgba(0,0,0,0.28)";

  return (
  <section
    id="work"
    ref={sectionRef}
    className="anchorSection"
    style={{
      position: "relative",
      padding: "calc(6rem + var(--header-h)) 4vw 6rem", // keep your spacing but account for header
      minHeight: "100vh",
    }}
  >
    {/* invisible waypoint so the header spy can toggle "Work" as active at the right moment */}
    <div
      data-spy="work"
      aria-hidden
      style={{
        position: "absolute",
        top: "35vh",   // tweak if you want it earlier/later
        left: 0,
        width: 1,
        height: 1,
        pointerEvents: "none",
      }}
    />

      <div className="dashViewport">
        <motion.div
          className="dashTrack"
          animate={{ x: `-${page * 100}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {pages.map((group, pageIdx) => (
            <div key={`page-${pageIdx}`} className="dashPage">
              <div className="gridDash">
                {group.map((p, i) => {
                  const tint = tints[(pageIdx * PAGE_SIZE + i) % tints.length];

                  const motionProps = {
                    initial: { opacity: 0, y: 40, rotate: -2, filter: "blur(10px)" },
                    animate:
                      sectionInView && page === pageIdx
                        ? {
                            opacity: 1,
                            y: 0,
                            rotate: 0,
                            filter: "blur(0px)",
                            backgroundColor: [baseBg, tint.bg, baseBg],
                            borderColor: [baseRing, tint.ring, baseRing],
                            boxShadow: [baseShad, `0 18px 64px ${tint.glow}`, baseShad],
                            transitionEnd: {
                              backgroundColor: undefined,
                              borderColor: undefined,
                              boxShadow: undefined,
                            },
                          }
                        : { opacity: 0, y: 24, filter: "blur(8px)" },
                    transition: {
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.12,
                      backgroundColor: { times: [0, 0.8, 1], duration: 0.7 },
                      borderColor:     { times: [0, 0.8, 1], duration: 0.7 },
                      boxShadow:       { times: [0, 0.8, 1], duration: 0.7 },
                    },
                  };

                  return (
                    <GlassContainer
                      key={p.id}
                      onClick={() => setActive(p)}
                      className="tile"
                      motionProps={motionProps}
                    >
                      <img
  src={p.cover}
  alt=""
  className={`tileImg ${p.isLogo ? "isLogo" : ""}`}
/>

                      <div className="tileBody">
                        <h3 className="tileTitle">{p.title}</h3>
                        <p className="meta">{p.subtitle}</p>
                        <div className="tags">
                          {p.tags?.slice(0, 3).map((t) => (
                            <span key={t} className="tag">{t}</span>
                          ))}
                        </div>
                      </div>
                    </GlassContainer>
                  );
                })}

                {/* Animated headline slot */}
                <motion.div
                  className="gridHeadlineSlot"
                  variants={headParent}
                  initial="hidden"
                  animate={sectionInView && page === pageIdx ? "show" : "hidden"}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 * group.length }}
                >
                  {pageIdx === 0 ? (
                    <>
                      <motion.h2 className="agencyTitle" variants={headChild}>
                        WORK IN <span className="accent">FOCUS</span>
                      </motion.h2>
                      <motion.p className="agencySub" variants={headChild}>
                        Latest projects i've been working on/new things i've been learning lately
                      </motion.p>
                    </>
                  ) : (
                    <>
                      <motion.h2 className="agencyTitle" variants={headChild}>
                        MORE <span className="accent">PROJECTS</span>
                      </motion.h2>
                      <motion.p className="agencySub" variants={headChild}>
                        Where it all began, experiments, and projects i used to learn new skills
                      </motion.p>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Arrows */}
        {total > 1 && (
          <>
            <button
              className="dashArrow left"
              aria-label="Previous"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              ‹
            </button>
            <button
              className="dashArrow right"
              aria-label="Next"
              onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
              disabled={page === total - 1}
            >
              ›
            </button>
          </>
        )}
      </div>

      <ProjectModal open={!!active} onClose={() => setActive(null)} project={active || {}} />
    </section>
  );
}
