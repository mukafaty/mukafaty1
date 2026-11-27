import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isDemoMode } from "./auth-mode";
import { clearDemoSession } from "./demo-auth";
import { signOut } from "./temp-auth";

/** Both existing marketer sign-out affordances clear the same isolated session. */
export function useMarketerSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    if (isDemoMode()) clearDemoSession();
    else {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.auth.signOut();
    }
    signOut();
    await navigate({ to: "/", replace: true });
  };
}