import { createFileRoute } from "@tanstack/react-router";
import { RegisterPageContent } from "@/components/register/RegisterPageContent";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "إنشاء حساب | مكافآتي" },
      {
        name: "description",
        content: "أنشئ حسابك في برنامج مكافآتي وابدأ رحلتك في التسويق بالعمولة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "إنشاء حساب | مكافآتي" },
      {
        property: "og:description",
        content: "أنشئ حسابك في برنامج مكافآتي وابدأ رحلتك في التسويق بالعمولة.",
      },
    ],
  }),
  component: RegisterPageContent,
});