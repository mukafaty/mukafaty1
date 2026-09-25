import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RequireAuth } from "@/lib/temp-auth";

export const Route = createFileRoute("/admin")({
  component: () => (
    <RequireAuth>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </RequireAuth>
  ),
});
