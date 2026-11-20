import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import { CANVAS, USER_WINDOW_TEXT, layers, type Layer } from "@/lib/portfolio-layers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lou-Alexis Cosnard — musicien, compositeur, mixeur son" },
      { name: "description", content: "Portfolio de Lou-Alexis Cosnard : projets persos, clips et autres projets audiovisuels." },
      { property: "og:title", content: "Lou-Alexis Cosnard — portfolio" },
      { property: "og:description", content: "Projets persos, clips et autres projets audiovisuels." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function LayerView({ l }: { l: Layer }) {
  const style: CSSProperties = {
    position: "absolute", left: l.x, top: l.y, width: l.w, height: l.h,
    opacity: l.opacity, transform: l.flipY ? "scaleY(-1)" : undefined,
  };
  if (l.kind === "rect") return <div style={{ ...style, background: l.color }} />;
  if (l.kind === "text")
    return (
      <div
        style={{
          ...style, height: "auto", whiteSpace: "pre-wrap", color: l.color,
          fontFamily: "Arial, Helvetica, sans-serif", fontWeight: l.weight === "Bold" ? 700 : 400,
          fontSize: l.size, lineHeight: l.lineHeight ? `${l.lineHeight}px` : 1.2,
          textAlign: (l.align as CSSProperties["textAlign"]) ?? "left",
        }}
      >
        {l.text}
      </div>
    );
  if (l.file?.startsWith("image-user"))
    return (
      <div style={style}>
        <img src={l.src} alt={l.name} data-layer={l.file} className="absolute inset-0 h-full w-full" />
        <div className="absolute bg-background" style={{ left: 10, top: 80, width: 276, height: 131 }} />
        <div
          className="absolute whitespace-pre text-foreground"
          style={{ left: 18, top: 98, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 44, lineHeight: "50px" }}
        >
          {USER_WINDOW_TEXT}
        </div>
      </div>
    );
  return <img src={l.src} alt={l.name} data-layer={l.file} style={{ ...style, objectFit: l.stretch ? "fill" : "cover" }} />;
}

function Index() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(window.innerWidth / CANVAS.width);
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return (
    <main className="w-full overflow-hidden bg-foreground" style={{ height: CANVAS.height * scale }}>
      <div
        className="relative origin-top-left overflow-hidden"
        style={{ width: CANVAS.width, height: CANVAS.height, transform: `scale(${scale})` }}
      >
        {layers.map((l, i) => <LayerView key={`${l.id}-${i}`} l={l} />)}
      </div>
    </main>
  );
}
