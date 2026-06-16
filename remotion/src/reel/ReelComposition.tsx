import { AbsoluteFill } from "remotion";
import { GradedVideo } from "./GradedVideo";
import { FilmLook } from "./FilmLook";
import { BrandBug } from "./BrandBug";
import { IntroTitle } from "./IntroTitle";
import { OutroCTA } from "./OutroCTA";
import { LowerThird, Beat } from "./LowerThird";
import { HouseIcon, PercentIcon, ChartIcon, ShieldIcon } from "./icons";

// ── Editable copy & timing ───────────────────────────────────────────────
// Beats are aligned to the four spoken phrases detected in the audio
// (pauses at ~11.4s, ~15.1s, ~22.4s). Change `headline`/`kicker`/`icon`
// freely; `from`/`durationInFrames` are in frames at 30fps.
const BEATS: Beat[] = [
  { from: 40, durationInFrames: 150, icon: HouseIcon, kicker: "First-home buyers", headline: "Buying your first home?" },
  { from: 200, durationInFrames: 140, icon: PercentIcon, kicker: "Sharper rates", headline: "Mortgages made simple." },
  { from: 360, durationInFrames: 96, icon: ChartIcon, kicker: "Smart lending", headline: "Rates that work harder." },
  { from: 470, durationInFrames: 200, icon: ShieldIcon, kicker: "Less stress", headline: "Less paperwork. More approvals.", sub: "We handle the banks for you." },
];

const OUTRO_FROM = 690; // ~23s — lands on the final spoken phrase
const HANDLE = "@blueprintfinance";
const WEBSITE = "blueprintfinance.co.nz";

export const ReelComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <GradedVideo />

      {/* Graphic callouts (each is its own Sequence) */}
      {BEATS.map((beat, i) => (
        <LowerThird key={i} beat={beat} />
      ))}

      <BrandBug />
      <IntroTitle />
      <OutroCTA from={OUTRO_FROM} durationInFrames={858 - OUTRO_FROM} handle={HANDLE} website={WEBSITE} />

      {/* Film treatment grades the whole stack */}
      <FilmLook />
    </AbsoluteFill>
  );
};
