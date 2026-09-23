import { createFileRoute } from "@tanstack/react-router";
import { ProfilePageContent } from "@/components/register/ProfilePageContent";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "إكمال بيانات الحساب | مكافآتي" },
      {
        name: "description",
        content: "أدخل اسمك الكامل ورقم جوالك لإكمال إنشاء حسابك في برنامج مكافآتي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "إكمال بيانات الحساب | مكافآتي" },
      {
        property: "og:description",
        content: "أدخل اسمك الكامل ورقم جوالك لإكمال إنشاء حسابك في برنامج مكافآتي.",
      },
    ],
  }),
  component: ProfilePageContent,
});
