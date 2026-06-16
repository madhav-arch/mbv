import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { COLORS, FONTS } from "./theme";

type Props = {
  delay: number;
  prefix?: string;
  to: number;
  decimals?: number;
  suffix?: string;
  label: string;
};

// A blueprint-framed metric with a count-up number.
export const StatCard: React.FC<Props> = ({ delay, prefix = "", to, decimals = 0, suffix = "", label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;

  const enter = spring({ frame: f, fps, config: { damping: 200, mass: 0.6 }, durationInFrames: 30 });
  const y = interpolate(enter, [0, 1], [26, 0]);

  const counted = interpolate(f, [4, 40], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const value = counted.toFixed(decimals);

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${y}px)`,
        width: 300,
        padding: "26px 28px",
        borderRadius: 14,
        background: "rgba(12, 34, 58, 0.45)",
        border: `1px solid ${COLORS.gridStrong}`,
        boxShadow: "0 18px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 58,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: COLORS.ink,
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <span style={{ color: COLORS.cyanBright, fontSize: 38, fontWeight: 700, marginRight: 2 }}>{prefix}</span>
        {value}
        <span style={{ color: COLORS.gold, fontSize: 38, fontWeight: 700, marginLeft: 4 }}>{suffix}</span>
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: FONTS.mono,
          fontSize: 14,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: COLORS.inkSoft,
        }}
      >
        {label}
      </div>
    </div>
  );
};
