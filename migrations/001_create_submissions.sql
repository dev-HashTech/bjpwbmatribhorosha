-- Migration: 001_create_submissions
-- Creates the submissions table with a serial form_no starting at 20261

-- Sequence for form numbers (starts at 20261)
CREATE SEQUENCE IF NOT EXISTS form_no_seq
  START WITH 20261
  INCREMENT BY 1
  NO CYCLE;

-- Main submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  form_no    BIGINT      NOT NULL DEFAULT nextval('form_no_seq'),
  name       TEXT        NOT NULL,
  mobile     TEXT        NOT NULL,
  address    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique indexes (form_no and mobile must be unique)
CREATE UNIQUE INDEX IF NOT EXISTS submissions_form_no_idx ON submissions (form_no);
CREATE UNIQUE INDEX IF NOT EXISTS submissions_mobile_idx  ON submissions (mobile);

