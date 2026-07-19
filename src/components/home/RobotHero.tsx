"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF, Float, ContactShadows } from "@react-three/drei";
import { usePrefersReducedMotion } from "@/lib/motion";

// ── Swap point for your own avatar ───────────────────────────────────────────
// Drop a Ready Player Me avatar in here (a .glb URL like
// https://models.readyplayer.me/<id>.glb, or a file in /public/models) and it
// takes over automatically. The head still tracks the cursor on the RPM rig;
// the wave/emote clips only exist on the fallback robot.
const AVATAR_URL: string | null = null;
const MODEL_URL = AVATAR_URL ?? "/models/robot.glb";
const IS_AVATAR = AVATAR_URL !== null;

const EMOTES = ["ThumbsUp", "Yes", "Wave", "Punch"] as const;

type RobotProps = {
  reduced: boolean;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
};

function Robot({ reduced, pointer }: RobotProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, mixer } = useAnimations(animations, group);
  const emoting = useRef(false);

  // Head bone drives cursor tracking; "Head" is the bone name on both the
  // RobotExpressive rig and the Ready Player Me humanoid rig.
  const head = useMemo(() => scene.getObjectByName("Head") ?? null, [scene]);

  // De-yellow the robot into a cool pearl-white so the blue/magenta rim lights
  // paint it (matching the theme) instead of fighting a saturated body colour.
  // Dark parts (eyes, joints) are left alone. Skipped for real avatars.
  useMemo(() => {
    if (IS_AVATAR) return;
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        const mat = m as THREE.MeshStandardMaterial;
        if (!mat.color) continue;
        const lum = 0.299 * mat.color.r + 0.587 * mat.color.g + 0.114 * mat.color.b;
        if (lum > 0.35) {
          mat.color.set("#e9e9ee");
          mat.metalness = 0.35;
          mat.roughness = 0.4;
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    const idle = actions.Idle;
    if (!idle) return;
    if (reduced) {
      idle.play();
      mixer.update(0);
      // eslint-disable-next-line react-hooks/immutability -- three.js mixers are mutable by design
      mixer.timeScale = 0;
      return;
    }
    const wave = actions.Wave;
    if (wave) {
      emoting.current = true;
      wave.setLoop(THREE.LoopOnce, 1);
      wave.reset().play();
      const onFinished = (e: { action: THREE.AnimationAction }) => {
        if (e.action !== wave) return;
        emoting.current = false;
        wave.fadeOut(0.35);
        idle.reset().fadeIn(0.35).play();
      };
      mixer.addEventListener("finished", onFinished);
      return () => mixer.removeEventListener("finished", onFinished);
    }
    idle.play();
  }, [actions, mixer, reduced]);

  const emote = () => {
    if (reduced || emoting.current) return;
    const idle = actions.Idle;
    const pick = EMOTES[Math.floor(Math.random() * EMOTES.length)];
    const action = actions[pick];
    if (!action || !idle) return;
    emoting.current = true;
    idle.fadeOut(0.25);
    action.setLoop(THREE.LoopOnce, 1);
    action.reset().fadeIn(0.25).play();
    const onFinished = (e: { action: THREE.AnimationAction }) => {
      if (e.action !== action) return;
      emoting.current = false;
      action.fadeOut(0.35);
      idle.reset().fadeIn(0.35).play();
      mixer.removeEventListener("finished", onFinished);
    };
    mixer.addEventListener("finished", onFinished);
  };

  useFrame((_, delta) => {
    if (!head || reduced) return;
    const k = Math.min(1, delta * 5);
    const targetY = pointer.current.x * 0.55;
    const targetX = -pointer.current.y * 0.3;
    // eslint-disable-next-line react-hooks/immutability -- posing a three.js bone requires mutation
    head.rotation.y += (targetY - head.rotation.y) * k;
     
    head.rotation.x += (targetX - head.rotation.x) * k;
  });

  return (
    <group
      ref={group}
      position={IS_AVATAR ? [0, -1.5, 0] : [0, -1.55, 0]}
      scale={IS_AVATAR ? 1.5 : 0.66}
      rotation={[0, -0.22, 0]}
      onClick={emote}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

/**
 * The hero's 3D companion: a de-yellowed CC0 robot ("RobotExpressive" by
 * Tomás Laulhé / Don McCurdy) lit with blue + magenta rim lights and a
 * contact shadow so it reads as an intentional, grounded centrepiece rather
 * than a floating sprite. Waves on load, idles, watches the cursor, emotes on
 * click. Swap AVATAR_URL above to use a Ready Player Me avatar of yourself.
 *
 * Budget: md+ only (parent-gated), renders only while on screen, single
 * ~464 KB GLB with no external HDR/textures.
 */
export default function RobotHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [scrolling, setScrolling] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver(
      (entries) => setVisible(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0 },
    );
    io.observe(el);

    // Freeze the canvas while the page is actively scrolling: the subtle
    // head-track/float isn't noticed mid-scroll, and giving the main thread
    // back to the scroll keeps it buttery. Resumes ~150ms after scroll stops.
    let idleTimer: ReturnType<typeof setTimeout>;
    let isScrolling = false;
    const onScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        setScrolling(true);
      }
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isScrolling = false;
        setScrolling(false);
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idleTimer);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="w-full h-full relative" aria-hidden>
      {/* Rim-light halo behind the model — the effect that makes the reference
          character pop. Two offset blobs (magenta + blue) in the theme accent. */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] aspect-square rounded-full bg-[var(--syntax-magenta)] opacity-20 blur-[70px] pointer-events-none" />
      <div className="absolute left-[58%] top-[46%] -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square rounded-full bg-[var(--accent)] opacity-20 blur-[60px] pointer-events-none" />
      <Canvas
        frameloop={visible && !scrolling ? "always" : "never"}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.4, 6.2], fov: 38 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.9} />
        {/* Key from front-right. */}
        <directionalLight position={[4, 6, 5]} intensity={2.4} />
        {/* Rim lights from behind, raking the silhouette edges. */}
        <pointLight position={[-3.5, 3, -3]} intensity={40} distance={20} color="#e879f9" />
        <pointLight position={[3.5, 1.5, -3]} intensity={35} distance={20} color="#60a5fa" />
        <Suspense fallback={null}>
          <Float
            speed={reduced ? 0 : 1.3}
            rotationIntensity={reduced ? 0 : 0.12}
            floatIntensity={reduced ? 0 : 0.5}
          >
            <Robot reduced={reduced} pointer={pointer} />
          </Float>
          <ContactShadows
            position={[0, -1.55, 0]}
            opacity={0.5}
            scale={9}
            blur={2.6}
            far={4}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
