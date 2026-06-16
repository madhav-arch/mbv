import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../blueprint/theme";

// Small persistent Blueprint Finance mark, top-left inside the safe area.
export const BrandBug: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spin = frame * 0.4;
  return (
    <div
      style={{
        position: "absolute",
        top: 104,
        left: 44,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: o,
      }}
    >
      <svg width={44} height={44} viewBox="0 0 44 44">
        <circle cx={22} cy={22} r={20} fill="none" stroke={COLORS.cyan} strokeWidth={1.6} strokeDasharray="2 7" opacity={0.8} style={{ transformOrigin: "center", transform: `rotate(${spin}deg)` }} />
        <g fill="none" stroke={COLORS.goldBright} strokeWidth={2} strokeLinecap="round">
          <circle cx={22} cy={13} r={3} />
          <line x1={22} y1={15} x2={14} y2={31} />
          <line x1={22} y1={15} x2={30} y2={31} />
          <path d="M14 31 A 11 11 0 0 0 30 31" stroke={COLORS.cyanBright} />
        </g>
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 19, letterSpacing: "0.04em", color: "#fff" }}>
          BLUEPRINT <span style={{ color: COLORS.goldBright }}>FINANCE</span>
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: "0.24em", color: "rgba(255,255,255,0.6)", marginTop: 3 }}>
          MORTGAGE · BANKING
        </div>
      </div>
    </div>
  );
};
