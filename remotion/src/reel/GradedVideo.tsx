import { AbsoluteFill, OffthreadVideo, staticFile, interpolate, useCurrentFrame } from "remotion";

// The source clip, scaled to cover 9:16, with a cinematic teal-orange grade
// built from CSS filters + blended colour layers. Reveals from black on entry.
export const GradedVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Intro reveal: scale + fade up from black over the first ~1s.
  const reveal = interpolate(frame, [0, 26], [0, 1], { extrapolateRight: "clamp" });
  const introScale = interpolate(frame, [0, 40], [1.12, 1.04], { extrapolateRight: "clamp" });
  // A very slow push-in keeps the locked-off phone shot feeling alive.
  const slowPush = interpolate(frame, [0, 858], [1.04, 1.1]);
  const scale = Math.max(introScale, slowPush);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          opacity: reveal,
          transform: `scale(${scale})`,
          // Core grade: lift contrast + saturation, nudge warmth.
          filter: "contrast(1.12) saturate(1.08) brightness(1.0) sepia(0.06) hue-rotate(-4deg)",
        }}
      >
        <OffthreadVideo
          src={staticFile("source.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Teal in the shadows */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(6,40,58,0.0) 30%, rgba(6,40,58,0.55) 100%)",
          mixBlendMode: "soft-light",
          opacity: reveal,
        }}
      />
      {/* Warm light in the highlights / centre */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(80% 55% at 50% 38%, rgba(255,168,92,0.22), rgba(255,168,92,0) 70%)",
          mixBlendMode: "soft-light",
          opacity: reveal,
        }}
      />
      {/* Cool top wash for depth */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(10,60,90,0.35) 0%, rgba(0,0,0,0) 35%)",
          mixBlendMode: "multiply",
          opacity: reveal * 0.8,
        }}
      />
    </AbsoluteFill>
  );
};
