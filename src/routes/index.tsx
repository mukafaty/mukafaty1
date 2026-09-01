import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { HeroSection } from "@/components/site/HeroSection";
import { StepsSection } from "@/components/site/StepsSection";
import { Footer } from "@/components/site/Footer";
import { RequireAuth } from "@/lib/temp-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مكافآتي | منصة التسويق بالعمولة" },
      {
        name: "description",
        content:
          "مكافآتي منصة تسويق بالعمولة سعودية: سجّل مجانًا، شارك رابطك الخاص، وتابع نتائجك واستلم عمولاتك بسهولة.",
      },
      { property: "og:title", content: "مكافآتي | منصة التسويق بالعمولة" },
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
    <RequireAuth>
      <div dir="rtl" lang="ar" className="min-h-screen overflow-x-hidden bg-background">
        <Header />
        <main>
          <HeroSection />
          <StepsSection />
        </main>
        <Footer />
      </div>
    </RequireAuth>
  );
}
