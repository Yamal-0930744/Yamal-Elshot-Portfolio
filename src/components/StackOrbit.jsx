import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, Billboard, Text, Environment, Center, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useInView, motion, useMotionValue, animate, useTransform } from "framer-motion";

/* ---- path helper for GitHub Pages subpaths ---- */
const withBase = (path = "") => {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || /^data:/i.test(path)) return path;
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return `${base}/${path.replace(/^\/+/, "")}`;
};

/* ---- color constants ---- */
const ACCENT = "#7be3a3";
const PLUMBOB_COLOR = "#4ade80";

function asNumber(v, fallback = 0) {
  if (typeof v === "number") return v;
  if (v && typeof v.get === "function") return v.get();
  return fallback;
}

/* ---- Data ---- */
const PRIMARY_ITEMS = [
  { icon: "/icons/python.svg", label: "Python" },
  { icon: "/icons/html.svg",   label: "HTML" },
  { icon: "/icons/css.svg",    label: "CSS" },
  { icon: "/icons/react.svg",  label: "React" },
  { icon: "/icons/threejs.svg",label: "Three.js" },
  { icon: "/icons/js.svg",     label: "JavaScript" },
  { icon: "/icons/github.svg", label: "GitHub" },
];

const SECONDARY_ITEMS = [
  { label: "Canva",       icon: "/icons/canva.svg" },
  { label: "Vite",        icon: "/icons/vite.svg" },
  { label: "SQLAlchemy",  icon: "/icons/sqlalchemy.svg" },
  { label: "AI",          icon: "/icons/gpt.svg" },
  { label: "REST",        icon: "/icons/rest.svg" },
  { label: "VS Code",     icon: "/icons/vscode.svg" },
  { label: "Postman",     icon: "/icons/postman.svg" },
];

/* =========================================================
   HERO-LIKE SPARKLES — thin spherical shell around origin
   ========================================================= */
