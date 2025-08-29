// src/components/ContactPlumbobFX.jsx
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, Sparkles, useGLTF } from "@react-three/drei";
import { useMotionValueEvent } from "framer-motion";

const clamp01 = (v) => Math.min(1, Math.max(0, v));

const TUNE = {
  yStart: 1.80,  // was 2.10  → lower start
  yEnd:   0.55,  // was 1.30  → lower end (↓ moves bob down)
  sStart: 0.155, // was 0.16
  sEnd:   0.138, // was 0.14
  z:      0.0,   // in case you want to push/pull later
};

/** Glass plumbob: position/scale mapped directly from p (no easing lag) */
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
    scene.rotation.y += dt * (0.55 + p * 2.1);

    // ↓ lower Y by mapping to our tuned start/end (no easing lag)
    const y = THREE.MathUtils.lerp(TUNE.yStart, TUNE.yEnd, p);
    const s = THREE.MathUtils.lerp(TUNE.sStart, TUNE.sEnd, p);

    if (group.current) {
      group.current.position.set(0, y, TUNE.z);
      group.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      {/* keep Center so the GLB stays framed, but it won't fight our Y/scale */}
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}
useGLTF.preload("/models/plumbob.glb");

/** Stars */
function Stars({ p = 0 }) {
  const rot = useRef(0);
  useFrame((_, dt) => (rot.current += dt * 0.08));

  const burst = THREE.MathUtils.smoothstep(p, 0.72, 1.0);
  const spread = 1 + burst * 5.5;

  return (
    <group rotation-y={rot.current}>
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

/** Overlay Canvas */
export default function ContactPlumbobFX({ progress }) {
  const [p, setP] = useState(() => clamp01(progress?.get?.() ?? 0));
  useEffect(() => setP(clamp01(progress?.get?.() ?? 0)), [progress]);
  useMotionValueEvent(progress, "change", (v) => setP(clamp01(v || 0)));

  const overlayOpacity = clamp01((p - 0.02) * 4);

  return (
    <div
      className="contactFxRoot"
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
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
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={0.9} color="#fff2e0" />
        <directionalLight position={[-2, 2, -2]} intensity={0.45} color="#dff8ff" />
        <Environment preset="studio" environmentIntensity={0.9} />

        <Suspense fallback={null}>
          <GlassPlumbob p={p} />
          <Stars p={p} />
        </Suspense>
      </Canvas>
    </div>
  );
}
