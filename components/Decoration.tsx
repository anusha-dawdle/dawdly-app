"use client";

/**
 * Decoration layer — drop ornamental PNGs (tape, clips, pins, pressed flowers)
 * over cards at slightly randomized positions and angles.
 *
 * TO ADD ASSETS LATER:
 *   1. Drop PNG files into public/decorations/
 *   2. Add entries to DECORATION_ASSETS below
 *   3. The <Decoration> component will start rendering them automatically
 *
 * Usage:
 *   Wrap any card with position:relative, then place <Decoration seed="unique-id" />
 *   inside it. It renders position:absolute children so it doesn't affect layout.
 */

interface DecorationAsset {
  file: string;   // filename inside public/decorations/
  width: number;  // display width in px
  edges: ("top" | "bottom" | "left" | "right")[]; // which edges it can appear on
}

// ─── Add assets here when you have them ─────────────────────────────────────
const DECORATION_ASSETS: DecorationAsset[] = [
  // e.g. { file: "tape-yellow.png", width: 48, edges: ["top"] },
  // e.g. { file: "paperclip.png",   width: 24, edges: ["top", "right"] },
  // e.g. { file: "pin-red.png",     width: 20, edges: ["top"] },
];
// ─────────────────────────────────────────────────────────────────────────────

interface DecorationProps {
  seed: string;    // unique string (event id) for deterministic placement
  density?: number; // 0–1, default 0.5 — how likely any decoration appears
}

export default function Decoration({ seed, density = 0.5 }: DecorationProps) {
  if (DECORATION_ASSETS.length === 0) return null;

  // Seeded pseudo-random from the event id
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  const rand = (n: number) => { h = (Math.imul(1664525, h) + 1013904223) | 0; return Math.abs(h) % n; };

  if (rand(100) > density * 100) return null;

  const asset = DECORATION_ASSETS[rand(DECORATION_ASSETS.length)];
  const edge = asset.edges[rand(asset.edges.length)];
  const offset = rand(60) + 10; // 10–70% along the edge

  const posStyle: React.CSSProperties = {
    position: "absolute",
    width: asset.width,
    height: "auto",
    pointerEvents: "none",
    zIndex: 10,
    transform: `rotate(${(rand(20) - 10)}deg)`,
    ...(edge === "top"    && { top: -asset.width * 0.35, left: `${offset}%`, transform: `translateX(-50%) rotate(${rand(20) - 10}deg)` }),
    ...(edge === "bottom" && { bottom: -asset.width * 0.35, left: `${offset}%`, transform: `translateX(-50%) rotate(${rand(20) - 10}deg)` }),
    ...(edge === "left"   && { left: -asset.width * 0.35, top: `${offset}%`, transform: `translateY(-50%) rotate(${rand(20) - 10}deg)` }),
    ...(edge === "right"  && { right: -asset.width * 0.35, top: `${offset}%`, transform: `translateY(-50%) rotate(${rand(20) - 10}deg)` }),
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/decorations/${asset.file}`}
      alt=""
      aria-hidden
      style={posStyle}
    />
  );
}
