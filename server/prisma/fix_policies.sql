-- ====================================================================
-- WEDORA — RLS POLICY FIX FOR SUPABASE
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zzasmqqaeeyrvmraidbc/sql
-- Uses auth.jwt() claims instead of querying auth.users table
-- ====================================================================

DROP POLICY IF EXISTS "events_access" ON "events";
CREATE POLICY "events_access" ON "events" FOR ALL USING (
    is_demo = true OR
    auth.uid() = owner_user_id OR 
    auth.uid() IN (SELECT auth_user_id FROM users WHERE id = events.owner_user_id) OR
    organizer_client_id IN (
        SELECT id FROM organizer_client_profiles WHERE organizer_user_id = auth.uid() OR organizer_user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
    ) OR
    id IN (
        SELECT event_id FROM event_participants WHERE (user_id = auth.uid() OR email = (auth.jwt() ->> 'email')) AND status = 'ACCEPTED'
    )
);

DROP POLICY IF EXISTS "family_profiles_read_member" ON "customer_family_profiles";
CREATE POLICY "family_profiles_read_member" ON "customer_family_profiles" FOR SELECT USING (
    is_demo = true OR
    email = (auth.jwt() ->> 'email')
);

DROP POLICY IF EXISTS "participants_access" ON "event_participants";
CREATE POLICY "participants_access" ON "event_participants" FOR ALL USING (
    is_demo = true OR
    event_id IN (SELECT id FROM events WHERE owner_user_id = auth.uid() OR owner_user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())) OR
    user_id = auth.uid() OR
    email = (auth.jwt() ->> 'email')
);

