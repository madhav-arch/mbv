import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { COLORS, FONTS } from "../blueprint/theme";

// Opening stamp: compass + wordmark flashes on over the first beat, then clears.
export const IntroTitle: React.FC = () => (
  <Sequence from={4} durationInFrames={58} layout="none">
    <Inner />
  </Sequence>
);

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.8 }, durationInFrames: 24 });
  const exit = interpolate(frame, [42, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = enter * (1 - exit);
  const scale = interpolate(enter, [0, 1], [0.86, 1]);
  const spin = frame * 1.2;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <AbsoluteFill style={{ background: "rgba(2,8,16,0.45)", opacity: 1 - exit }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${scale})` }}>
        <svg width={120} height={120} viewBox="0 0 120 120">
          <circle cx={60} cy={60} r={54} fill="none" stroke={COLORS.cyan} strokeWidth={2} strokeDasharray="3 10" opacity={0.85} style={{ transformOrigin: "center", transform: `rotate(${spin}deg)` }} />
          <g fill="none" stroke={COLORS.goldBright} strokeWidth={3.2} strokeLinecap="round">
            <circle cx={60} cy={38} r={7} />
            <line x1={60} y1={43} x2={42} y2={84} />
            <line x1={60} y1={43} x2={78} y2={84} />
            <path d="M40 84 A 22 22 0 0 0 80 84" stroke={COLORS.cyanBright} />
          </g>
        </svg>
        <div style={{ marginTop: 22, fontFamily: FONTS.display, fontSize: 56, fontWeight: 800, color: "#fff", letterSpacing: "0.02em", textShadow: "0 2px 22px rgba(0,0,0,0.6)" }}>
          BLUEPRINT <span style={{ color: COLORS.goldBright }}>FINANCE</span>
        </div>
        <div style={{ marginTop: 12, fontFamily: FONTS.mono, fontSize: 16, letterSpacing: "0.42em", color: COLORS.cyanBright }}>
          MORTGAGE &nbsp;·&nbsp; BANKING
        </div>
      </div>
    </AbsoluteFill>
  );
};
