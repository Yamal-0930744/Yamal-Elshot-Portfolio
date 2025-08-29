
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

function tween({ duration = 900, onUpdate, onComplete }) {
  let raf = 0;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    onUpdate?.(t);
    if (t < 1) raf = requestAnimationFrame(tick);
    else onComplete?.();
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

const TARGET_MAX_DIM = 1.8; 

function RecenteredGLTF({
  src,
  variant = "plumbob",
  variantAdjust = 1.0,
  extraScale = 1.0,
  opacity = 1,
}) {
  const { scene } = useGLTF(src);

  const { root, scaleFit, materials } = useMemo(() => {
    const root = scene.clone(true);
    const gather = [];

    root.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = false;

        if (variant === "glassy") {

        o.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#4ade80"),
          transmission: 1.0,
          ior: 1.45,
          thickness: 0.01,
          roughness: 0.25,
          metalness: 0.3,
          clearcoat: 0.15,
          clearcoatRoughness: 0.55,
          attenuationColor: new THREE.Color("#4ade80"),
          attenuationDistance: 7.0,
          envMapIntensity: 1.0,
        });
        gather.push(o.material);
      } else {

        if (Array.isArray(o.material)) {
          o.material = o.material.map((m) => {
            const nm = m.clone();
            if ("vertexColors" in nm && o.geometry?.attributes?.color) nm.vertexColors = true;
            if ("envMapIntensity" in nm) nm.envMapIntensity = 1.0;
            nm.needsUpdate = true;
            gather.push(nm);
            return nm;
          });
        } else if (o.material) {
          const nm = o.material.clone();
          if ("vertexColors" in nm && o.geometry?.attributes?.color) nm.vertexColors = true;
          if ("envMapIntensity" in nm) nm.envMapIntensity = 1.0;
          nm.needsUpdate = true;
          o.material = nm;
          gather.push(nm);
        }
      }
    });

    root.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    root.position.sub(center);
    const scaleFit = TARGET_MAX_DIM / maxDim;

    return { root, scaleFit, materials: gather };
  }, [scene, variant]);

  useEffect(() => {
    for (const m of materials) {
      m.transparent = true;
      m.opacity = opacity;
      m.depthWrite = opacity > 0.999;
    }
  }, [materials, opacity]);

  const finalScale = scaleFit * variantAdjust * extraScale;

  return (
    <group scale={finalScale}>
      <primitive object={root} />
    </group>
  );
}

useGLTF.preload("/models/ps1_controller.glb");
useGLTF.preload("/models/music_note.glb");
useGLTF.preload("/models/paint_brush.glb");

export default function CreativeJourneyMorph({
  initial = "plumbob",
  autoCycle = true,
  interval = 4800,
  plumbobSrc = "/models/ps1_controller.glb",
  noteSrc = "/models/music_note.glb",
  brushSrc = "/models/paint_brush.glb",
}) {
  const VARIANT_VISUAL_ADJUST = {
  default: 1.0,  
  note: 0.8,
  brush: 1.0,
};

  const MODELS = useMemo(
    () => [

      { key: "plumbob", variant: "default", src: plumbobSrc },
      { key: "note",     variant: "note",    src: noteSrc },
      { key: "brush",    variant: "brush",   src: brushSrc },
    ],
    [plumbobSrc, noteSrc, brushSrc]
  );


  const startIndex = Math.max(0, MODELS.findIndex((m) => m.key === initial.toLowerCase()));
  const [curr, setCurr] = useState(startIndex);
  const [prev, setPrev] = useState(null);
  const [fade, setFade] = useState(1);

  useEffect(() => {
    if (!autoCycle) return;
    const id = setInterval(() => {
      const next = (curr + 1) % MODELS.length;
      setPrev(curr);
      setCurr(next);
      setFade(0);
      const stop = tween({
        duration: 900,
        onUpdate: (t) => setFade(t),
        onComplete: () => setPrev(null),
      });
      return () => stop();
    }, interval);
    return () => clearInterval(id);
  }, [autoCycle, curr, interval, MODELS.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next =
        e.key === "ArrowRight"
          ? (curr + 1) % MODELS.length
          : (curr - 1 + MODELS.length) % MODELS.length;
      setPrev(curr);
      setCurr(next);
      setFade(0);
      const stop = tween({
        duration: 900,
        onUpdate: (t) => setFade(t),
        onComplete: () => setPrev(null),
      });
      return () => stop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [curr, MODELS.length]);

  const currCfg = MODELS[curr];
  const prevCfg = prev != null ? MODELS[prev] : null;

  return (
    <div className="morphFloat" style={{ position: "relative", height: "clamp(420px, 58vh, 700px)" }}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.9, 3.2], fov: 38, near: 0.01, far: 100 }}
        gl={{
          alpha: true,
          antialias: true,
          logarithmicDepthBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        shadows
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={0.9} color="#fff2e0" castShadow />
        <directionalLight position={[-2, 2, -2]} intensity={0.45} color="#dff8ff" />
        <Environment preset="studio" environmentIntensity={0.9} />

        <Suspense fallback={null}>
          {prevCfg && (
            <RecenteredGLTF
              key={`prev-${prevCfg.key}`}
              src={prevCfg.src}
              variant={prevCfg.variant}
              variantAdjust={VARIANT_VISUAL_ADJUST[prevCfg.variant] ?? 1}
              opacity={1 - fade}
            />
          )}
          <RecenteredGLTF
            key={`curr-${currCfg.key}`}
            src={currCfg.src}
            variant={currCfg.variant}
            variantAdjust={VARIANT_VISUAL_ADJUST[currCfg.variant] ?? 1}
            opacity={fade}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={1.2}
          maxDistance={6}
          rotateSpeed={0.9}
          zoomSpeed={0.8}
          autoRotate
          autoRotateSpeed={1}   
        />

      </Canvas>

      <div
        style={{
          position: "absolute",
          right: 12,
          bottom: 10,
          fontSize: 12,
          color: "rgba(231,231,234,.55)",
          userSelect: "none",
        }}
      >
        drag to rotate • scroll to zoom
      </div>
    </div>
  );
}
