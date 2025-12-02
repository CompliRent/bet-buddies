-- Drop existing trigger first
DROP TRIGGER IF EXISTS update_card_score_on_bet_result ON bets;

-- Create updated function with weighted scoring
CREATE OR REPLACE FUNCTION public.update_card_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  winning_score NUMERIC := 0;
  bet_count INTEGER := 0;
  unplaced_penalty NUMERIC := 0;
  max_picks INTEGER := 5;
  target_card_id BIGINT;
BEGIN
  target_card_id := COALESCE(NEW.card_id, OLD.card_id);
  
  -- Calculate score from winning bets (weighted by odds) and count total bets
  SELECT 
    COALESCE(SUM(
      CASE 
        WHEN result = true AND line > 0 THEN line  -- Positive odds: profit = line
        WHEN result = true AND line < 0 THEN ROUND(10000.0 / ABS(line), 2)  -- Negative odds: profit = 10000/|line|
        ELSE 0  -- Losses or pending = 0
      END
    ), 0),
    COUNT(*)
  INTO winning_score, bet_count
  FROM bets
  WHERE card_id = target_card_id;
  
  -- Calculate unplaced bet penalty (-20 per missing pick)
  unplaced_penalty := GREATEST(0, (max_picks - bet_count)) * 20;
  
  -- Update card total_score (floor at 0)
  UPDATE cards
  SET total_score = GREATEST(0, ROUND(winning_score - unplaced_penalty))::INTEGER
  WHERE id = target_card_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_card_score_on_bet_result
AFTER INSERT OR UPDATE OF result OR DELETE ON bets
FOR EACH ROW
EXECUTE FUNCTION public.update_card_score();