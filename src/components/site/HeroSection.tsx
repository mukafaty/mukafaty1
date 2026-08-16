import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSlide1 } from "./HeroSlide1";
import { HeroSlide2 } from "./HeroSlide2";

const slides = [HeroSlide1, HeroSlide2];
const AUTOPLAY_MS = 5000;

const arrowClass =
  "flex h-11 w-11 items-center justify-center rounded-full border border-brand/30 bg-background text-navy shadow-[0_8px_20px_-12px_var(--navy)] transition-all duration-300 hover:bg-brand hover:text-primary-foreground";

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, index]);

  return (
    <section
      className="hero-surface relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="عروض مكافآتي"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index - 1);
        if (e.key === "ArrowLeft") go(index + 1);
      }}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const endX = e.changedTouches[0]?.clientX;
        if (endX === undefined) return;
        const dx = endX - touchStart.current;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        touchStart.current = null;
      }}
    >
      <div className="tech-dots pointer-events-none absolute inset-0 opacity-[0.18]" aria-hidden />

      <div className="relative">
        <div className="grid">
          {slides.map((Slide, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-hidden={i !== index}
              className={`col-start-1 row-start-1 transition-all duration-700 ease-out ${
                i === index
                  ? "pointer-events-auto translate-x-0 opacity-100"
                  : "pointer-events-none translate-x-2 opacity-0"
              }`}
            >
              <Slide />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-between sm:flex sm:px-2 lg:px-4">
          <button
            type="button"
            aria-label="السلايد التالي"
            onClick={() => go(index + 1)}
            className={`pointer-events-auto ${arrowClass}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="السلايد السابق"
            onClick={() => go(index - 1)}
            className={`pointer-events-auto ${arrowClass}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 pb-6 sm:hidden">
          <button
            type="button"
            aria-label="السلايد التالي"
            onClick={() => go(index + 1)}
            className={arrowClass}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="السلايد السابق"
            onClick={() => go(index - 1)}
            className={arrowClass}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 top-4 z-10 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`الانتقال إلى السلايد ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-7 bg-brand" : "w-2 bg-brand/25 hover:bg-brand/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
