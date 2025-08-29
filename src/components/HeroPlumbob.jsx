// src/components/HeroPlumbob.jsx
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Center, Environment, ContactShadows, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function asNumber(v, f = 0) { return typeof v === "number" ? v : v?.get?.() ?? f; }

// Prefix relative asset paths with Vite's BASE_URL (needed on GitHub Pages subpath)
const withBase = (path = "") => {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const clean = path.replace(/^\/+/, "");
  return `${base}/${clean}`;
};

/* ---------------------------
   RESPONSIVE TUNING
   - keeps plumbob bottom-right on small screens
   - reduces parallax + slightly shrinks on phones
----------------------------*/
function usePlumbobResponsive({
  defaultOffset = { x: 0.52, y: 0.08 },
  defaultScale = 0.22,
  defaultCam = [0, 0.7, 2.6],
}) {
  const [state, setState] = useState({
    offset: defaultOffset,
    scale: defaultScale,
    cam: defaultCam,
    k: 0.12,
    wobble: 0.15,
  });

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Defaults (desktop)
      let offset = { ...defaultOffset };
      let scale = defaultScale;
      let cam = [...defaultCam];
      let k = 0.12;
      let wobble = 0.15;

      if (w <= 640) {
        // Phones: keep bottom-right but not off-screen
        offset = { x: 0.16, y: -0.10 };   // right & slightly down
        scale = Math.min(defaultScale, 0.19);
        cam = [0, 0.68, 2.8];
        k = 0.08; wobble = 0.10;          // calmer parallax
      } else if (w <= 1023) {
        // Tablets: a bit right, near baseline
        offset = { x: 0.32, y: -0.02 };
        scale = Math.min(defaultScale, 0.205);
        cam = [0.05, 0.7, 2.7];
        k = 0.10; wobble = 0.12;
      } else if (w >= 1800) {
        // Ultrawide: breathe a touch
        offset = { x: 0.58, y: 0.10 };
        scale = defaultScale * 1.05;
        cam = [0, 0.72, 2.8];
      }

      // Very short viewports (landscape phones/small laptops): nudge up a bit
      if (h <= 540) {
        offset = { x: offset.x, y: Math.min(offset.y + 0.04, 0.06) };
        k = Math.min(k, 0.08);
        wobble = Math.min(wobble, 0.10);
      }

      setState({ offset, scale, cam, k, wobble });
    };

    compute();
    window.addEventListener("resize", compute, { passive: true });
    return () => window.removeEventListener("resize", compute);
  }, [defaultOffset, defaultScale, defaultCam]);

  return state;
}

/* Update the R3F camera when settings change */
function TuneCamera({ position = [0, 0.7, 2.6] }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(position[0], position[1], position[2]);
    camera.lookAt(0, 0, 0);
  }, [camera, position]);
  return null;
}

function PlumbobModel({ baseScale = 0.22, spinFactor = 1, fly = { y: 0, z: 0 } }) {
  const modelUrl = withBase("/models/plumbob.glb");
  const gltf = useGLTF(modelUrl);
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
      // faint facet lines
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
    const spin = Math.max(0.001, asNumber(spinFactor, 1));
    scene.rotation.y += dt * 1.0 * spin;

    if (!group.current) return;
    const ty = asNumber(fly.y, 0);
    const tz = asNumber(fly.z, 0);
    group.current.position.y += (ty - group.current.position.y) * 0.10;
    group.current.position.z += (tz - group.current.position.z) * 0.10;
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={baseScale} />
      <Sparkles
        count={12}
        speed={0.12}
        size={1.2}
        scale={[0.7, 1.0, 0.7]}
        position={[0, 0.15, 0]}
        opacity={0.28}
        color="#7be3a3"
        noise={0.6}
      />
    </group>
  );
}

/* Parallax group with tunable intensity */
function ParallaxGroup({ offset = { x: 0, y: 0 }, k = 0.12, wobble = 0.15, children }) {
  const ref = useRef();
  const { mouse } = useThree();
  useFrame(() => {
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
  offset = { x: 0.52, y: 0.08 },   // desktop default (right-ish, slightly up)
  baseScale = 0.22,
}) {
  // Responsive values for offset/scale/camera/parallax
  const { offset: rOffset, scale: rScale, cam, k, wobble } = usePlumbobResponsive({
    defaultOffset: offset,
    defaultScale: baseScale,
    defaultCam: [0, 0.7, 2.6],
  });

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.7, 2.6], fov: 35 }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        shadows
      >
        <TuneCamera position={cam} />

        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={0.9} color="#fff2e0" castShadow />
        <directionalLight position={[-2, 2, -2]} intensity={0.45} color="#dff8ff" />
        <directionalLight position={[-2.5, 1.5, 2.2]} intensity={0.35} color="#7be3a3" />
        <Environment preset="studio" environmentIntensity={0.9} />

        <Suspense fallback={null}>
          <Center>
            <ParallaxGroup offset={rOffset} k={k} wobble={wobble}>
              <motion.group
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: [1, 1.13, 1, 0.93, 1], opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
              >
                <PlumbobModel baseScale={rScale} spinFactor={spinFactor} fly={{ y: flyY, z: flyZ }} />
              </motion.group>
            </ParallaxGroup>
          </Center>
        </Suspense>

        <ContactShadows opacity={0.12} scale={10} blur={2.2} far={3} resolution={512} frames={1} />
      </Canvas>
    </motion.div>
  );
}

useGLTF.preload(withBase("/models/plumbob.glb"));
