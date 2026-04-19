-- Migration: 002_drop_mobile_unique
-- Allows multiple submissions per mobile number.

DROP INDEX IF EXISTS submissions_mobile_idx;

-- Optional non-unique index for lookups
CREATE INDEX IF NOT EXISTS submissions_mobile_lookup_idx ON submissions (mobile);
