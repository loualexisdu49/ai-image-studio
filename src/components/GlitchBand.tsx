// Bande de petits cubes "glitch" (blanc, gris, vert, noir) à la jonction des sections.
// Déterministe : même motif à chaque rendu. Change SEED pour un autre motif.
const SEED = 7;
const COLORS = ["var(--glitch-white)", "var(--glitch-white)", "var(--glitch-gray)", "var(--glitch-green)", "var(--glitch-black)"];

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function GlitchBand({ top, height, width = 1440, count = 140 }: { top: number; height: number; width?: number; count?: number }) {
  const r = rng(SEED);
  const blocks = Array.from({ length: count }, (_, i) => {
    const size = [8, 10, 12, 16, 20, 26, 34][Math.floor(r() * 7)] ?? 12;
    const wide = r() < 0.2;
    // plus dense vers le haut (côté herbe -> blanc)
    const y = top + Math.pow(r(), 1.6) * height;
    return {
      key: i,
      left: r() * width,
      top: y,
      w: wide ? size * (2 + Math.floor(r() * 3)) : size,
      h: size,
      color: COLORS[Math.floor(r() * COLORS.length)],
      opacity: r() < 0.15 ? 0.6 : 1,
    };
  });
  return (
    <div aria-hidden className="pointer-events-none">
      {blocks.map((b) => (
        <div key={b.key} style={{ position: "absolute", left: b.left, top: b.top, width: b.w, height: b.h, background: b.color, opacity: b.opacity }} />
      ))}
    </div>
  );
}
