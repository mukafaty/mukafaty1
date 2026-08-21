import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { PagePlaceholder } from "@/components/dashboard/PagePlaceholder";

export const Route = createFileRoute("/dashboard/top")({
  head: () => ({
    meta: [
      { title: "المتميزون | لوحة تحكم مكافآتي" },
      { name: "description", content: "لوحة شرف أفضل المسوقين في مكافآتي." },
      { property: "og:title", content: "المتميزون | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "لوحة شرف أفضل المسوقين في مكافآتي." },
    ],
  }),
  component: () => (
    <PagePlaceholder title="المتميزون" description="لوحة شرف أفضل المسوقين في مكافآتي." icon={Trophy} />
  ),
});
