GRANT INSERT ON public.short_links TO authenticated;
CREATE POLICY "Users create own short links" ON public.short_links FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND referral_code = (SELECT lower(p.member_number) FROM public.profiles p WHERE p.id = auth.uid())
  AND destination_url = 'https://mukafaty.com/ad/' || ad_slug || '?ref=' || referral_code
);
ALTER FUNCTION public.get_or_create_short_link(text) SECURITY INVOKER;
REVOKE EXECUTE ON FUNCTION public.resolve_short_link(text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_short_link(text) TO service_role;