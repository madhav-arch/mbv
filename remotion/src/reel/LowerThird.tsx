import { interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { COLORS, FONTS } from "../blueprint/theme";

export type Beat = {
  from: number;
  durationInFrames: number;
  icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  kicker: string;
  headline: string;
  sub?: string;
};

// A frosted lower-third with an animated icon chip. Slides + wipes in on a
// spring, holds, then eases out — the per-beat "graphic transition".
const Card: React.FC<Omit<Beat, "from" | "durationInFrames"> & { life: number }> = ({
  icon: Icon,
  kicker,
  headline,
  sub,
  life,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.7 }, durationInFrames: 26 });
  const exit = interpolate(frame, [life - 16, life], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(enter, [0, 1], [-70, 0]) + interpolate(exit, [0, 1], [0, 40]);
  const opacity = enter * (1 - exit);
  const wipe = interpolate(enter, [0, 1], [0, 100]);

  return (
    <div
      style={{
        position: "absolute",
        left: 44,
        right: 44,
        bottom: 470,
        transform: `translateX(${x}px)`,
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "22px 26px",
          borderRadius: 20,
          background: "rgba(8,22,38,0.46)",
          border: "1px solid rgba(125,211,252,0.28)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          clipPath: `inset(0 ${100 - wipe}% 0 0 round 20px)`,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 78,
            height: 78,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(150deg, rgba(56,189,248,0.22), rgba(244,199,123,0.18))",
            border: "1px solid rgba(255,255,255,0.16)",
            color: COLORS.goldBright,
          }}
        >
          <Icon size={42} color={COLORS.goldBright} strokeWidth={3} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 15, letterSpacing: "0.26em", textTransform: "uppercase", color: COLORS.cyanBright }}>
            {kicker}
          </div>
          <div style={{ fontFamily: FONTS.display, fontSize: 46, fontWeight: 800, lineHeight: 1.04, color: "#fff", marginTop: 6, textShadow: "0 2px 18px rgba(0,0,0,0.5)" }}>
            {headline}
          </div>
          {sub ? (
            <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.78)", marginTop: 8 }}>{sub}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const LowerThird: React.FC<{ beat: Beat }> = ({ beat }) => (
  <Sequence from={beat.from} durationInFrames={beat.durationInFrames} layout="none">
    <Card icon={beat.icon} kicker={beat.kicker} headline={beat.headline} sub={beat.sub} life={beat.durationInFrames} />
  </Sequence>
);
