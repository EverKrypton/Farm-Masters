-- Function to increment user points
CREATE OR REPLACE FUNCTION increment_user_points(user_id UUID, points BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET total_points = total_points + points,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user rank
CREATE OR REPLACE FUNCTION get_user_rank(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  user_rank INTEGER;
BEGIN
  SELECT rank INTO user_rank
  FROM (
    SELECT id, RANK() OVER (ORDER BY total_points DESC) as rank
    FROM users
  ) ranked_users
  WHERE id = user_id;
  
  RETURN COALESCE(user_rank, 0);
END;
$$ LANGUAGE plpgsql;
