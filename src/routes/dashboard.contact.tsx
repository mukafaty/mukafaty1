import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { PagePlaceholder } from "@/components/dashboard/PagePlaceholder";

export const Route = createFileRoute("/dashboard/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | لوحة تحكم مكافآتي" },
      { name: "description", content: "تواصل مع فريق دعم مكافآتي." },
      { property: "og:title", content: "تواصل معنا | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "تواصل مع فريق دعم مكافآتي." },
    ],
  }),
  component: () => (
    <PagePlaceholder title="تواصل معنا" description="تواصل مع فريق دعم مكافآتي." icon={Mail} />
  ),
});
