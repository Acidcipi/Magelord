-- Eliminar el job de 1 minuto
SELECT cron.unschedule('magelord-turn-generation');

-- Crear nuevo job de 15 minutos
SELECT cron.schedule(
    'magelord-turn-generation',
    '*/15 * * * *',
    $$SELECT generate_turns_and_resources();$$
);

-- Actualizar la función para que use 15 minutos
CREATE OR REPLACE FUNCTION generate_turns_and_resources()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    affected_rows integer;
BEGIN
    WITH updated_provinces AS (
        UPDATE provinces p
        SET 
            turns = LEAST(p.turns + 1, p.max_turns),
            gold = p.gold + COALESCE((SELECT (b.mines * 500) FROM buildings b WHERE b.province_id = p.id), 0),
            mana = p.mana + COALESCE((SELECT (b.towers * 100) FROM buildings b WHERE b.province_id = p.id), 0),
            food = p.food + COALESCE((SELECT (b.farms * 200) FROM buildings b WHERE b.province_id = p.id), 0),
            next_turn_at = NOW() + INTERVAL '15 minutes',
            updated_at = NOW()
        WHERE p.next_turn_at <= NOW()
        RETURNING p.id
    )
    SELECT COUNT(*) INTO affected_rows FROM updated_provinces;
    RAISE NOTICE 'Turnos generados: %', affected_rows;
END;
$$;