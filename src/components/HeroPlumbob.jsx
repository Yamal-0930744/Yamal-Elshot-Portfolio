
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Center, Environment, ContactShadows, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function asNumber(v, f = 0) { return typeof v === "number" ? v : v?.get?.() ?? f; }

function PlumbobModel({ baseScale = 0.22, spinFactor = 1, fly = { y: 0, z: 0 } }) {
  const gltf = useGLTF("/models/plumbob.glb");
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const group = useRef();

  useMemo(() => {
    const accent = new THREE.Color("#4ade80");
    scene.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.material = new THREE.MeshPhysicalMaterial({
        color: accent, transmission: 1, ior: 1.45, thickness: 0.01,
        roughness: 0.22, metalness: 0.25, clearcoat: 0.15, clearcoatRoughness: 0.55,
        attenuationColor: accent, attenuationDistance: 7, envMapIntensity: 1,
      });
      // very faint facet lines
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
  // ramped spin: base speed bumped from 0.6 → 1.0 and guarded
  const spin = Math.max(0.001, asNumber(spinFactor, 1));
  scene.rotation.y += dt * 1.0 * spin; // try 1.2 if you want even more

  if (!group.current) return;

  // (optional) slightly quicker fly-out response: 0.08 → 0.10
  const ty = asNumber(fly.y, 0);
  const tz = asNumber(fly.z, 0);
  group.current.position.y += (ty - group.current.position.y) * 0.10;
  group.current.position.z += (tz - group.current.position.z) * 0.10;
});


  return (
    <group ref={group}>
      <primitive object={scene} scale={baseScale} />

      {/* Tighter, centered sparkles */}
      <Sparkles
        count={12}
        speed={0.12}
        size={1.2}
        scale={[0.7, 1.0, 0.7]}   // keep them close
        position={[0, 0.15, 0]}   // float a touch above center
        opacity={0.28}
        color="#7be3a3"
        noise={0.6}
      />
    </group>
  );
}

function ParallaxGroup({ offset = { x: 0, y: 0 }, children }) {
  const ref = useRef();
  const { mouse } = useThree();
  useFrame(() => {
    // small, clamped wobble so it never runs away
    const wobble = 0.15;              // max ± world units to add
    const k = 0.12;                   // sensitivity
    const dx = THREE.MathUtils.clamp((mouse.x || 0) * k, -wobble, wobble);
    const dy = THREE.MathUtils.clamp((mouse.y || 0) * -k, -wobble, wobble);
    if (!ref.current) return;
    ref.current.position.x += (offset.x + dx - ref.current.position.x) * 0.06;
    ref.current.position.y += (offset.y + dy - ref.current.position.y) * 0.06;
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroPlumbob({
  spinFactor = 1,
  flyY = 0,
  flyZ = 0,
  opacity = 1,
  offset = { x: 0.52, y: 0.08 },
  baseScale = 0.22,
}) {
  return (
    <motion.div style={{ position: "fixed", inset: 0, width: "100%", height: "100%", opacity, pointerEvents: "none", zIndex: 1 }}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.7, 2.6], fov: 35 }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        shadows
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={0.9} color="#fff2e0" castShadow />
        <directionalLight position={[-2, 2, -2]} intensity={0.45} color="#dff8ff" />
        <directionalLight position={[-2.5, 1.5, 2.2]} intensity={0.35} color="#7be3a3" />
        <Environment preset="studio" environmentIntensity={0.9} />

        <Suspense fallback={null}>
          <Center>
            <ParallaxGroup offset={offset}>
              <motion.group
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: [1, 1.13, 1, 0.93, 1], opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
              >
                <PlumbobModel baseScale={baseScale} spinFactor={spinFactor} fly={{ y: flyY, z: flyZ }} />
              </motion.group>
            </ParallaxGroup>
          </Center>
        </Suspense>

        <ContactShadows opacity={0.12} scale={10} blur={2.2} far={3} resolution={512} frames={1} />
      </Canvas>
    </motion.div>
  );
}

useGLTF.preload("/models/plumbob.glb");
