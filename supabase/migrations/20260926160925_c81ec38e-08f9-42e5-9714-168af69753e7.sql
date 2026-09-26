CREATE TABLE public.short_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code text NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  ad_slug text NOT NULL,
  destination_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT short_links_owner_ad_unique UNIQUE (user_id, referral_code, ad_slug),
  CONSTRAINT short_links_code_format CHECK (short_code ~ '^[A-Za-z0-9]{5,12}$'),
  CONSTRAINT short_links_slug_format CHECK (ad_slug ~ '^[a-z0-9-]{1,80}$'),
  CONSTRAINT short_links_dest_domain CHECK (destination_url LIKE 'https://mukafaty.com/ad/%')
);
GRANT SELECT ON public.short_links TO authenticated;
GRANT ALL ON public.short_links TO service_role;
ALTER TABLE public.short_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own short links" ON public.short_links FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_short_links_updated_at BEFORE UPDATE ON public.short_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.get_or_create_short_link(_ad_slug text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _ref text;
  _code text;
  _alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  _i int;
  _attempt int := 0;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF _ad_slug IS NULL OR _ad_slug !~ '^[a-z0-9-]{1,80}$' THEN RAISE EXCEPTION 'invalid ad'; END IF;
  SELECT lower(member_number) INTO _ref FROM public.profiles WHERE id = _uid;
  IF _ref IS NULL THEN RAISE EXCEPTION 'profile not found'; END IF;

  SELECT short_code INTO _code FROM public.short_links WHERE user_id = _uid AND referral_code = _ref AND ad_slug = _ad_slug;
  IF _code IS NOT NULL THEN RETURN _code; END IF;

  LOOP
    _attempt := _attempt + 1;
    _code := '';
    FOR _i IN 1..6 LOOP
      _code := _code || substr(_alphabet, 1 + floor(random() * length(_alphabet))::int, 1);
    END LOOP;
    BEGIN
      INSERT INTO public.short_links (short_code, user_id, referral_code, ad_slug, destination_url)
      VALUES (_code, _uid, _ref, _ad_slug, 'https://mukafaty.com/ad/' || _ad_slug || '?ref=' || _ref)
      ON CONFLICT (user_id, referral_code, ad_slug) DO NOTHING;
      EXIT;
    EXCEPTION WHEN unique_violation THEN
      IF _attempt >= 10 THEN RAISE; END IF;
    END;
  END LOOP;

  SELECT short_code INTO _code FROM public.short_links WHERE user_id = _uid AND referral_code = _ref AND ad_slug = _ad_slug;
  RETURN _code;
END; $$;
REVOKE ALL ON FUNCTION public.get_or_create_short_link(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_or_create_short_link(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.resolve_short_link(_code text)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT destination_url FROM public.short_links
  WHERE _code ~ '^[A-Za-z0-9]{5,12}$' AND short_code = _code LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.resolve_short_link(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_short_link(text) TO anon, authenticated;