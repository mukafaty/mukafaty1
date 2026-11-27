import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireMarketerAccess } from "@/lib/marketer-auth";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: () => requireMarketerAccess(),
  component: () => (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
  ),
});
