-- Create the lazy update function for resource generation
-- This function calculates and applies resource generation based on time passed

CREATE OR REPLACE FUNCTION ejecutar_actualizacion_pendiente(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_province_id UUID;
  v_last_activity TIMESTAMP;
  v_current_time TIMESTAMP;
  v_hours_passed NUMERIC;
  v_turns_generated INTEGER;
  v_gold_generated INTEGER;
  v_mana_generated INTEGER;
  v_food_generated INTEGER;
  v_mines INTEGER;
  v_towers INTEGER;
  v_farms INTEGER;
BEGIN
  -- Get current time
  v_current_time := NOW();
  
  -- Get province data for this user
  SELECT p.id, p.last_activity, b.mines, b.towers, b.farms
  INTO v_province_id, v_last_activity, v_mines, v_towers, v_farms
  FROM provinces p
  LEFT JOIN province_buildings b ON b.province_id = p.id
  WHERE p.user_id = p_user_id
  LIMIT 1;
  
  -- If no province found, exit
  IF v_province_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Calculate hours passed since last activity
  v_hours_passed := EXTRACT(EPOCH FROM (v_current_time - v_last_activity)) / 3600;
  
  -- Only update if more than 1 hour has passed
  IF v_hours_passed >= 1 THEN
    -- Calculate resources generated (1 turn per hour, max 24)
    v_turns_generated := LEAST(FLOOR(v_hours_passed), 24);
    v_gold_generated := v_turns_generated * (v_mines * 10); -- 10 gold per mine per turn
    v_mana_generated := v_turns_generated * (v_towers * 5); -- 5 mana per tower per turn
    v_food_generated := v_turns_generated * (v_farms * 8); -- 8 food per farm per turn
    
    -- Update province resources
    UPDATE provinces
    SET 
      turns = LEAST(turns + v_turns_generated, 200), -- Cap at 200 turns
      gold = gold + v_gold_generated,
      mana = mana + v_mana_generated,
      food = food + v_food_generated,
      last_activity = v_current_time
    WHERE id = v_province_id;
    
    -- Log the update
    RAISE NOTICE 'Lazy update: Generated % turns, % gold, % mana, % food for province %',
      v_turns_generated, v_gold_generated, v_mana_generated, v_food_generated, v_province_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION ejecutar_actualizacion_pendiente(UUID) TO authenticated;
