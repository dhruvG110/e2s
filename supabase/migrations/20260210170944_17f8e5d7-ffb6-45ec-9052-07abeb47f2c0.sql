-- Add expires_at column to purchases for 3-year validity
ALTER TABLE public.purchases ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '3 years');

-- Backfill existing purchases
UPDATE public.purchases SET expires_at = created_at + interval '3 years' WHERE expires_at IS NULL OR expires_at = now() + interval '3 years';
