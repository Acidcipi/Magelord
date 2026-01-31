-- Create spells table
CREATE TABLE IF NOT EXISTS public.spells (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_es TEXT NOT NULL,
  description TEXT NOT NULL,
  description_es TEXT NOT NULL,
  faction TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('economy', 'combat', 'enchantment')),
  spell_type TEXT NOT NULL CHECK (spell_type IN ('instant', 'passive')),
  base_cost INTEGER NOT NULL DEFAULT 0,
  cost_per_turn INTEGER NOT NULL DEFAULT 0,
  magic_cost INTEGER NOT NULL DEFAULT 0,
  effects JSONB,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create rituals table
CREATE TABLE IF NOT EXISTS public.rituals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_es TEXT NOT NULL,
  description TEXT NOT NULL,
  description_es TEXT NOT NULL,
  faction TEXT NOT NULL,
  duration_turns INTEGER NOT NULL,
  gold_cost INTEGER DEFAULT 0,
  wood_cost INTEGER DEFAULT 0,
  stone_cost INTEGER DEFAULT 0,
  iron_cost INTEGER DEFAULT 0,
  magic_cost INTEGER NOT NULL,
  effects JSONB,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user_spells table (tracks unlocked spells)
CREATE TABLE IF NOT EXISTS public.user_spells (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spell_id INTEGER NOT NULL REFERENCES public.spells(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  is_active BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, spell_id)
);

-- Create user_rituals table (tracks ritual progress)
CREATE TABLE IF NOT EXISTS public.user_rituals (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ritual_id INTEGER NOT NULL REFERENCES public.rituals(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('channeling', 'completed')) DEFAULT 'channeling',
  turns_remaining INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, ritual_id, status)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_spells_faction ON public.spells(faction);
CREATE INDEX IF NOT EXISTS idx_spells_category ON public.spells(category);
CREATE INDEX IF NOT EXISTS idx_rituals_faction ON public.rituals(faction);
CREATE INDEX IF NOT EXISTS idx_user_spells_user_id ON public.user_spells(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rituals_user_id ON public.user_rituals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rituals_status ON public.user_rituals(status);

-- Enable Row Level Security
ALTER TABLE public.spells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_spells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rituals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for spells (everyone can read, no one can modify)
DROP POLICY IF EXISTS "Spells are viewable by everyone" ON public.spells;
CREATE POLICY "Spells are viewable by everyone" ON public.spells
  FOR SELECT USING (true);

-- RLS Policies for rituals (everyone can read, no one can modify)
DROP POLICY IF EXISTS "Rituals are viewable by everyone" ON public.rituals;
CREATE POLICY "Rituals are viewable by everyone" ON public.rituals
  FOR SELECT USING (true);

-- RLS Policies for user_spells
DROP POLICY IF EXISTS "Users can view their own spells" ON public.user_spells;
CREATE POLICY "Users can view their own spells" ON public.user_spells
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own spells" ON public.user_spells;
CREATE POLICY "Users can insert their own spells" ON public.user_spells
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own spells" ON public.user_spells;
CREATE POLICY "Users can update their own spells" ON public.user_spells
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own spells" ON public.user_spells;
CREATE POLICY "Users can delete their own spells" ON public.user_spells
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_rituals
DROP POLICY IF EXISTS "Users can view their own rituals" ON public.user_rituals;
CREATE POLICY "Users can view their own rituals" ON public.user_rituals
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own rituals" ON public.user_rituals;
CREATE POLICY "Users can insert their own rituals" ON public.user_rituals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own rituals" ON public.user_rituals;
CREATE POLICY "Users can update their own rituals" ON public.user_rituals
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own rituals" ON public.user_rituals;
CREATE POLICY "Users can delete their own rituals" ON public.user_rituals
  FOR DELETE USING (auth.uid() = user_id);
