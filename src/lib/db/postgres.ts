import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing env var: DATABASE_URL is required");
}

// Reuse pool across hot-reloads in dev (Next.js module caching)
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

export const pool: Pool =
  globalThis._pgPool ??
  (globalThis._pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30_000,
  }));
