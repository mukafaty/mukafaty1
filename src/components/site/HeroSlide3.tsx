import { HeroImageSlide } from "./HeroImageSlide";
import desktopAsset from "@/assets/slide-3-desktop.jpg.asset.json";
import mobileAsset from "@/assets/slide-3-mobile.jpg.asset.json";

export function HeroSlide3() {
  return (
    <HeroImageSlide
      desktopUrl={desktopAsset.url}
      mobileUrl={mobileAsset.url}
      alt="خطوات بسيطة ومكافآت كثيرة مع مكافآتي"
      background="#F2F5FA"
    />
  );
}
