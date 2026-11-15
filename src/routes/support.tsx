import { createFileRoute } from "@tanstack/react-router";
import { Headset } from "lucide-react";
import { SupportLayout } from "@/components/support/SupportLayout";
import { getSupportPage } from "@/lib/support-auth.functions";

export const Route = createFileRoute("/support")({
  loader: () => getSupportPage(),
  staleTime: 0,
  gcTime: 0,
  head: () => ({
    meta: [
      { title: "الدعم | مكافآتي" },
      { name: "description", content: "لوحة الدعم الخاصة بمنصة مكافآتي." },
      { property: "og:title", content: "الدعم | مكافآتي" },
      { property: "og:description", content: "لوحة الدعم الخاصة بمنصة مكافآتي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const data = Route.useLoaderData();
  return (
    <SupportLayout>
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-admin-blue/10 text-admin-blue">
          <Headset size={30} />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold text-admin-navy md:text-3xl">{data.name}</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">{data.description}</p>
        </div>
      </div>
    </SupportLayout>
  );
}