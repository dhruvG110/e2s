
CREATE OR REPLACE FUNCTION public.increment_promo_usage(promo_code TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.promo_codes
  SET usage_count = usage_count + 1
  WHERE code = promo_code AND is_active = true;
END;
$$;
