import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PagePlaceholder } from "@/components/dashboard/PagePlaceholder";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "إعدادات الحساب | لوحة تحكم مكافآتي" },
      { name: "description", content: "بيانات حسابك وتفضيلاتك." },
      { property: "og:title", content: "إعدادات الحساب | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "بيانات حسابك وتفضيلاتك." },
    ],
  }),
  component: () => (
    <PagePlaceholder title="إعدادات الحساب" description="بيانات حسابك وتفضيلاتك." icon={Settings} />
  ),
});
