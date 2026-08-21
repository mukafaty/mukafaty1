import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PagePlaceholder } from "@/components/dashboard/PagePlaceholder";

export const Route = createFileRoute("/dashboard/clients")({
  head: () => ({
    meta: [
      { title: "عملائي | لوحة تحكم مكافآتي" },
      { name: "description", content: "قائمة العملاء والإحالات الخاصة بك." },
      { property: "og:title", content: "عملائي | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "قائمة العملاء والإحالات الخاصة بك." },
    ],
  }),
  component: () => (
    <PagePlaceholder title="عملائي" description="قائمة العملاء والإحالات الخاصة بك." icon={Users} />
  ),
});
