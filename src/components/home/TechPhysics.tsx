"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  BallCollider,
  Physics,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import {
  siReact,
  siNextdotjs,
  siTypescript,
  siTailwindcss,
  siNodedotjs,
  siGreensock,
  siVercel,
  siGit,
  siBun,
  siHono,
  siDrizzle,
  siJavascript,
  type SimpleIcon,
} from "simple-icons";

type BrandSpec = { icon: SimpleIcon; size: number };

// The stack, biggest = most-used. Real vector brand marks, not text.
const BRANDS: BrandSpec[] = [
  { icon: siReact, size: 1.35 },
  { icon: siNextdotjs, size: 1.4 },
  { icon: siTypescript, size: 1.3 },
  { icon: siGreensock, size: 1.15 },
  { icon: siTailwindcss, size: 1.1 },
  { icon: siNodedotjs, size: 1.05 },
  { icon: siJavascript, size: 0.95 },
  { icon: siVercel, size: 0.95 },
  { icon: siHono, size: 0.85 },
  { icon: siDrizzle, size: 0.85 },
  { icon: siBun, size: 0.8 },
  { icon: siGit, size: 0.8 },
];

/** Only used by the reduced-motion / mobile fallback chip grid. */
export type TechBall = { label: string; accent?: boolean };

/** Brand hexes that are near-black read as invisible on a dark ball; lift them
 *  to a bright neutral so the mark still glows. */
function displayColor(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.22 ? "#f4f4f5" : `#${hex}`;
}

/**
 * A glossy obsidian ball with the brand mark painted on twice (front + back)
 * so it reads from any angle. The same canvas is used as both the color map and
 * the emissive map, so the coloured logo glows while the dark body stays dark —
 * premium in both light and dark themes.
 */
function makeBallTexture(icon: SimpleIcon): THREE.CanvasTexture {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S / 2;
  const ctx = canvas.getContext("2d")!;

  // Obsidian body with a soft radial sheen for form even before lighting.
  const grad = ctx.createLinearGradient(0, 0, 0, S / 2);
  grad.addColorStop(0, "#26262b");
  grad.addColorStop(0.5, "#161619");
  grad.addColorStop(1, "#0b0b0d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S / 2);

  const color = displayColor(icon.hex);
  const path = new Path2D(icon.path);
  const logo = 150; // rendered px for the 24-unit icon
  const scale = logo / 24;

  // Draw the mark at 1/4 and 3/4 width -> visible on the front and back faces.
  for (const cx of [S * 0.25, S * 0.75]) {
    ctx.save();
    ctx.translate(cx - logo / 2, S / 4 - logo / 2);
    ctx.scale(scale, scale);
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.fillStyle = color;
    ctx.fill(path);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function Ball({
  spec,
  texture,
  index,
}: {
  spec: BrandSpec;
  texture: THREE.Texture;
  index: number;
}) {
  const body = useRef<RapierRigidBody>(null);
  const radius = spec.size;
  const start = useMemo<[number, number, number]>(() => {
    const angle = index * 2.39996; // golden-angle scatter
    const dist = 3.5 + (index % 4) * 1.6;
    return [Math.cos(angle) * dist, Math.sin(angle) * dist, 0];
  }, [index]);

  useFrame((_, delta) => {
    const b = body.current;
    if (!b) return;
    const p = b.translation();
    const len = Math.hypot(p.x, p.y, p.z) || 1;
    const k = -15 * Math.min(delta, 0.033) * radius;
    b.applyImpulse({ x: (p.x / len) * k, y: (p.y / len) * k, z: 0 }, true);
  });

  return (
    <RigidBody
      ref={body}
      colliders="ball"
      position={start}
      linearDamping={1.5}
      angularDamping={0.6}
      restitution={0.5}
      friction={0.15}
      enabledTranslations={[true, true, false]}
    >
      <mesh scale={radius} castShadow>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.5}
          roughness={0.28}
          metalness={0.35}
          envMapIntensity={0.6}
        />
      </mesh>
    </RigidBody>
  );
}

/** Invisible kinematic collider glued to the cursor: bats the balls around. */
function Pointer() {
  const body = useRef<RapierRigidBody>(null);
  const { viewport, pointer } = useThree();
  useFrame(() => {
    body.current?.setNextKinematicTranslation({
      x: (pointer.x * viewport.width) / 2,
      y: (pointer.y * viewport.height) / 2,
      z: 0,
    });
  });
  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false}>
      <BallCollider args={[1.5]} />
    </RigidBody>
  );
}

export default function TechPhysics() {
  const [visible, setVisible] = useState(true);
  const [scrolling, setScrolling] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const active = visible && !scrolling;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0 },
    );
    io.observe(el);

    // Freeze physics while the page is actively scrolling so the scroll stays
    // smooth; resume shortly after it stops (you interact with the balls when
    // stationary, not mid-scroll).
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
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idleTimer);
      io.disconnect();
    };
  }, []);

  const textures = useMemo(() => BRANDS.map((b) => makeBallTexture(b.icon)), []);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  return (
    <div ref={wrapRef} className="w-full h-full" aria-hidden>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 16], fov: 34 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 8, 6]} intensity={1.6} />
        {/* Coloured rim lights rake the obsidian balls so they read against
            any background and pick up the brand palette. */}
        <pointLight position={[-9, 4, 6]} intensity={90} distance={40} color="#60a5fa" />
        <pointLight position={[9, -5, 5]} intensity={70} distance={40} color="#e879f9" />
        <Physics gravity={[0, 0, 0]} paused={!active}>
          <Pointer />
          {BRANDS.map((spec, i) => (
            <Ball key={spec.icon.slug} spec={spec} texture={textures[i]} index={i} />
          ))}
        </Physics>
      </Canvas>
    </div>
  );
}
