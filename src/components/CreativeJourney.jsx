// src/components/CreativeJourney.jsx
import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import ProjectModal from "./ProjectModal";

const defaultImages = [
  // swap with your own paths (any size; they’re cover-fitted)
  "/img/journey/painting.jpg",
  "/img/journey/beats.jpg",
  "/img/journey/photography.jpg",
  "/img/journey/3d.jpg",
  "/img/journey/code.jpg",
];

export default function CreativeJourney({
  images = defaultImages,
  title = <>A <span className="accent">Creative</span> Through Every Phase</>,
  blurb = "From paints and sketchbooks to DAWs and 3D, I’ve always chased ideas and turned them into something you can see, hear, or use. Code is just the latest medium — the one that lets me blend design, interaction and systems thinking.",
  sections = {
    roots: [
      "Childhood: drawing, painting, modding games.",
      "Teen years: producing beats, learning rhythm, flow, iteration.",
      "Visuals: photography, color, framing, pacing.",
    ],
    craft: [
      "UI as choreography: motion, timing, progressive disclosure.",
      "Systems thinking: components, states, data as instruments.",
      "Empathy: remove friction, amplify clarity.",
    ],
    now: [
      "Prototyping fast with Three/Fiber + Framer Motion.",
      "Shipping real products — usable, accessible, maintainable.",
      "Learning out loud; each project the next riff.",
    ],
  },
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(0);

  const onOpen = (i) => {
    setModalIdx(i);
    setModalOpen(true);
  };

  // simple fan layout: tweak angles/offsets to taste
  const fan = useMemo(() => {
    const angles = [-12, -5, 4, 11, -2];
    const spread = 24; // px offset between cards
    return images.map((src, i) => ({
      src,
      angle: angles[i % angles.length],
      tx: (i - Math.floor(images.length / 2)) * spread,
      ty: Math.abs(i - Math.floor(images.length / 2)) * -6,
      z: i,
    }));
  }, [images]);

  // tilt on mouse (very subtle)
  const wrapRef = useRef(null);
  const handleMove = (e) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    wrapRef.current.style.setProperty("--rx", `${y * -6}deg`);
    wrapRef.current.style.setProperty("--ry", `${x * 6}deg`);
  };

  const handleLeave = () => {
    if (!wrapRef.current) return;
    wrapRef.current.style.setProperty("--rx", `0deg`);
    wrapRef.current.style.setProperty("--ry", `0deg`);
  };

  // Build a minimal project payload so clicking a card opens your nice modal
  const modalProject = useMemo(
    () => ({
      id: "creative-journey",
      title: "Creative Journey",
      subtitle: "A few frames from the path",
      media: images.map((src) => ({ type: "image", src })),
      sections: {
        challenge: "How to channel a lifetime of making into software that feels human.",
        roadmap:
          "Blend design and engineering: explore, prototype, iterate. Keep the soul of the idea while refining the craft.",
        results:
          "Interfaces that feel intentional — clear, responsive, and a little bit playful.",
      },
      tags: ["Art", "Music", "3D", "UI", "Engineering"],
    }),
    [images]
  );

  return (
    <section className="journeySection" aria-label="Creative journey">
      <div className="journeyGrid">
        {/* Left: text */}
        <div className="journeyContent">
          <h2 className="journeyHeading">{title}</h2>
          <p className="journeyBlurb">{blurb}</p>

          <div className="journeyCols">
            <Block title="Roots" items={sections.roots} />
            <Block title="Craft" items={sections.craft} />
            <Block title="Now" items={sections.now} />
          </div>
        </div>

        {/* Right: fanned deck */}
        <div
          className="deckWrap"
          ref={wrapRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          <div className="deck">
            {fan.map((c, i) => (
              <motion.button
                key={c.src + i}
                className="card"
                style={{ zIndex: c.z }}
                initial={{ opacity: 0, y: 30, rotate: c.angle * 1.5, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                whileHover={{ y: c.ty - 4, scale: 1.03 }}
                onClick={() => onOpen(i)}
              >
                <motion.img
                  src={c.src}
                  alt=""
                  className="cardImg"
                  style={{
                    transform: `translate(${c.tx}px, ${c.ty}px) rotate(${c.angle}deg)`,
                  }}
                  draggable={false}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* reuse your ProjectModal so images open large and you can swipe */}
      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        project={{
          ...modalProject,
          // start from the clicked index
          media: [
            ...modalProject.media.slice(modalIdx),
            ...modalProject.media.slice(0, modalIdx),
          ],
        }}
      />
    </section>
  );
}

function Block({ title, items = [] }) {
  return (
    <div className="journeyBlock">
      <h3 className="journeyBlockTitle">{title}</h3>
      <ul className="journeyList">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
