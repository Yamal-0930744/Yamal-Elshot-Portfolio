// src/components/ProfileCard.jsx
import "./ProfileCard.css";
import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";

// small helper: prefix paths with Vite base (so /img/... works on GitHub Pages)
const withBase = (path = "") => {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || /^data:/i.test(path)) return path;
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const clean = String(path).replace(/^\/+/, "");
  return `${base}/${clean}`;
};

export default function ProfileCard({ imageSrc, title, description }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 }); // animate in & out

  const parts = useMemo(() => title.split(/(Human)/gi), [title]);

  const [lead, more] = useMemo(() => {
    const chunks = String(description ?? "").split(/\n\s*\n/);
    return [chunks[0] || "", chunks.slice(1).join("\n\n").trim()];
  }, [description]);

  const parent = {
    hidden: {
      opacity: 0, y: 32, filter: "blur(10px)",
      transition: { duration: 0.5, ease: [0.25, 1, 0.3, 1], when: "afterChildren", staggerChildren: 0.06, staggerDirection: -1 }
    },
    show: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], when: "beforeChildren", staggerChildren: 0.06 }
    },
  };

  const imgVar  = { hidden: { opacity: 0, x: -24, filter: "blur(8px)" }, show: { opacity: 1, x: 0, filter: "blur(0px)" } };
  const textVar = { hidden: { opacity: 0, y: 16, filter: "blur(8px)" },  show: { opacity: 1, y: 0, filter: "blur(0px)" } };

  return (
    <motion.div
      ref={ref}
      className="profile-card"
      variants={parent}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      style={{ willChange: "transform, filter, opacity, box-shadow" }}
    >
      <motion.div className="profile-card-image" variants={imgVar} transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}>
        {/* 👇 ensure base-prefixed URL for GitHub Pages */}
        <img src={withBase(imageSrc)} alt={`${title} — profile`} />
      </motion.div>

      <motion.div className="profile-card-content" variants={textVar} transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}>
        <h2>
          {parts.map((part, i) =>
            part.toLowerCase() === "human" ? (
              <span key={i} className="human-text">{part}</span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </h2>

        <p className="profileLead">{lead}</p>
        {more && <p className="profileMore">{more}</p>}
      </motion.div>
    </motion.div>
  );
}
