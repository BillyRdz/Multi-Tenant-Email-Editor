-- PartnerPulse Supabase Schema
-- Run this in the Supabase SQL editor to create the tables

CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  tokens JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_components (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  html TEXT NOT NULL,
  detected_variables TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS canvas_states (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  partner_id TEXT REFERENCES partners(id),
  instances JSONB NOT NULL DEFAULT '[]'::jsonb,
  preview_wrapper TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS versions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  canvas_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (optional, for multi-user setups)
-- ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE email_components ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE canvas_states ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE versions ENABLE ROW LEVEL SECURITY;
