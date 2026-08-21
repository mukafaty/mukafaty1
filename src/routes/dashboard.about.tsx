import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { PagePlaceholder } from "@/components/dashboard/PagePlaceholder";

export const Route = createFileRoute("/dashboard/about")({
  head: () => ({
    meta: [
      { title: "عن البرنامج | لوحة تحكم مكافآتي" },
      { name: "description", content: "تفاصيل برنامج التسويق بالعمولة وشروط المكافآت." },
      { property: "og:title", content: "عن البرنامج | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "تفاصيل برنامج التسويق بالعمولة وشروط المكافآت." },
    ],
  }),
  component: () => (
    <PagePlaceholder title="عن البرنامج" description="تفاصيل برنامج التسويق بالعمولة وشروط المكافآت." icon={Info} />
  ),
});
