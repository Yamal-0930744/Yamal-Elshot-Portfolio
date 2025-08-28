// src/components/ContactPlumbobFX.jsx
import React, { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, Sparkles, useGLTF } from "@react-three/drei";
import { useMotionValueEvent } from "framer-motion";

// helper
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** Glassy plumbob that ascends + spins gently as p→1 */
function GlassPlumbob({ p = 0 }) {
  const gltf = useGLTF("/models/plumbob.glb");
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const group = useRef();

  useMemo(() => {
    const c = new THREE.Color("#4ade80");
    scene.traverse((o) => {
      if (!o.isMesh) return;
      o.material = new THREE.MeshPhysicalMaterial({
        color: c,
        transmission: 1,
        ior: 1.45,
        thickness: 0.01,
        roughness: 0.22,
        metalness: 0.25,
        clearcoat: 0.15,
        clearcoatRoughness: 0.55,
        attenuationColor: c,
        attenuationDistance: 7,
        envMapIntensity: 1,
      });
    });
  }, [scene]);

  useFrame((_, dt) => {
    // gentler spin-up
    const spin = 0.55 + p * 2.1;      // previously 0.9 + p * 6.5
    scene.rotation.y += dt * spin;

    // finish higher above the contact card (centered feel)
    const targetY = THREE.MathUtils.lerp(2.1, 1.3, p); // previously 1.35 → 0.48
    const targetS = THREE.MathUtils.lerp(0.16, 0.14, p);

    if (group.current) {
      group.current.position.y += (targetY - group.current.position.y) * 0.12;
      group.current.scale.setScalar(
        THREE.MathUtils.lerp(group.current.scale.x || targetS, targetS, 0.18)
      );
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}
useGLTF.preload("/models/plumbob.glb");

/** Slow ambient stars + a big-bang burst as p→1 */
function Stars({ p = 0 }) {
  const rot = useRef(0);
  useFrame((_, dt) => (rot.current += dt * 0.08));

  const burst = THREE.MathUtils.smoothstep(p, 0.72, 1.0); // starts ~72% down
  const spread = 1 + burst * 5.5; // how wide the burst gets

  return (
    <group rotation-y={rot.current}>
      {/* subtle ambient specks around the bob */}
      <Sparkles
        count={14}
        speed={0.08}
        size={1.05}
        opacity={0.28 * (1 - burst)}
        color="#7be3a3"
        noise={0.55}
        scale={[1.2, 1.2, 1.2]}
        position={[0, 0.05, 0]}
      />
      {/* the big-bang burst */}
      <Sparkles
        count={220}
        speed={0.22}
        size={1.15}
        opacity={0.5 * burst}
        color="#7be3a3"
        noise={2.0}
        scale={[spread, spread, spread]}
        position={[0, 0.05, 0]}
      />
    </group>
  );
}

/**
 * Fixed overlay Canvas that fades in as you approach the Contact section.
 * `progress` is a Framer Motion MotionValue (0..1) coming from Home.jsx.
 *
 * IMPORTANT: The overlay and its Canvas are pointer-events: none so they
 * never block clicks on the page.
 */
export default function ContactPlumbobFX({ progress }) {
  // convert MotionValue to a number so React re-renders Sparkles props
  const [p, setP] = useState(0);
  useMotionValueEvent(progress, "change", (v) => setP(clamp01(v || 0)));

  // fade in once the section starts entering
  const overlayOpacity = clamp01((p - 0.02) * 4); // ~0→1 fast

  return (
    <div
      className="contactFxRoot"
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none", // <-- wrapper ignores clicks
        zIndex: 0,             // keep low; we don't need it above UI for clicks
        opacity: overlayOpacity,
        transition: "opacity .2s linear",
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.9, 3.2], fov: 38, near: 0.01, far: 100 }}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ pointerEvents: "none" }}  // <-- critical: canvas ignores clicks
      >
        {/* light rig matches the rest of the site */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={0.9} color="#fff2e0" />
        <directionalLight position={[-2, 2, -2]} intensity={0.45} color="#dff8ff" />
        <Environment preset="studio" environmentIntensity={0.9} />

        <Suspense fallback={null}>
          <Center>
            <GlassPlumbob p={p} />
            <Stars p={p} />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  );
}
