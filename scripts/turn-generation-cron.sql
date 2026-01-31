-- MageLord Turn Generation System
-- This script sets up automatic turn generation every 15 minutes using Supabase pg_cron

-- Enable pg_cron extension (run once)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the turn generation function
CREATE OR REPLACE FUNCTION generate_turns_for_all_provinces()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Add 1 turn to all provinces, capped at 150 turns max
  UPDATE provinces
  SET 
    turns = LEAST(turns + 1, 150),
    updated_at = NOW()
  WHERE turns < 150;
  
  -- Log the operation
  RAISE NOTICE 'Turn generation complete at %', NOW();
END;
$$;

-- Schedule the function to run every 15 minutes
-- This will execute at :00, :15, :30, :45 of every hour
SELECT cron.schedule(
  'generate-turns-every-15-minutes',  -- Job name
  '*/15 * * * *',                     -- Cron expression: every 15 minutes
  $$SELECT generate_turns_for_all_provinces();$$
);

-- Verify the scheduled job
SELECT * FROM cron.job WHERE jobname = 'generate-turns-every-15-minutes';

-- To manually test the function:
-- SELECT generate_turns_for_all_provinces();

-- To remove the cron job (if needed):
-- SELECT cron.unschedule('generate-turns-every-15-minutes');

-- To view all scheduled jobs:
-- SELECT * FROM cron.job;

-- To view job run history:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
