import { createFileRoute } from "@tanstack/react-router";
import { LoginPageContent } from "@/components/register/LoginPageContent";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | مكافآتي" },
      {
        name: "description",
        content: "سجّل دخولك إلى حسابك في برنامج مكافآتي وتابع إنجازاتك وأرباحك.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "تسجيل الدخول | مكافآتي" },
      {
        property: "og:description",
        content: "سجّل دخولك إلى حسابك في برنامج مكافآتي وتابع إنجازاتك وأرباحك.",
      },
    ],
  }),
  component: LoginPageContent,
});
