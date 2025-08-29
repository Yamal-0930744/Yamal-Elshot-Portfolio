
import { motion, useReducedMotion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import React, { useEffect, useRef } from "react";

export default function HeroText({ style }) {
  const prefersReduced = useReducedMotion();

  // observe visibility of the text block
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 }); // animate in at ~60% visible

  // drive in/out with a single motion value
  const reentry = useMotionValue(prefersReduced ? 1 : 0);

  useEffect(() => {
    if (prefersReduced) return;
    const controls = animate(reentry, inView ? 1 : 0, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, prefersReduced, reentry]);

  // tie styles to reentry value
  const opacity = useTransform(reentry, [0, 1], [0, 1]);
  const y = useTransform(reentry, [0, 1], [24, 0]);
  const blur = useTransform(reentry, [0, 1], [6, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.div
      ref={ref}
      className="heroText"
      style={{
        ...style,
        opacity,
        y,
        filter,
        willChange: "opacity, transform, filter",
      }}
    >
      <h1>
        Crafting digital worlds, <span className="one-text">One</span> interface at a time
      </h1>
      <p>Full-stack developer passionate about turning ideas into immersive experiences.</p>
    </motion.div>
  );
}
