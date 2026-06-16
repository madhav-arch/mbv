import { AbsoluteFill, useCurrentFrame, random } from "remotion";

// Top-of-stack film treatment: vignette, animated grain, and thin cinematic
// letterbox bars. Sits above video + graphics so it grades the whole frame.
export const FilmLook: React.FC<{ barHeight?: number }> = ({ barHeight = 70 }) => {
  const frame = useCurrentFrame();

  // Re-seed the grain pattern a few times a second so it shimmers like film.
  const seed = Math.floor(frame / 2);
  const jx = (random(`gx${seed}`) - 0.5) * 6;
  const jy = (random(`gy${seed}`) - 0.5) * 6;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(75% 60% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Film grain */}
      <AbsoluteFill style={{ opacity: 0.06, mixBlendMode: "overlay", transform: `translate(${jx}px, ${jy}px)` }}>
        <svg width="110%" height="110%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>

      {/* Letterbox bars */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: barHeight, background: "#000" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: barHeight, background: "#000" }} />
    </AbsoluteFill>
  );
};
