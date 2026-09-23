import { createFileRoute } from "@tanstack/react-router";
import { PasswordPageContent } from "@/components/register/PasswordPageContent";

export const Route = createFileRoute("/password")({
  head: () => ({
    meta: [
      { title: "إنشاء كلمة المرور | مكافآتي" },
      {
        name: "description",
        content: "اختر كلمة مرور آمنة لإتمام إنشاء حسابك في برنامج مكافآتي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "إنشاء كلمة المرور | مكافآتي" },
      {
        property: "og:description",
        content: "اختر كلمة مرور آمنة لإتمام إنشاء حسابك في برنامج مكافآتي.",
      },
    ],
  }),
  component: PasswordPageContent,
});
