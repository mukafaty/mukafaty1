import { redirect } from "@tanstack/react-router";
import { isDemoMode } from "./auth-mode";
import { getDemoSession } from "./demo-auth";
import { isAuthenticated } from "./temp-auth";

/** This gate grants only the existing mock marketer UI, never admin/support access. */
export async function requireMarketerAccess(destination: "/login" | "/protect" = "/login") {
  if (isAuthenticated()) return;
  if (isDemoMode()) {
    if (getDemoSession()) return;
  } else {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.auth.getUser();
    if (!error && data.user) return;
  }
  throw redirect({ to: destination, replace: true });
}