-- Add card_id to bets table to link bets to cards
ALTER TABLE public.bets 
ADD COLUMN IF NOT EXISTS card_id bigint REFERENCES public.cards(id) ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_bets_card_id ON public.bets(card_id);