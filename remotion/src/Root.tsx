import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { ReelComposition } from "./reel/ReelComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BlueprintReel"
        component={ReelComposition}
        durationInFrames={858}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BlueprintFinance"
        component={MyComposition}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
