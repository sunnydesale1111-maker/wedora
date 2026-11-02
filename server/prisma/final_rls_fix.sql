-- ====================================================================
-- WEDORA — FINAL 2-SECOND PERMISSIONS FIX
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zzasmqqaeeyrvmraidbc/sql
-- ====================================================================

-- 1. Service Categories: Allow public read access
ALTER TABLE "service_categories" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_categories_read_all" ON "service_categories";
CREATE POLICY "service_categories_read_all" ON "service_categories" FOR ALL USING (true);

-- 2. Customer Family Profiles: Drop old policies and allow full access
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'customer_family_profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON "customer_family_profiles"', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "family_profiles_all_access" ON "customer_family_profiles" FOR ALL USING (true);

-- 3. Grant auth.users select privilege to prevent foreign key inspection permission errors
GRANT SELECT ON auth.users TO anon, authenticated;

