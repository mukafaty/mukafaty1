-- 1) Gapless counter table
CREATE TABLE IF NOT EXISTS public.member_number_counter (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  last_number bigint NOT NULL DEFAULT 0
);

GRANT ALL ON public.member_number_counter TO service_role;
ALTER TABLE public.member_number_counter ENABLE ROW LEVEL SECURITY;

-- no policies: only security-definer functions / service_role may touch it

-- 2) Renumber existing rows (temporary values first to avoid unique clashes)
UPDATE public.profiles p
SET member_number = 'TMP-' || p.id::text
WHERE p.member_number IS NOT NULL;

WITH ordered AS (
  SELECT id, row_number() OVER (ORDER BY created_at, id) AS rn
  FROM public.profiles
)
UPDATE public.profiles p
SET member_number = 'MK' || lpad(o.rn::text, 4, '0')
FROM ordered o
WHERE p.id = o.id;

-- 3) Seed counter from current max
INSERT INTO public.member_number_counter (id, last_number)
VALUES (true, (SELECT COALESCE(COUNT(*), 0) FROM public.profiles))
ON CONFLICT (id) DO UPDATE
SET last_number = GREATEST(public.member_number_counter.last_number, EXCLUDED.last_number);

-- 4) Transactional, gapless generator (row lock held until commit; rollback returns the number)
CREATE OR REPLACE FUNCTION public.next_member_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _n bigint;
BEGIN
  UPDATE public.member_number_counter
  SET last_number = last_number + 1
  WHERE id = true
  RETURNING last_number INTO _n;

  IF _n IS NULL THEN
    INSERT INTO public.member_number_counter (id, last_number)
    VALUES (true, 1)
    ON CONFLICT (id) DO UPDATE SET last_number = public.member_number_counter.last_number + 1
    RETURNING last_number INTO _n;
  END IF;

  RETURN 'MK' || lpad(_n::text, 4, '0');
END;
$$;

REVOKE ALL ON FUNCTION public.next_member_number() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_member_number() TO service_role;

-- 5) Drop the old gap-prone sequence
DROP SEQUENCE IF EXISTS public.member_number_seq;
