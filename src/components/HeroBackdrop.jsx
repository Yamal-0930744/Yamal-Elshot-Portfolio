
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

export default function HeroBackdrop() {
  const prefersReduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // gentle spring so it glides behind the cursor
  const sx = useSpring(mx, { stiffness: 40, damping: 12, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 40, damping: 12, mass: 0.4 });

  // map to small offsets
  const gx = useTransform(sx, (v) => v * 6);   // grid shift
  const gy = useTransform(sy, (v) => v * 6);
  const px = useTransform(sx, (v) => v * 12);  // ghost shapes shift a bit more
  const py = useTransform(sy, (v) => v * 12);

  useEffect(() => {
    if (prefersReduced) return;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mx.set(x); my.set(y);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, prefersReduced]);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* faint grid */}
      <motion.svg
        width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, x: gx, y: gy, opacity: 0.08, filter: "blur(0.2px)" }}
      >
        <defs>
          <pattern id="p" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 0H6 M0 0V6" stroke="#7be3c6" strokeWidth="0.1" />
          </pattern>
          {/* fade edges so the grid disappears toward borders */}
          <radialGradient id="m" cx="50%" cy="40%" r="70%">
            <stop offset="60%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
          <mask id="fade"><rect width="100%" height="100%" fill="url(#m)"/></mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#p)" mask="url(#fade)" />
      </motion.svg>

      {/* two ghost plumbobs (super faint) */}
      <motion.div
        style={{
          position: "absolute",
          width: 280, aspectRatio: "1/1.6", right: "14%", top: "6%",
          x: px, y: py, opacity: 0.05, filter: "blur(.4px)"
        }}
      >
        <div style={{ width: "100%", height: "62%", background: "#7be3c6", opacity: .35,
          clipPath: "polygon(50% 0, 100% 45%, 50% 90%, 0 45%)" }} />
      </motion.div>

      <motion.div
        style={{
          position: "absolute",
          width: 220, aspectRatio: "1/1.6", right: "26%", bottom: "8%",
          x: px, y: py, opacity: 0.03, filter: "blur(.7px)"
        }}
      >
        <div style={{ width: "100%", height: "62%", background: "#7be3c6", opacity: .35,
          clipPath: "polygon(50% 0, 100% 45%, 50% 90%, 0 45%)" }} />
      </motion.div>
    </div>
  );
}
