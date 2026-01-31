-- RPC Function: Generate Research Options
-- This function returns available research options based on academy level, faction, and research type

CREATE OR REPLACE FUNCTION public.generar_opciones_investigacion(
  p_academy_level INT,
  p_faction TEXT,
  p_province_id UUID,
  p_research_type TEXT
)
RETURNS TABLE (
  id INT,
  name TEXT,
  tier INT,
  research_turns INT,
  image_url TEXT,
  description TEXT,
  item_type TEXT
) AS $$
BEGIN
  -- For units research
  IF p_research_type = 'units' THEN
    RETURN QUERY
    SELECT 
      u.id,
      u.name,
      u.tier,
      u.research_turns,
      u.image_url,
      u.description,
      'unit'::TEXT as item_type
    FROM units u
    WHERE u.faction = p_faction::faction_enum
      AND u.tier <= p_academy_level
      AND u.id NOT IN (
        SELECT unit_id 
        FROM province_research_queue 
        WHERE province_id = p_province_id 
          AND research_type = 'unit'
      )
    ORDER BY u.tier ASC, u.name ASC
    LIMIT 3;
  
  -- For spells research
  ELSIF p_research_type = 'spells' THEN
    RETURN QUERY
    SELECT 
      ms.id,
      ms.name,
      ms.min_level as tier,
      3 as research_turns, -- Default 3 turns for spells
      ms.image_url,
      ms.description,
      'spell'::TEXT as item_type
    FROM master_spells ms
    WHERE ms.faction_restriction::TEXT = p_faction
      AND ms.min_level <= p_academy_level
      AND ms.id NOT IN (
        SELECT spell_id 
        FROM province_learned_spells 
        WHERE province_id = p_province_id
      )
      AND ms.id NOT IN (
        SELECT spell_id 
        FROM province_research_queue 
        WHERE province_id = p_province_id 
          AND research_type = 'spell'
      )
    ORDER BY ms.min_level ASC, ms.name ASC
    LIMIT 3;
  
  -- For rituals research
  ELSIF p_research_type = 'rituals' THEN
    RETURN QUERY
    SELECT 
      mr.id,
      mr.name,
      mr.min_level as tier,
      5 as research_turns, -- Default 5 turns for rituals
      mr.image_url,
      mr.description,
      'ritual'::TEXT as item_type
    FROM master_rituals mr
    WHERE mr.faction_restriction::TEXT = p_faction
      AND mr.min_level <= p_academy_level
      AND mr.id NOT IN (
        SELECT ritual_id 
        FROM province_research_queue 
        WHERE province_id = p_province_id 
          AND research_type = 'ritual'
      )
    ORDER BY mr.min_level ASC, mr.name ASC
    LIMIT 3;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.generar_opciones_investigacion(INT, TEXT, UUID, TEXT) TO authenticated;
