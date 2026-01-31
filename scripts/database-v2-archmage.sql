-- ============================================
-- MageLord - Archmage Complete Schema v2.0
-- Adds: faction system, status, role, maintenance, commerce
-- ============================================

BEGIN;

-- Add faction, role, and status to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS faction VARCHAR(50),
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'player',
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Create buildings table with maintenance costs
CREATE TABLE IF NOT EXISTS buildings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  building_type VARCHAR(50) NOT NULL,
  level INTEGER DEFAULT 1,
  workers_required INTEGER DEFAULT 0,
  maintenance_gold INTEGER DEFAULT 0,
  maintenance_mana INTEGER DEFAULT 0,
  maintenance_population INTEGER DEFAULT 0,
  production_gold INTEGER DEFAULT 0,
  production_mana INTEGER DEFAULT 0,
  last_maintenance_paid TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, building_type)
);

CREATE INDEX IF NOT EXISTS idx_buildings_user_id ON buildings(user_id);

-- Create army table with faction lock
CREATE TABLE IF NOT EXISTS army (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_type VARCHAR(50) NOT NULL,
  quantity INTEGER DEFAULT 0,
  faction_lock VARCHAR(50) NOT NULL,
  attack_power INTEGER DEFAULT 0,
  defense_power INTEGER DEFAULT 0,
  speed INTEGER DEFAULT 0,
  UNIQUE(user_id, unit_type)
);

CREATE INDEX IF NOT EXISTS idx_army_user_id ON army(user_id);

-- Create spells_known table with faction lock
CREATE TABLE IF NOT EXISTS spells_known (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  spell_name VARCHAR(50) NOT NULL,
  faction_lock VARCHAR(50) NOT NULL,
  school VARCHAR(50),
  cooldown_until TIMESTAMP,
  level INTEGER DEFAULT 1,
  UNIQUE(user_id, spell_name)
);

CREATE INDEX IF NOT EXISTS idx_spells_user_id ON spells_known(user_id);

-- Create black market for cross-faction purchases
CREATE TABLE IF NOT EXISTS market_black (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  faction_original VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_market_black_faction ON market_black(faction_original);
CREATE INDEX IF NOT EXISTS idx_market_black_seller ON market_black(seller_id);

-- Create global market for resources
CREATE TABLE IF NOT EXISTS market_offers (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  price_per_unit INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_market_offers_resource ON market_offers(resource_type);
CREATE INDEX IF NOT EXISTS idx_market_offers_seller ON market_offers(seller_id);

-- Create battles log
CREATE TABLE IF NOT EXISTS battles_log (
  id SERIAL PRIMARY KEY,
  attacker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  defender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  troops_sent INTEGER NOT NULL,
  damage_dealt INTEGER DEFAULT 0,
  loot_gold INTEGER DEFAULT 0,
  loot_land INTEGER DEFAULT 0,
  outcome VARCHAR(20) NOT NULL,
  battle_details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_battles_attacker ON battles_log(attacker_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_battles_defender ON battles_log(defender_id, created_at DESC);

COMMIT;
