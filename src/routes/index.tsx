import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { HeroSection } from "@/components/site/HeroSection";
import { StepsSection } from "@/components/site/StepsSection";
import { Footer } from "@/components/site/Footer";
import { requireSiteAccess } from "@/lib/marketer-auth";

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: () => requireSiteAccess(),
  head: () => ({
    meta: [
      { title: "مكافآتي | منصة التسويق بالعمولة" },
      {
        name: "description",
        content:
          "مكافآتي منصة تسويق بالعمولة سعودية: سجّل مجانًا، شارك رابطك الخاص، وتابع نتائجك واستلم عمولاتك بسهولة.",
      },
      { property: "og:title", content: "مكافآتي | منصة التسويق بالعمولة" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "مكافآتي منصة تسويق بالعمولة سعودية: سجّل مجانًا، شارك رابطك الخاص، وتابع نتائجك واستلم عمولاتك بسهولة.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <div dir="rtl" lang="ar" className="min-h-screen overflow-x-hidden bg-background">
        <Header />
        <main>
          <HeroSection />
          <div className="flex flex-col md:min-h-dvh">
            <StepsSection />
            <Footer />
          </div>
        </main>
      </div>
    </>
  );
}
