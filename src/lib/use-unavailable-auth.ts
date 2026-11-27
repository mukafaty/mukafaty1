import { useEffect } from "react";
import { toast } from "sonner";
import { isDemoMode, UNAVAILABLE_MESSAGE } from "./auth-mode";

export function unavailableDemoService() {
  if (!isDemoMode()) return false;
  toast.error(UNAVAILABLE_MESSAGE);
  return true;
}

/** Direct navigation retains the original form but announces its temporary lock. */
export function useUnavailableAuth() {
  useEffect(() => { if (isDemoMode()) toast.error(UNAVAILABLE_MESSAGE); }, []);
}