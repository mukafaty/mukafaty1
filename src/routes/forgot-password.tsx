import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPageContent } from "@/components/register/ForgotPasswordPageContent";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "استعادة كلمة المرور | مكافآتي" },
      { name: "description", content: "أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور في مكافآتي." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "استعادة كلمة المرور | مكافآتي" },
      { property: "og:description", content: "أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور في مكافآتي." },
    ],
  }),
  component: ForgotPasswordPageContent,
});
