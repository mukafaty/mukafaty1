import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Returns the marketer's existing short link for the ad (creates it once if missing). */
export function useShortLink(adSlug: string) {
  const [shortLink, setShortLink] = useState("جارٍ تجهيز الرابط...");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        if (active) setShortLink("سجّل الدخول لإنشاء رابطك المختصر");
        return;
      }
      const { data, error } = await supabase.rpc("get_or_create_short_link", {
        _ad_slug: adSlug,
      });
      if (!active) return;
      if (error || !data) setShortLink("تعذّر إنشاء الرابط المختصر");
      else {
        setShortLink(`https://mukafaty.com/r/${data}`);
        setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [adSlug]);
  return { shortLink, ready };
}
