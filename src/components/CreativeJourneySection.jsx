// src/components/CreativeJourneySection.jsx
import React, { useEffect, useRef } from "react";
import { motion, useAnimationControls, useInView } from "framer-motion";
import CreativeJourneyMorph from "./CreativeJourneyMorph";

export default function CreativeJourneySection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.35, margin: "0px 0px -10% 0px" });
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start(inView ? "show" : "hidden");
  }, [inView, controls]);

  const ease = [0.22, 1, 0.36, 1];

  const container = {
    hidden: { opacity: 1 }, // keep container mounted; children animate
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease },
    },
  };

  const card = (i = 0) => ({
    hidden: { opacity: 0, y: 24, scale: 0.98, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease, delay: 0.08 * i },
    },
  });

  const morphFx = {
    hidden: { opacity: 0, y: 16, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease, delay: 0.1 } },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="journeySection"
      variants={container}
      initial="hidden"
      animate={controls}
    >
      <div className="journeyGrid">
        {/* LEFT: Story */}
        <div>
          <motion.h2 className="journeyHeading" variants={fadeUp}>
            A <span className="accent">creative</span> through every phase
          </motion.h2>

          <motion.p className="journeyBlurb" variants={fadeUp}>
            From sketchbooks and DAWs to 3D and code, I’ve always chased ideas
            and turned them into something you can see, hear, or use. This is
            the thread that shaped how I create.
          </motion.p>

          <div className="journeyCols">
            {/* Roots */}
            <motion.div className="journeyBlock" variants={card(0)}>
              <h4 className="journeyBlockTitle">Roots</h4>
              <ul className="journeyList">
                <li>Pencils, sketchbooks, Lego curiosity and “how does this work?”</li>
                <li>Art & music classes: rhythm, color, and composition clicked early.</li>
                <li>Making little things just to see them come alive.</li>
              </ul>
            </motion.div>

            {/* Experiments */}
            <motion.div className="journeyBlock" variants={card(1)}>
              <h4 className="journeyBlockTitle">Experiments</h4>
              <ul className="journeyList">
                <li>Making beats - layers, timing, and flow taught me pacing.</li>
                <li>Gameplay montages - cutting to music sharpened timing & transitions.</li>
              </ul>
            </motion.div>

            {/* What it shaped */}
            <motion.div className="journeyBlock" variants={card(2)}>
              <h4 className="journeyBlockTitle">What it shaped</h4>
              <ul className="journeyList">
                <li>Design as choreography - motion, reveal, rhythm.</li>
                <li>Systems thinking - components & states as instruments.</li>
                <li>Empathy & iteration - reduce friction, make intention obvious.</li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* RIGHT: floating morphing model */}
        <motion.div variants={morphFx}>
          <CreativeJourneyMorph
            initial="plumbob"
            autoCycle
            interval={5200}
            autoRotate={inView} // spins only while the section is visible
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
