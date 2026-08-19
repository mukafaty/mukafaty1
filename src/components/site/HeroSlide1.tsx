import { HeroImageSlide } from "./HeroImageSlide";
import desktopAsset from "@/assets/slide-1-desktop.jpg.asset.json";
import mobileAsset from "@/assets/slide-1-mobile.jpg.asset.json";

export function HeroSlide1() {
  return (
    <HeroImageSlide
      desktopUrl={desktopAsset.url}
      mobileUrl={mobileAsset.url}
      alt="حوّل تأثيرك إلى مكافآت — برنامج تسويق بالعمولة يحقق لك الأرباح"
      background="#F2F5FA"
      priority
    />
  );
}
