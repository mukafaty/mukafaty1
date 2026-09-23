import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPageContent } from "@/components/register/ResetPasswordPageContent";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "تعيين كلمة مرور جديدة | مكافآتي" },
      { name: "description", content: "عيّن كلمة مرور جديدة لحسابك في مكافآتي." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "تعيين كلمة مرور جديدة | مكافآتي" },
      { property: "og:description", content: "عيّن كلمة مرور جديدة لحسابك في مكافآتي." },
    ],
  }),
  component: ResetPasswordPageContent,
});
