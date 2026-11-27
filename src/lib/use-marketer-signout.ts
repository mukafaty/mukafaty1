import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isDemoMode } from "./auth-mode";
import { clearDemoSession, getDemoSession } from "./demo-auth";
import { signOut } from "./temp-auth";

/** Both existing marketer sign-out affordances clear the same isolated session. */
export function useMarketerSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    const demo = isDemoMode() && Boolean(getDemoSession());
    if (isDemoMode()) clearDemoSession();
    else {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.auth.signOut();
    }
    signOut();
    await navigate({ to: demo || !isDemoMode() ? "/login" : "/protect", replace: true });
  };
}