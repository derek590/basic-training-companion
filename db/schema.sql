-- Basic Training Companion — Postgres schema
-- Run once against your Vercel Postgres / Neon database:
--   psql "$POSTGRES_URL" -f db/schema.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                   TEXT,
  branch_id               TEXT,
  recruit_name            TEXT,
  family_name             TEXT,
  start_date              DATE,
  end_date                DATE,
  plan                    TEXT,
  plan_status             TEXT,
  stripe_customer_id      TEXT,
  stripe_subscription_id  TEXT,
  celeb_done              BOOLEAN     NOT NULL DEFAULT FALSE,
  notif_prefs             JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);

CREATE TABLE IF NOT EXISTS memories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  text        TEXT,
  -- base64 data URL. For larger photos, swap this out for Vercel Blob and store the URL.
  photo_data  TEXT,
  photo_name  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memories_user ON memories(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS reminders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  done        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id, created_at);
