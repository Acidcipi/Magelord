-- Create the entrenar_unidades RPC function
-- This function handles unit training logic with resource validation

CREATE OR REPLACE FUNCTION public.entrenar_unidades(
  p_province_id UUID,
  p_unit_id UUID,
  p_turnos_a_gastar INTEGER
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_barracks INTEGER;
  v_current_turns INTEGER;
  v_gold INTEGER;
  v_mana INTEGER;
  v_land INTEGER;
  v_unit_tier INTEGER;
  v_maintenance_gold INTEGER;
  v_maintenance_mana INTEGER;
  v_units_to_produce INTEGER;
  v_total_gold_cost INTEGER;
  v_total_mana_cost INTEGER;
  v_current_tier6_units INTEGER;
  v_max_tier6_allowed INTEGER;
BEGIN
  -- Validate input
  IF p_turnos_a_gastar <= 0 THEN
    RETURN 'ERROR_TURNOS_INVALIDOS';
  END IF;

  -- Get province data
  SELECT 
    barracks, 
    turns, 
    gold, 
    mana,
    land
  INTO 
    v_barracks, 
    v_current_turns, 
    v_gold, 
    v_mana,
    v_land
  FROM provinces
  WHERE id = p_province_id;

  IF NOT FOUND THEN
    RETURN 'ERROR_PROVINCIA_NO_ENCONTRADA';
  END IF;

  -- Check if enough turns available
  IF v_current_turns < p_turnos_a_gastar THEN
    RETURN 'ERROR_TURNOS_INSUFICIENTES';
  END IF;

  -- Get unit data
  SELECT tier, maintenance_gold, maintenance_mana
  INTO v_unit_tier, v_maintenance_gold, v_maintenance_mana
  FROM master_units
  WHERE id = p_unit_id;

  IF NOT FOUND THEN
    RETURN 'ERROR_UNIDAD_NO_ENCONTRADA';
  END IF;

  -- Calculate units to produce
  v_units_to_produce := (v_barracks * 10) * p_turnos_a_gastar;

  -- Calculate total costs
  v_total_gold_cost := v_units_to_produce * v_maintenance_gold * 5;
  v_total_mana_cost := v_units_to_produce * v_maintenance_mana * 2;

  -- Validate Tier 6 (Legendary) units
  IF v_unit_tier = 6 THEN
    -- Check minimum turns requirement
    IF p_turnos_a_gastar < 20 THEN
      RETURN 'ERROR_POCOS_TURNOS_HEROE';
    END IF;

    -- Calculate max Tier 6 units allowed (1 per 2000 land)
    v_max_tier6_allowed := FLOOR(v_land / 2000);

    -- Get current Tier 6 units count
    SELECT COALESCE(SUM(pu.quantity), 0)
    INTO v_current_tier6_units
    FROM province_units pu
    JOIN master_units mu ON pu.unit_id = mu.id
    WHERE pu.province_id = p_province_id
      AND mu.tier = 6;

    -- Check if we can add more Tier 6 units
    IF (v_current_tier6_units + v_units_to_produce) > v_max_tier6_allowed THEN
      RETURN 'ERROR_LIMITE_TIERRA_2000';
    END IF;
  END IF;

  -- Validate resources
  IF v_gold < v_total_gold_cost THEN
    RETURN 'ORO_INSUFICIENTE';
  END IF;

  IF v_mana < v_total_mana_cost THEN
    RETURN 'MANA_INSUFICIENTE';
  END IF;

  -- Deduct resources
  UPDATE provinces
  SET 
    turns = turns - p_turnos_a_gastar,
    gold = gold - v_total_gold_cost,
    mana = mana - v_total_mana_cost
  WHERE id = p_province_id;

  -- Add or update units
  INSERT INTO province_units (province_id, unit_id, quantity, training)
  VALUES (p_province_id, p_unit_id, v_units_to_produce, 0)
  ON CONFLICT (province_id, unit_id)
  DO UPDATE SET quantity = province_units.quantity + v_units_to_produce;

  RETURN 'EXITO';
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.entrenar_unidades(UUID, UUID, INTEGER) TO authenticated;

COMMENT ON FUNCTION public.entrenar_unidades IS 'Trains units for a province, validating resources and tier restrictions';
