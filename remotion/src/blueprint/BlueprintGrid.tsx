import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { COLORS } from "./theme";

// Animated drafting grid that "draws" itself in, plus a slow drifting parallax
// and a couple of dimension/annotation marks for blueprint flavour.
export const BlueprintGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // The grid wipes in from the centre outward.
  const reveal = interpolate(frame, [0, 45], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Very slow drift to keep the surface alive.
  const drift = Math.sin(frame / 90) * 8;

  const minor = 48;
  const major = minor * 4;

  const verticals = Math.ceil(width / minor) + 2;
  const horizontals = Math.ceil(height / minor) + 2;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 120% at 50% 18%, ${COLORS.bgTop} 0%, ${COLORS.bgBottom} 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          transform: `translate(${drift}px, ${-drift}px)`,
          opacity: reveal,
          maskImage:
            "radial-gradient(120% 120% at 50% 45%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(120% 120% at 50% 45%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
        }}
      >
        <svg width={width} height={height} style={{ position: "absolute" }}>
          {Array.from({ length: verticals }).map((_, i) => {
            const x = i * minor - minor;
            const isMajor = i % 4 === 0;
            return (
              <line
                key={`v${i}`}
                x1={x}
                y1={0}
                x2={x}
                y2={height}
                stroke={isMajor ? COLORS.gridStrong : COLORS.grid}
                strokeWidth={isMajor ? 1.4 : 1}
              />
            );
          })}
          {Array.from({ length: horizontals }).map((_, i) => {
            const y = i * minor - minor;
            const isMajor = i % 4 === 0;
            return (
              <line
                key={`h${i}`}
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                stroke={isMajor ? COLORS.gridStrong : COLORS.grid}
                strokeWidth={isMajor ? 1.4 : 1}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* Corner registration / annotation marks */}
      <CornerTicks frame={frame} width={width} height={height} major={major} />

      {/* Soft vignette */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 320px 60px rgba(0,0,0,0.55)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const CornerTicks: React.FC<{
  frame: number;
  width: number;
  height: number;
  major: number;
}> = ({ frame, width, height, major }) => {
  const o = interpolate(frame, [20, 50], [0, 0.5], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const m = major;
  const arm = 26;
  const ticks = [
    [m, m],
    [width - m, m],
    [m, height - m],
    [width - m, height - m],
  ];
  return (
    <svg width={width} height={height} style={{ position: "absolute", opacity: o }}>
      {ticks.map(([x, y], i) => (
        <g key={i} stroke={COLORS.cyan} strokeWidth={1.4}>
          <line x1={x - arm} y1={y} x2={x + arm} y2={y} />
          <line x1={x} y1={y - arm} x2={x} y2={y + arm} />
          <circle cx={x} cy={y} r={5} fill="none" />
        </g>
      ))}
    </svg>
  );
};
