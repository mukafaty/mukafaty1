import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { PagePlaceholder } from "@/components/dashboard/PagePlaceholder";

export const Route = createFileRoute("/dashboard/ads")({
  head: () => ({
    meta: [
      { title: "تسويق الإعلانات | لوحة تحكم مكافآتي" },
      { name: "description", content: "المواد الإعلانية والروابط الترويجية الجاهزة للمشاركة." },
      { property: "og:title", content: "تسويق الإعلانات | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "المواد الإعلانية والروابط الترويجية الجاهزة للمشاركة." },
    ],
  }),
  component: () => (
    <PagePlaceholder title="تسويق الإعلانات" description="المواد الإعلانية والروابط الترويجية الجاهزة للمشاركة." icon={Megaphone} />
  ),
});
