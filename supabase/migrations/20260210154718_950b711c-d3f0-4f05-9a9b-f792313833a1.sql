
DROP POLICY "Anyone can view active promos" ON public.promo_codes;
CREATE POLICY "Only admins can view promos" ON public.promo_codes FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));
