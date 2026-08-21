import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { PagePlaceholder } from "@/components/dashboard/PagePlaceholder";

export const Route = createFileRoute("/dashboard/balance")({
  head: () => ({
    meta: [
      { title: "رصيدي المالي | لوحة تحكم مكافآتي" },
      { name: "description", content: "رصيدك المتاح وسجل عمليات السحب." },
      { property: "og:title", content: "رصيدي المالي | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "رصيدك المتاح وسجل عمليات السحب." },
    ],
  }),
  component: () => (
    <PagePlaceholder title="رصيدي المالي" description="رصيدك المتاح وسجل عمليات السحب." icon={Wallet} />
  ),
});
