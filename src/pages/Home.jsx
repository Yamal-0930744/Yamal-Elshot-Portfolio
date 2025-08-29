// src/pages/Home.jsx
import React, { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

import SiteHeader from "../components/SiteHeader";
import HeroPlumbob from "../components/HeroPlumbob";
import HeroBackdrop from "../components/HeroBackdrop";
import HeroText from "../components/HeroText";

import ProfileCard from "../components/ProfileCard";
import DashboardSection from "../components/DashboardSection";
import CreativeJourneySection from "../components/CreativeJourneySection";
import StackOrbit from "../components/StackOrbit";
import ContactSection from "../components/ContactSection";
import SiteFooter from "../components/SiteFooter";

// ✨ new: plumbob that follows into Contact and bursts
import ContactPlumbobFX from "../components/ContactPlumbobFX";

export default function Home() {
  const heroRef = useRef(null);
  const profileRef = useRef(null);

  // also track tools & contact for the end flourish
  const toolsRef = useRef(null);
  const contactRef = useRef(null);

  // Section-scoped progress (0..1 inside each)
  const heroScroll    = useScroll({ target: heroRef,    offset: ["start start", "end start"] }).scrollYProgress;
  const profileScroll = useScroll({ target: profileRef, offset: ["start start", "end start"] }).scrollYProgress;

  /** Spin: gentle in hero, then very aggressive acceleration in next section */
  const spinFromHero = useTransform(heroScroll, [0, 1], [1, 1.3]);

  // ramp hard to ~12× by ~50% into the next section
  const spinFromProfile = useTransform(
    profileScroll,
    [0.00, 0.12, 0.26, 0.38, 0.50, 0.70, 1.00],
    [1.30, 2.00, 4.00, 7.00, 10.0, 12.0, 12.0]
  );

  // take the stronger curve
  const spinFactor = useTransform([spinFromHero, spinFromProfile], ([a, b]) => Math.max(a, b));

  /** Fly-away: start earlier and be mostly gone by ~50% of next section */
  const flyY = useTransform(
    profileScroll,
    [0.00, 0.18, 0.34, 0.50],
    [0.10, 0.50, 3.20, 4.40]
  );
  const flyZ = useTransform(
    profileScroll,
    [0.00, 0.18, 0.34, 0.50],
    [0.00, 0.00, -2.60, -3.60]
  );

  // Fade earlier so the exit feels snappy
  const heroOpacity = useTransform(profileScroll, [0.00, 0.26, 0.42], [1, 1, 0]);

  // Progress for the contact flourish: 0 when its top touches bottom of viewport,
  // 1 when its bottom touches bottom (i.e., at the very end).
  const contactProgress = useScroll({
    target: contactRef,
    offset: ["start 100%", "end 100%"],
  }).scrollYProgress;

  return (
    <>
      {/* Fixed header (logo + section links) */}
      <SiteHeader />

      {/* HERO */}
      <section
        id="hero"
        ref={heroRef}
        className="hero3d layer-hero anchorSection"
        style={{ position: "relative", minHeight: "100vh" }}
      >
        <HeroPlumbob
          baseScale={0.22}
          spinFactor={spinFactor}
          flyY={flyY}
          flyZ={flyZ}
          opacity={heroOpacity}
          offset={{ x: 0.98, y: -0.2 }}   // nudged right as you had it
        />

        {/* faint grid + parallax ghost diamonds */}
        <HeroBackdrop />

        {/* soft glows / vignette / grain */}
        <div className="heroFx" />

        {/* headline */}
        <HeroText />
      </section>

      {/* ABOUT / PROFILE (overlays hero visually) */}
      <section
        id="about"
        ref={profileRef}
        className="layer-above anchorSection"
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* ✨ subtle ambient glow for this section */}
        <div aria-hidden />

        <ProfileCard
  imageSrc="/img/AboutPhoto.png"
  title="Human First, Developer Second"
  description={`I’m Yamal. Some peopl call me Yems - a full-stack developer with a passion for crafting interfaces that feel intuitive and alive. My happy place is where taste meets logic; I turn messy ideas into clean, good looking experiences. My focus is on learning, experimenting, and steadily improving, one project at a time.

creative thinker • visual taste + psychology-driven • detail-minded • collaborative • curious & always learning`}
/>

      </section>

      <section id="journey" className="anchorSection" style={{ position: "relative" }}>
        <div aria-hidden />
        <CreativeJourneySection />
      </section>

      <DashboardSection />

      <section id="tools" ref={toolsRef} className="anchorSection" style={{ position: "relative" }}>
        <div aria-hidden />
        <StackOrbit />
      </section>

      <ContactPlumbobFX progress={contactProgress} />

      <section id="contact" ref={contactRef} className="anchorSection">
        <ContactSection />
      </section>
      <SiteFooter />
    </>
  );
}
