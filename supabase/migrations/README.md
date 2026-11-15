# AgriShift Database Migrations

This folder holds database migrations for the existing Supabase project.

## Critical Safety Principles:
1. **Never drop or recreate existing production tables without inspection.**
2. **Inspect existing schema before applying migrations** using `information_schema.tables` and column reflection.
3. **Use `IF NOT EXISTS`** for tables, indexes, and extensions.
4. **Row Level Security (RLS)** is mandatory on every table storing user data (`profiles`, `farms`, `crop_plans`, `saved_schemes`).
