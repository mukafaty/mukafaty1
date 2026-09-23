import { createFileRoute } from "@tanstack/react-router";
import { LoginPasswordPageContent } from "@/components/register/LoginPasswordPageContent";

export const Route = createFileRoute("/login_/password")({
  head: () => ({
    meta: [
      { title: "كلمة المرور | تسجيل الدخول | مكافآتي" },
      { name: "description", content: "أدخل كلمة المرور لتسجيل الدخول إلى حسابك في مكافآتي." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "كلمة المرور | تسجيل الدخول | مكافآتي" },
      { property: "og:description", content: "أدخل كلمة المرور لتسجيل الدخول إلى حسابك في مكافآتي." },
    ],
  }),
  component: LoginPasswordPageContent,
});
