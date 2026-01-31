-- ============================================
-- MageLord - Database Schema v1.0
-- PostgreSQL 12+ compatible
-- Purpose: Core MVP tables for game functionality
-- ============================================

BEGIN;

-- ============================================
-- TABLE: users
-- Purpose: Store player accounts and authentication
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- bcrypt hashed password
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Index for fast username lookups during login
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- TABLE: provinces
-- Purpose: Store player provinces (main game entity)
-- Notes:
--   - last_update: TIMESTAMP tracks when resources were last calculated
--   - This allows incremental resource generation without real-time processing
--   - alignment: Can be extended to ENUM later (good, neutral, evil)
-- ============================================
CREATE TABLE provinces (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  gold INTEGER DEFAULT 5000, -- Starting gold
  mana INTEGER DEFAULT 100, -- Starting mana for spells
  turns INTEGER DEFAULT 50, -- Action points for the turn
  land INTEGER DEFAULT 100, -- Territory in hectares
  population INTEGER DEFAULT 1000, -- Citizens
  alignment VARCHAR(20) DEFAULT 'neutral', -- good, neutral, evil
  morale INTEGER DEFAULT 80, -- Affects productivity (0-100)
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Critical: tracks last resource calculation
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user-province lookups
CREATE INDEX idx_provinces_user_id ON provinces(user_id);
CREATE INDEX idx_provinces_last_update ON provinces(last_update);

-- ============================================
-- TABLE: buildings
-- Purpose: Store buildings in each province
-- Notes:
--   - type: 'farms', 'mines', 'barracks', 'towers', 'forts', 'libraries', 'temples'
--   - amount: number of that building type
--   - Each building type has different effects (defined in game logic)
-- ============================================
CREATE TABLE buildings (
  id SERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- building type identifier
  amount INTEGER DEFAULT 0, -- quantity of this building
  UNIQUE(province_id, type) -- One row per building type per province
);

-- Index for fast building queries per province
CREATE INDEX idx_buildings_province_id ON buildings(province_id);

-- ============================================
-- TABLE: armies
-- Purpose: Store military units for each province
-- Notes:
--   - unit_type: 'soldiers', 'archers', 'cavalry', 'mages', 'siege_weapons'
--   - training: stores turns remaining for units in training (0 = ready)
--   - amount: number of units ready for combat
-- ============================================
CREATE TABLE armies (
  id SERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  unit_type VARCHAR(50) NOT NULL, -- military unit identifier
  amount INTEGER DEFAULT 0, -- units ready for battle
  training INTEGER DEFAULT 0, -- turns remaining in training (0 = ready)
  UNIQUE(province_id, unit_type) -- One row per unit type per province
);

-- Index for fast army queries per province
CREATE INDEX idx_armies_province_id ON armies(province_id);

-- ============================================
-- TABLE: spells_known
-- Purpose: Track which spells each province has researched
-- Notes:
--   - spell_name: identifier like 'fireball', 'heal', 'shield', 'teleport'
--   - level: spell power/tier (1-5 typical)
--   - researched_at: when the spell was unlocked
-- ============================================
CREATE TABLE spells_known (
  id SERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  spell_name VARCHAR(50) NOT NULL,
  level INTEGER DEFAULT 1, -- spell power tier
  researched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(province_id, spell_name) -- One row per spell per province
);

-- Index for fast spell lookups per province
CREATE INDEX idx_spells_province_id ON spells_known(province_id);

-- ============================================
-- TABLE: news
-- Purpose: Store game events and notifications for each province
-- Notes:
--   - type: 'combat', 'diplomacy', 'research', 'construction', 'system'
--   - is_read: tracks if player has seen the notification
-- ============================================
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- event category
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast news queries per province, sorted by date
CREATE INDEX idx_news_province_id ON news(province_id, created_at DESC);
CREATE INDEX idx_news_is_read ON news(province_id, is_read);

-- ============================================
-- TABLE: forum_threads
-- Purpose: Public forum threads for player discussions
-- ============================================
CREATE TABLE forum_threads (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_locked BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE
);

-- Index for forum thread listings
CREATE INDEX idx_forum_threads_last_activity ON forum_threads(last_activity DESC);
CREATE INDEX idx_forum_threads_user_id ON forum_threads(user_id);

-- ============================================
-- TABLE: forum_posts
-- Purpose: Individual posts within forum threads
-- ============================================
CREATE TABLE forum_posts (
  id SERIAL PRIMARY KEY,
  thread_id INTEGER NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Index for fast post queries per thread
CREATE INDEX idx_forum_posts_thread_id ON forum_posts(thread_id, created_at ASC);
CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);

-- ============================================
-- TABLE: relations
-- Purpose: Track diplomatic relations between provinces
-- Notes:
--   - type: 'alliance', 'war', 'trade_agreement', 'ceasefire'
--   - status: 'pending', 'active', 'broken'
-- ============================================
CREATE TABLE relations (
  id SERIAL PRIMARY KEY,
  province_a_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  province_b_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- relation type
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, broken
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (province_a_id < province_b_id), -- Enforce ordered pairs to avoid duplicates
  UNIQUE(province_a_id, province_b_id, type)
);

-- Index for fast relation lookups
CREATE INDEX idx_relations_province_a ON relations(province_a_id);
CREATE INDEX idx_relations_province_b ON relations(province_b_id);

-- ============================================
-- TABLE: combat_logs
-- Purpose: Store historical combat results for analysis
-- Notes:
--   - Critical for displaying battle history and calculating rankings
-- ============================================
CREATE TABLE combat_logs (
  id SERIAL PRIMARY KEY,
  attacker_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  defender_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  attacker_troops INTEGER NOT NULL,
  defender_troops INTEGER NOT NULL,
  attacker_losses INTEGER DEFAULT 0,
  defender_losses INTEGER DEFAULT 0,
  land_captured INTEGER DEFAULT 0,
  gold_looted INTEGER DEFAULT 0,
  outcome VARCHAR(20) NOT NULL, -- 'attacker_victory', 'defender_victory', 'draw'
  combat_details JSONB, -- Detailed breakdown of combat (optional)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for combat history queries
CREATE INDEX idx_combat_logs_attacker ON combat_logs(attacker_id, created_at DESC);
CREATE INDEX idx_combat_logs_defender ON combat_logs(defender_id, created_at DESC);

-- ============================================
-- INITIAL DATA: Default building types
-- Purpose: Pre-populate building types for new provinces
-- ============================================
-- Note: This will be handled by game logic on province creation
-- Example: INSERT INTO buildings (province_id, type, amount) VALUES (1, 'farms', 10);

COMMIT;

-- ============================================
-- END OF DATABASE SCHEMA
-- ============================================
