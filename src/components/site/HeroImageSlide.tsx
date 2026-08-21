import { Link } from "@tanstack/react-router";

type Props = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
  background: string;
  priority?: boolean;
};

export function HeroImageSlide({ desktopUrl, mobileUrl, alt, background, priority }: Props) {
  return (
    <div className="flex h-full w-full items-center" style={{ backgroundColor: background }}>
      <Link to="/dashboard" aria-label="ابدأ التسويق مع مكافآتي" className="block w-full">
      <picture className="block w-full">
        <source media="(min-width: 768px)" srcSet={desktopUrl} width={1920} height={823} />
        <img
          src={mobileUrl}
          width={1080}
          height={1350}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="mx-auto block h-auto w-full object-contain"
        />
      </picture>
      </Link>
    </div>
  );
}
