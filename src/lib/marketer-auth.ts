import { redirect } from "@tanstack/react-router";
import { isDemoMode } from "./auth-mode";
import { getDemoSession } from "./demo-auth";
import { hasSiteAccess, isAuthenticated } from "./temp-auth";

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

/** Public site pages need only the /protect site session, not an account session. */
export async function requireSiteAccess() {
  if (hasSiteAccess()) return;
  return requireMarketerAccess("/protect");
}
