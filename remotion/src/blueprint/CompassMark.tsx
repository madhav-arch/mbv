import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./theme";

// A drafting-compass emblem inside a rotating dashed ring.
// The compass "draws" itself via stroke-dashoffset, the ring rotates slowly.
export const CompassMark: React.FC<{ size?: number }> = ({ size = 188 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.9 }, durationInFrames: 40 });
  const scale = interpolate(enter, [0, 1], [0.6, 1]);
  const draw = interpolate(frame, [12, 48], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringSpin = frame * 0.35;
  const float = Math.sin(frame / 40) * 6;

  const c = size / 2;
  const dash = 560;

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `translateY(${float}px) scale(${scale})`,
        opacity: enter,
        filter: `drop-shadow(0 0 18px rgba(56,189,248,0.45))`,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer rotating dashed ring */}
        <circle
          cx={c}
          cy={c}
          r={c - 6}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={2}
          strokeDasharray="3 10"
          opacity={0.7}
          style={{ transformOrigin: "center", transform: `rotate(${ringSpin}deg)` }}
        />
        {/* Inner thin ring */}
        <circle cx={c} cy={c} r={c - 20} fill="none" stroke={COLORS.cyanBright} strokeWidth={1} opacity={0.35} />

        {/* Compass, drawn with dash offset */}
        <g
          fill="none"
          stroke={COLORS.goldBright}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dash}
          strokeDashoffset={dash * draw}
        >
          {/* pivot */}
          <circle cx={c} cy={c - 46} r={9} stroke={COLORS.gold} />
          {/* two legs */}
          <line x1={c} y1={c - 40} x2={c - 38} y2={c + 50} />
          <line x1={c} y1={c - 40} x2={c + 38} y2={c + 50} />
          {/* feet */}
          <line x1={c - 38} y1={c + 50} x2={c - 30} y2={c + 58} />
          <line x1={c + 38} y1={c + 50} x2={c + 24} y2={c + 60} />
          {/* radius arc swept by the compass */}
          <path d={`M ${c - 50} ${c + 58} A 70 70 0 0 1 ${c + 50} ${c + 58}`} stroke={COLORS.cyanBright} opacity={0.85} />
        </g>
      </svg>
    </div>
  );
};
