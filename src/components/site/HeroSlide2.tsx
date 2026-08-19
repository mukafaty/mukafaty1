import { HeroImageSlide } from "./HeroImageSlide";
import desktopAsset from "@/assets/slide-2-desktop.jpg.asset.json";
import mobileAsset from "@/assets/slide-2-mobile.jpg.asset.json";

export function HeroSlide2() {
  return (
    <HeroImageSlide
      desktopUrl={desktopAsset.url}
      mobileUrl={mobileAsset.url}
      alt="جاهز لتبدأ رحلة مكافآتك؟ ابدأ التسويق مع مكافآتي"
      background="#010930"
    />
  );
}
