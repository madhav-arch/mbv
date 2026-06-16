import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { COLORS, FONTS } from "../blueprint/theme";

type Props = { from: number; durationInFrames: number; handle: string; website: string };

// Closing call-to-action: the graded video darkens + blurs behind a card that
// slides up with the brand, a one-line promise, and the social CTA.
export const OutroCTA: React.FC<Props> = ({ from, durationInFrames, handle, website }) => (
  <Sequence from={from} durationInFrames={durationInFrames} layout="none">
    <Inner handle={handle} website={website} />
  </Sequence>
);

const Inner: React.FC<{ handle: string; website: string }> = ({ handle, website }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dim = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const rise = spring({ frame: frame - 6, fps, config: { damping: 200, mass: 0.9 }, durationInFrames: 34 });
  const y = interpolate(rise, [0, 1], [80, 0]);
  const spin = frame * 0.9;
  const pulse = 1 + Math.sin(frame / 9) * 0.03;

  return (
    <AbsoluteFill>
      {/* darken + cool the held frame */}
      <AbsoluteFill style={{ background: "rgba(3,12,22,0.72)", opacity: dim, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: dim }}>
        <div style={{ transform: `translateY(${y}px)`, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 70px" }}>
          <svg width={132} height={132} viewBox="0 0 132 132">
            <circle cx={66} cy={66} r={60} fill="none" stroke={COLORS.cyan} strokeWidth={2} strokeDasharray="3 11" opacity={0.85} style={{ transformOrigin: "center", transform: `rotate(${spin}deg)` }} />
            <circle cx={66} cy={66} r={48} fill="none" stroke={COLORS.cyanBright} strokeWidth={1} opacity={0.3} />
            <g fill="none" stroke={COLORS.goldBright} strokeWidth={3.4} strokeLinecap="round">
              <circle cx={66} cy={42} r={8} />
              <line x1={66} y1={48} x2={46} y2={92} />
              <line x1={66} y1={48} x2={86} y2={92} />
              <path d="M44 92 A 24 24 0 0 0 88 92" stroke={COLORS.cyanBright} />
            </g>
          </svg>

          <div style={{ marginTop: 26, fontFamily: FONTS.display, fontSize: 60, fontWeight: 800, color: "#fff", letterSpacing: "0.01em" }}>
            BLUEPRINT <span style={{ color: COLORS.goldBright }}>FINANCE</span>
          </div>
          <div style={{ marginTop: 14, fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 30, color: "rgba(255,255,255,0.86)" }}>
            Your blueprint to home ownership.
          </div>

          <div
            style={{
              marginTop: 40,
              transform: `scale(${pulse})`,
              padding: "20px 46px",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldBright})`,
              color: "#0A1A2F",
              fontFamily: FONTS.display,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: "0.02em",
              boxShadow: "0 14px 40px rgba(244,199,123,0.4)",
            }}
          >
            DM us · Link in bio
          </div>

          <div style={{ marginTop: 30, fontFamily: FONTS.mono, fontSize: 22, letterSpacing: "0.12em", color: COLORS.cyanBright }}>
            {handle}
          </div>
          <div style={{ marginTop: 8, fontFamily: FONTS.mono, fontSize: 18, letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)" }}>
            {website}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
