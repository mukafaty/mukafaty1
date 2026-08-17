import desktopAsset from "@/assets/hero-slide3-desktop.jpg.asset.json";
import mobileAsset from "@/assets/hero-slide3-mobile.jpg.asset.json";

// Set to a URL later to make the whole slide clickable.
const SLIDE_LINK: string | null = null;

export function HeroSlide3() {
  const content = (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopAsset.url} width={2048} height={877} />
      <img
        src={mobileAsset.url}
        width={1152}
        height={2048}
        alt="جاهز لتبدأ رحلة مكافآتك؟ ابدأ التسويق مع مكافآتي"
        fetchPriority="high"
        decoding="async"
        className="mx-auto block h-auto w-full max-h-[78vh] object-contain md:max-h-none"
      />
    </picture>
  );

  return (
    <div className="flex h-full w-full items-center" style={{ backgroundColor: "#010930" }}>
      {SLIDE_LINK ? (
        <a href={SLIDE_LINK} className="block">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