function HeroLikeSparkles({ reentry, count = 64, radius = 1.05, thickness = 0.18 }) {
  const ref = useRef();
  const mat = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const u = Math.random() * 2 - 1;
      const phi = Math.acos(u);
      const r = radius + (Math.random() - 0.5) * thickness;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const idx = i * 3;
      pos[idx] = x;
      pos[idx + 1] = y;
      pos[idx + 2] = z;
    }
    return pos;
  }, [count, radius, thickness]);

  useFrame((state, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.12;
      ref.current.rotation.x += dt * 0.03;
    }
    if (mat.current) {
      const a = THREE.MathUtils.clamp(asNumber(reentry, 0), 0, 1);
      mat.current.opacity = 0.4 * a;
      mat.current.size = 2.5 + Math.sin(state.clock.elapsedTime * 2.4) * 0.5;
    }
  });

  return (
    <points ref={ref} renderOrder={0}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        color="#bff7e8"
        size={2.5}
        sizeAttenuation={false}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/* ---------- Center plumbob (same glassy look as hero) ---------- */
function MiniPlumbob({ baseScale = 0.14, reentry = 0, yOffset = 0 }) {
  const gltf = useGLTF(withBase("/models/plumbob.glb"));
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const group = useRef();
  const stars = useRef();

  useMemo(() => {
    const accent = new THREE.Color(PLUMBOB_COLOR);
    scene.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = false;
      o.material = new THREE.MeshPhysicalMaterial({
        color: accent,
        transmission: 1,
        ior: 1.45,
        thickness: 0.01,
        roughness: 0.22,
        metalness: 0.25,
        clearcoat: 0.15,
        clearcoatRoughness: 0.55,
        attenuationColor: accent,
        attenuationDistance: 7,
        envMapIntensity: 1.0,
      });
      try {
        const eg = new THREE.EdgesGeometry(o.geometry, 25);
        const lines = new THREE.LineSegments(
          eg,
          new THREE.LineBasicMaterial({ color: 0x9ff7c8, transparent: true, opacity: 0.16, depthWrite: false })
        );
        lines.renderOrder = 2;
        o.add(lines);
      } catch {}
    });
  }, [scene]);

  useFrame((_, dt) => {
    scene.rotation.y += dt * 0.5;

    const t = THREE.MathUtils.clamp(asNumber(reentry, 0), 0, 1);
    if (!group.current) return;

    const targetY = yOffset + THREE.MathUtils.lerp(2.2, 0, t);
    const targetZ = THREE.MathUtils.lerp(-2.6, 0, t);
    const targetS = THREE.MathUtils.lerp(0.7, 1, t);

    group.current.position.y += (targetY - group.current.position.y) * 0.12;
    group.current.position.z += (targetZ - group.current.position.z) * 0.12;
    const s = THREE.MathUtils.lerp(group.current.scale.x || baseScale, targetS, 0.12);
    group.current.scale.setScalar(s);

    if (stars.current) {
      stars.current.rotation.y += dt * 0.02;
      stars.current.rotation.x += dt * 0.005;
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={baseScale} />
      <group ref={stars}>
        <Sparkles
          count={16}
          speed={0.04}
          size={1.0}
          opacity={0.22}
          color="#7be3a3"
          noise={0.15}
          scale={[1.2, 1.2, 1.2]}
          position={[0, 0.05, 0]}
        />
        <Sparkles
          count={22}
          speed={0.03}
          size={0.9}
          opacity={0.14}
          color="#7be3a3"
          noise={0.1}
          scale={[1.8, 1.8, 1.8]}
          position={[0, 0, 0]}
        />
      </group>
    </group>
  );
}

useGLTF.preload(withBase("/models/plumbob.glb"));

/* ---------- Accent orbit ring ---------- */
function OrbitRing({ reentry }) {
  const baseRef = useRef();
  const glowRef = useRef();
  useFrame(() => {
    const a = THREE.MathUtils.clamp(asNumber(reentry, 0), 0, 1);
    if (baseRef.current) baseRef.current.opacity = 0.15 * a;
    if (glowRef.current) glowRef.current.opacity = 0.08 * a;
  });
  return (
    <>
      <mesh renderOrder={0} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <ringGeometry args={[1.33, 1.37, 128]} />
        <meshBasicMaterial ref={baseRef} color={ACCENT} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh renderOrder={0} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <ringGeometry args={[1.37, 1.52, 128]} />
        <meshBasicMaterial
          ref={glowRef}
          color={ACCENT}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

/* ---------- One orbit item ---------- */
function OrbitItem({ textureUrl, label, radius = 1.35, baseAngle = 0, speed = 0.22, reentry }) {
  const url = useMemo(() => withBase(textureUrl), [textureUrl]);
  const tex = useLoader(THREE.TextureLoader, url);
  const ref = useRef();
  const ringMat = useRef();
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + baseAngle;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 0.8) * 0.05;
    ref.current.position.set(x, y, z);
    ref.current.lookAt(0, 0, 0);

    const a = THREE.MathUtils.clamp(asNumber(reentry, 0), 0, 1);
    const s = THREE.MathUtils.lerp(0.9, hovered ? 1.22 : 1, a);
    ref.current.scale.setScalar(s);

    if (ringMat.current) {
      ringMat.current.opacity = (hovered ? 0.8 : 0.25) * a;
      ringMat.current.color.set(hovered ? ACCENT : "#2a3230");
    }
    if (textRef.current?.material) {
      textRef.current.material.transparent = true;
      textRef.current.material.opacity = a;
      textRef.current.material.needsUpdate = true;
    }
  });

  return (
    <group ref={ref}>
      <Billboard>
        <mesh
          renderOrder={3}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
        >
          <planeGeometry args={[0.26, 0.26]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>

        <mesh renderOrder={2} position={[0, 0, -0.001]}>
          <ringGeometry args={[0.16, 0.19, 32]} />
          <meshBasicMaterial ref={ringMat} color={"#2a3230"} transparent opacity={0} depthWrite={false} />
        </mesh>

        <Text
          ref={textRef}
          position={[0, -0.24, 0]}
          fontSize={0.08}
          color={hovered ? ACCENT : "#a3a7b5"}
          anchorX="center"
          anchorY="top"
          renderOrder={3}
        >
          {label}
        </Text>
      </Billboard>
    </group>
  );
}

/* ---------- Chip item with reversible stagger ---------- */
function StackChip({ icon, label, index, reentry }) {
  const enterStart = 0.15 + index * 0.05;
  const enterEnd = enterStart + 0.25;
  const opacity = useTransform(reentry, [0, enterStart, enterEnd, 1], [0, 0, 1, 1]);
  const y = useTransform(reentry, [0, enterStart, enterEnd, 1], [20, 20, 0, 0]);
  return (
    <motion.div className="stackChip" role="listitem" aria-label={label} style={{ opacity, y }}>
      <img src={withBase(icon)} alt={label} />
      <span>{label}</span>
    </motion.div>
  );
}

/* ---------- Main ---------- */
export default function StackOrbit() {
  const sectionRef = useRef(null);

  const inView = useInView(sectionRef, { amount: 0.6 });
  const reentry = useMotionValue(0);

  useEffect(() => {
    const controls = animate(reentry, inView ? 1 : 0, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, reentry]);

  const overlayOpacity = useTransform(reentry, [0, 1], [0, 1]);
  const overlayY = useTransform(reentry, [0, 1], [16, 0]);
  const overlayBlur = useTransform(reentry, [0, 1], [6, 0], { clamp: false });
  const overlayFilter = useTransform(overlayBlur, (v) => `blur(${v}px)`);
  const containerOpacity = useTransform(reentry, [0, 1], [0, 1]);
  const containerY = useTransform(reentry, [0, 1], [32, 0]);

  return (
    <section ref={sectionRef} className="stackOrbit" aria-label="Tech stack">
      {/* Heading overlay — in & out */}
      <motion.div
        className="stackSceneOverlay"
        style={{ opacity: overlayOpacity, y: overlayY, filter: overlayFilter }}
      >
        <h2 className="stackSceneHeading">
          THE <span className="accent">TOOLS</span> I CRAFT WITH
        </h2>
        <p className="stackSceneSub">Core technologies I use across UI and backend.</p>
      </motion.div>

      {/* Canvas area — in & out */}
      <motion.div className="stackCanvasWrap stackCanvasPlain" style={{ opacity: containerOpacity, y: containerY }}>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.55, 3.4], fov: 40 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          {/* Light rig like hero */}
          <ambientLight intensity={0.35} />
          <directionalLight position={[2.5, 3.5, 2.2]} intensity={0.95} color="#fff2e0" />
          <directionalLight position={[-2.2, 2.0, -2.0]} intensity={0.5} color="#dff8ff" />
          <Environment preset="studio" environmentIntensity={0.85} />

          <Suspense fallback={null}>
            <group position={[0, -0.22, 0]}>
              <Center>
                <OrbitRing reentry={reentry} />
                <MiniPlumbob baseScale={0.14} reentry={reentry} yOffset={-0.3} />

                {PRIMARY_ITEMS.map((it, i) => (
                  <OrbitItem
                    key={`${it.icon}-${i}`}
                    textureUrl={it.icon}
                    label={it.label}
                    radius={1.35}
                    baseAngle={(i / PRIMARY_ITEMS.length) * Math.PI * 2}
                    speed={0.22}
                    reentry={reentry}
                  />
                ))}
              </Center>
            </group>
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Chips — reversible stagger */}
      <div className="stackChipGrid" role="list">
        {SECONDARY_ITEMS.map((s, i) => (
          <StackChip key={s.label} icon={s.icon} label={s.label} index={i} reentry={reentry} />
        ))}
      </div>
    </section>
  );
}
