import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from "remotion";
import { COLORS, FONTS } from "./theme";
import { BlueprintGrid } from "./BlueprintGrid";
import { CompassMark } from "./CompassMark";
import { StatCard } from "./StatCard";

export const BlueprintScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Gentle overall fade-out at the very end.
  const outro = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: outro }}>
      <BlueprintGrid />

      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        {/* Emblem */}
        <Sequence from={12} layout="none">
          <CompassMark />
        </Sequence>

        {/* Brand wordmark */}
        <Wordmark />

        {/* Animated rule */}
        <Rule />

        {/* Subtitle */}
        <Subtitle />

        {/* Stats */}
        <div style={{ display: "flex", gap: 28, marginTop: 56 }}>
          <StatCard delay={96} prefix="$" to={4.2} decimals={1} suffix="B" label="Assets Under Management" />
          <StatCard delay={108} to={30} suffix="+" label="Years of Market Mastery" />
          <StatCard delay={120} to={98} suffix="%" label="Client Retention Rate" />
        </div>

        {/* Closing line */}
        <Closing />
      </AbsoluteFill>

      {/* #1 ranked badge */}
      <RankBadge fps={fps} />
    </AbsoluteFill>
  );
};

const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - 30;
  const enter = spring({ frame: f, fps, config: { damping: 200 }, durationInFrames: 34 });
  const y = interpolate(enter, [0, 1], [30, 0]);
  const blur = interpolate(enter, [0, 1], [12, 0]);

  return (
    <div
      style={{
        marginTop: 30,
        opacity: enter,
        transform: `translateY(${y}px)`,
        filter: `blur(${blur}px)`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: "0.02em",
          lineHeight: 1,
          color: COLORS.ink,
          textShadow: "0 0 40px rgba(56,189,248,0.25)",
        }}
      >
        BLUEPRINT{" "}
        <span
          style={{
            background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldBright})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          FINANCE
        </span>
      </div>
    </div>
  );
};

const Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [56, 86], [0, 520], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        marginTop: 22,
        height: 2,
        width: w,
        background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, transparent)`,
        boxShadow: `0 0 14px ${COLORS.cyan}`,
      }}
    />
  );
};

const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [70, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [70, 96], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        marginTop: 20,
        opacity: o,
        transform: `translateY(${y}px)`,
        fontFamily: FONTS.mono,
        fontSize: 19,
        letterSpacing: "0.42em",
        textTransform: "uppercase",
        color: COLORS.cyanBright,
      }}
    >
      Architecting Your Financial Future
    </div>
  );
};

const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - 210;
  const enter = spring({ frame: f, fps, config: { damping: 200, mass: 0.8 }, durationInFrames: 36 });
  const y = interpolate(enter, [0, 1], [22, 0]);
  return (
    <div
      style={{
        marginTop: 52,
        opacity: enter,
        transform: `translateY(${y}px)`,
        fontFamily: FONTS.serif,
        fontStyle: "italic",
        fontSize: 40,
        color: COLORS.ink,
        textAlign: "center",
      }}
    >
      The best firm.{" "}
      <span style={{ color: COLORS.gold }}>By design.</span>
    </div>
  );
};

const RankBadge: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const f = frame - 50;
  const enter = spring({ frame: f, fps, config: { damping: 12, mass: 0.7 }, durationInFrames: 40 });
  const rot = interpolate(enter, [0, 1], [-16, -8]);
  const pulse = 1 + Math.sin(frame / 18) * 0.02;
  return (
    <div
      style={{
        position: "absolute",
        top: 96,
        right: 120,
        opacity: enter,
        transform: `rotate(${rot}deg) scale(${enter * pulse})`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 150,
          height: 150,
          borderRadius: "50%",
          border: `2px solid ${COLORS.gold}`,
          background: "radial-gradient(circle at 50% 35%, rgba(244,199,123,0.16), rgba(4,16,31,0.2))",
          boxShadow: `0 0 30px rgba(244,199,123,0.35)`,
        }}
      >
        <div style={{ fontFamily: FONTS.display, fontSize: 52, fontWeight: 800, color: COLORS.goldBright, lineHeight: 1 }}>
          #1
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: FONTS.mono,
            fontSize: 11,
            letterSpacing: "0.22em",
            color: COLORS.gold,
            textTransform: "uppercase",
          }}
        >
          Ranked Advisory
        </div>
      </div>
    </div>
  );
};
