-- ====================================================================
-- WEDORA — MASTER SETUP & SEED SCRIPT (ROBUST & FAIL-SAFE)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zzasmqqaeeyrvmraidbc/sql
-- ====================================================================

-- 1. DROP RESTRICTIVE FOREIGN KEY ON users.id (Allows demo accounts alongside real auth accounts)
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_id_fkey";
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_id_fkey1";
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "fk_users_auth_users";

-- 2. ADD ALL MISSING COLUMNS SAFELY WITH IF NOT EXISTS
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "auth_user_id" UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "customer_family_profiles" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "organizer_client_profiles" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "organizer_client_id" TEXT;

ALTER TABLE "event_participants" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;
DO $$ BEGIN
    ALTER TABLE "vendors" ALTER COLUMN "user_id" DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "vendor_services" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "vendor_service_areas" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "vendor_availability" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "vendor_availability" ADD COLUMN IF NOT EXISTS "vendor_id" TEXT;
ALTER TABLE "vendor_availability" ADD COLUMN IF NOT EXISTS "slot" TEXT DEFAULT 'FULL_DAY';
ALTER TABLE "vendor_availability" ADD COLUMN IF NOT EXISTS "event_name" TEXT;
ALTER TABLE "vendor_availability" ADD COLUMN IF NOT EXISTS "client_name" TEXT;
DO $$ BEGIN
    ALTER TABLE "vendor_availability" ALTER COLUMN "vendor_service_id" DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "quotations" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "slot" TEXT DEFAULT 'FULL_DAY';
DO $$ BEGIN
    ALTER TABLE "bookings" ALTER COLUMN "quotation_id" DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
    ALTER TABLE "bookings" ALTER COLUMN "vendor_service_id" DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE "timeline_tasks" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- 3. GRANT PERMISSIONS TO SUPABASE ROLES
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
DROP POLICY IF EXISTS "users_select_all" ON "users";
DROP POLICY IF EXISTS "users_insert_all" ON "users";
DROP POLICY IF EXISTS "users_update_own" ON "users";
DROP POLICY IF EXISTS "users_read_all" ON "users";

DROP POLICY IF EXISTS "events_access" ON "events";
DROP POLICY IF EXISTS "customer_primary_manage_family_profiles" ON "customer_family_profiles";
DROP POLICY IF EXISTS "customer_family_view_own_profile" ON "customer_family_profiles";
DROP POLICY IF EXISTS "family_profiles_manage" ON "customer_family_profiles";
DROP POLICY IF EXISTS "family_profiles_read_member" ON "customer_family_profiles";
DROP POLICY IF EXISTS "family_profiles_all_access" ON "customer_family_profiles";

DROP POLICY IF EXISTS "organizer_manage_client_profiles" ON "organizer_client_profiles";
DROP POLICY IF EXISTS "organizer_clients_manage" ON "organizer_client_profiles";

DROP POLICY IF EXISTS "owner_organizer_manage_event_participants" ON "event_participants";
DROP POLICY IF EXISTS "participant_view_accepted_event" ON "event_participants";
DROP POLICY IF EXISTS "participants_access" ON "event_participants";

DROP POLICY IF EXISTS "vendors_manage_own" ON "vendors";
DROP POLICY IF EXISTS "vendor_services_manage_own" ON "vendor_services";
DROP POLICY IF EXISTS "vendor_service_areas_manage_own" ON "vendor_service_areas";
DROP POLICY IF EXISTS "vendor_availability_manage_own" ON "vendor_availability";

DROP POLICY IF EXISTS "inquiries_access" ON "inquiries";
DROP POLICY IF EXISTS "quotations_access" ON "quotations";
DROP POLICY IF EXISTS "bookings_access" ON "bookings";
DROP POLICY IF EXISTS "payments_access" ON "payments";
DROP POLICY IF EXISTS "timeline_tasks_access" ON "timeline_tasks";

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customer_family_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organizer_client_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "event_participants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendor_services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendor_service_areas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendor_availability" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inquiries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "quotations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "timeline_tasks" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_all" ON "users" FOR SELECT USING (true);
CREATE POLICY "users_insert_all" ON "users" FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update_own" ON "users" FOR UPDATE USING (
    auth.uid() = id OR auth.uid() = auth_user_id OR auth.role() = 'anon'
);

CREATE POLICY "events_access" ON "events" FOR ALL USING (
    is_demo = true OR auth.uid() = owner_user_id OR auth.role() = 'anon'
);

CREATE POLICY "family_profiles_all_access" ON "customer_family_profiles" FOR ALL USING (
    is_demo = true OR auth.uid() = primary_user_id OR email = (auth.jwt() ->> 'email') OR auth.role() = 'anon'
);

CREATE POLICY "organizer_clients_manage" ON "organizer_client_profiles" FOR ALL USING (
    is_demo = true OR auth.uid() = organizer_user_id OR auth.role() = 'anon'
);

CREATE POLICY "participants_access" ON "event_participants" FOR ALL USING (
    is_demo = true OR user_id = auth.uid() OR email = (auth.jwt() ->> 'email') OR auth.role() = 'anon'
);

CREATE POLICY "vendors_manage_own" ON "vendors" FOR ALL USING (true);
CREATE POLICY "vendor_services_manage_own" ON "vendor_services" FOR ALL USING (true);
CREATE POLICY "vendor_service_areas_manage_own" ON "vendor_service_areas" FOR ALL USING (true);
CREATE POLICY "vendor_availability_manage_own" ON "vendor_availability" FOR ALL USING (true);
CREATE POLICY "inquiries_access" ON "inquiries" FOR ALL USING (true);
CREATE POLICY "quotations_access" ON "quotations" FOR ALL USING (true);
CREATE POLICY "bookings_access" ON "bookings" FOR ALL USING (true);
CREATE POLICY "payments_access" ON "payments" FOR ALL USING (true);
CREATE POLICY "timeline_tasks_access" ON "timeline_tasks" FOR ALL USING (true);

-- 5. AUTH TRIGGER FOR AUTO-CREATING USER PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, auth_user_id, name, email, phone, role, is_demo)
    VALUES (
        new.id,
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        COALESCE(new.raw_user_meta_data->>'phone', '+919800000000'),
        COALESCE(new.raw_user_meta_data->>'role', 'CUSTOMER')::public."Role",
        false
    )
    ON CONFLICT (id) DO UPDATE SET
        auth_user_id = EXCLUDED.auth_user_id,
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        role = EXCLUDED.role;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. SERVICE CATEGORIES SEED DATA
INSERT INTO "service_categories" ("id", "category_name", "slug", "description") VALUES
('cat-catering', 'Catering', 'catering', 'Gourmet catering, multi-cuisine buffets, and live food counters.'),
('cat-decoration', 'Decoration', 'decoration', 'Floral stages, theme mandaps, entry tunnels, and floral art.'),
('cat-lighting', 'Lighting', 'lighting', 'Architectural mood lighting, truss rigs, moving heads, and fairy lights.'),
('cat-photography', 'Photography', 'photography', 'Candid photography, traditional videography, and drone coverage.'),
('cat-sound', 'Sound', 'sound', 'Line array audio systems, professional DJ equipment, and wireless mics.'),
('cat-furniture-rental', 'Furniture Rental', 'furniture-rental', 'Banquet chairs, vintage sofas, dining tables, and lounge setups.'),
('cat-event-equipment', 'Event Equipment', 'event-equipment', 'Silent diesel generators, AC towers, mist fans, and stage platforms.'),
('cat-logistics', 'Logistics', 'logistics', 'Luxury bridal cars, guest shuttle vans, and luggage management.')
ON CONFLICT ("slug") DO UPDATE SET
  "category_name" = EXCLUDED."category_name",
  "description" = EXCLUDED."description";

-- 7. DEMO USERS SEED DATA
DELETE FROM "users" 
WHERE "email" IN (
    'rohil@kulkarni.com', 
    'planner@weddingorchestrator.com', 
    'vendor1@royalfeast.com', 
    'vendor2@heritagerasoi.com', 
    'aniket@tribhavan.com'
) AND "id" != 'd0000000-0000-0000-0000-000000000001'
  AND "id" != 'd0000000-0000-0000-0000-000000000002'
  AND "id" != 'd0000000-0000-0000-0000-000000000003'
  AND "id" != 'd0000000-0000-0000-0000-000000000004'
  AND "id" != 'd0000000-0000-0000-0000-000000000005';

INSERT INTO "users" ("id", "auth_user_id", "name", "email", "phone", "role", "is_demo") VALUES
('d0000000-0000-0000-0000-000000000001', NULL, 'Rohan Kulkarni', 'rohil@kulkarni.com', '+919822022222', 'CUSTOMER', true),
('d0000000-0000-0000-0000-000000000002', NULL, 'Aditi Sharma (Lead Planner)', 'planner@weddingorchestrator.com', '+919822011111', 'PLANNER', true),
('d0000000-0000-0000-0000-000000000003', NULL, 'Royal Feast Catering & Hospitality', 'vendor1@royalfeast.com', '+919822033333', 'VENDOR', true),
('d0000000-0000-0000-0000-000000000004', NULL, 'Heritage Rasoi Caterers', 'vendor2@heritagerasoi.com', '+919822044444', 'VENDOR', true),
('d0000000-0000-0000-0000-000000000005', NULL, 'Aniket Tribhavan', 'aniket@tribhavan.com', '+919822055555', 'CUSTOMER', true)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "email" = EXCLUDED."email",
  "is_demo" = true;

-- 8. CUSTOMER FAMILY PROFILES SEED DATA
INSERT INTO "customer_family_profiles" ("id", "primary_user_id", "name", "email", "relationship", "avatar", "role", "is_demo") VALUES
('prof-rohan-primary', 'd0000000-0000-0000-0000-000000000001', 'Rohan Kulkarni', 'rohil@kulkarni.com', 'Primary Account Holder', 'avatar-1', 'PRIMARY', true),
('prof-priya-spouse', 'd0000000-0000-0000-0000-000000000001', 'Priya Deshmukh', 'priya.d@gmail.com', 'Bride / Spouse', 'avatar-2', 'FAMILY_MEMBER', true),
('prof-sunita-mother', 'd0000000-0000-0000-0000-000000000001', 'Sunita Kulkarni', 'sunita.k@gmail.com', 'Mother of Groom', 'avatar-3', 'FAMILY_MEMBER', true),
('prof-ramesh-father', 'd0000000-0000-0000-0000-000000000001', 'Ramesh Kulkarni', 'ramesh.k@gmail.com', 'Father of Groom', 'avatar-4', 'FAMILY_MEMBER', true)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "relationship" = EXCLUDED."relationship";

UPDATE "customer_family_profiles"
SET "permissions" = jsonb_build_object(
    'canViewEvents', true,
    'canViewVendors', true,
    'canViewTasks', true,
    'canViewBudgets', true,
    'canViewBookings', true,
    'canMakeBookings', true,
    'canManagePayments', true,
    'canManageEvents', true,
    'canModifyBudgets', true,
    'canUpdateTasks', true,
    'canManageProfiles', true,
    'canInviteMembers', true
)
WHERE "id" = 'prof-rohan-primary';

-- 9. ORGANIZER CLIENT PROFILES SEED DATA
INSERT INTO "organizer_client_profiles" ("id", "organizer_user_id", "client_name", "client_email", "client_phone", "company", "status", "notes", "is_demo") VALUES
('client-01', 'd0000000-0000-0000-0000-000000000002', 'Rohan & Priya', 'rohil@kulkarni.com', '+919822022222', 'Kulkarni Family', 'ACTIVE', 'Grand Maharashtrian wedding at Baner. 500 guests.', true),
('client-02', 'd0000000-0000-0000-0000-000000000002', 'Rocky & Sneha', 'rocky@deshmukh.com', '+919822033333', 'Deshmukh Corporation', 'ACTIVE', 'Seafront celebration in Bandra, Mumbai. 750 guests.', true),
('client-03', 'd0000000-0000-0000-0000-000000000002', 'Amit & Neha', 'amit@patil.com', '+919822044444', 'Patil Group', 'ACTIVE', 'Traditional Vivah & Mandap at Kothrud, Pune. 350 guests.', true)
ON CONFLICT ("id") DO UPDATE SET
  "client_name" = EXCLUDED."client_name",
  "client_email" = EXCLUDED."client_email",
  "status" = EXCLUDED."status";

-- 10. DEMO EVENTS SEED DATA
INSERT INTO "events" ("id", "owner_user_id", "organizer_client_id", "event_name", "event_type", "event_date", "city", "area", "guest_count", "estimated_budget", "description", "is_demo") VALUES
('evt-01', 'd0000000-0000-0000-0000-000000000001', 'client-01', 'Rohan & Priya''s Wedding', 'Wedding', '2026-12-15', 'Pune', 'Baner', 500, 2500000, 'Grand 500-guest Maharashtrian celebration and evening reception at Baner.', true),
('evt-02', 'd0000000-0000-0000-0000-000000000001', 'client-02', 'Rocky & Sneha''s Wedding', 'Wedding', '2026-12-20', 'Mumbai', 'Bandra', 750, 4500000, 'Glamorous seafront wedding and reception at Bandra.', true),
('evt-03', 'd0000000-0000-0000-0000-000000000001', 'client-03', 'Amit & Neha''s Wedding', 'Wedding', '2027-01-05', 'Pune', 'Kothrud', 350, 1800000, 'Traditional Vivah and Sangeet ceremony at Kothrud.', true)
ON CONFLICT ("id") DO UPDATE SET
  "event_name" = EXCLUDED."event_name",
  "event_date" = EXCLUDED."event_date",
  "city" = EXCLUDED."city",
  "guest_count" = EXCLUDED."guest_count",
  "estimated_budget" = EXCLUDED."estimated_budget";

-- 11. EVENT PARTICIPANTS SEED DATA
INSERT INTO "event_participants" ("id", "event_id", "user_id", "name", "email", "phone", "role", "relationship", "is_primary", "status", "can_edit", "is_demo") VALUES
('part-01', 'evt-01', 'd0000000-0000-0000-0000-000000000001', 'Rohan Kulkarni', 'rohil@kulkarni.com', '+919822022222', 'PRIMARY', 'Groom', true, 'ACCEPTED', true, true),
('part-02', 'evt-01', NULL, 'Priya Deshmukh', 'priya.d@gmail.com', '+919822077777', 'FAMILY_MEMBER', 'Bride', false, 'ACCEPTED', false, true),
('part-03', 'evt-02', NULL, 'Rocky', 'rocky@deshmukh.com', '+919822033333', 'PRIMARY', 'Groom', true, 'ACCEPTED', true, true),
('part-04', 'evt-02', NULL, 'Sneha', 'sneha@deshmukh.com', '+919822088888', 'FAMILY_MEMBER', 'Bride', false, 'ACCEPTED', false, true),
('part-05', 'evt-03', NULL, 'Amit', 'amit@patil.com', '+919822044444', 'PRIMARY', 'Groom', true, 'ACCEPTED', true, true),
('part-06', 'evt-03', NULL, 'Neha', 'neha@patil.com', '+919822099999', 'FAMILY_MEMBER', 'Bride', false, 'ACCEPTED', false, true)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "status" = EXCLUDED."status";

-- 12. DEMO VENDORS SEED DATA
INSERT INTO "vendors" ("id", "user_id", "business_name", "business_description", "primary_city", "contact_person", "business_address", "verification_status", "is_demo") VALUES
('pun-cat-01', 'd0000000-0000-0000-0000-000000000003', 'Royal Feast Catering & Hospitality', 'Luxury multi-course Maharashtrian, North Indian, and Continental catering with live counters.', 'Pune', 'Chef Rajesh Shinde', 'Plot 42, Baner Main Rd, Pune', 'VERIFIED', true),
('pun-cat-02', 'd0000000-0000-0000-0000-000000000004', 'Heritage Rasoi Caterers', 'Authentic royal wedding banquets, artisanal desserts, and traditional satvik feast options.', 'Pune', 'Manoj Deshmukh', 'Lane 5, Wakad, Pune', 'VERIFIED', true),
('pun-dec-01', NULL, 'Elegance Floral & Mandap Decor', 'Grand floral mandaps, fairy tale aisles, and eco-friendly wedding styling.', 'Pune', 'Sneha Patil', 'Aundh High St, Pune', 'VERIFIED', true),
('pun-lgt-01', NULL, 'Lumina Wedding Illumination', 'Architectural mood lighting, kinetic lights, and laser canopy experiences.', 'Pune', 'Karan Mehta', 'Baner IT Park Rd, Pune', 'VERIFIED', true),
('pun-pht-01', NULL, 'Candid Moments Studio Pune', 'Cinematic 4K wedding films, drone videography, and timeless fine-art portraits.', 'Pune', 'Sameer Kulkarni', 'FC Road, Pune', 'VERIFIED', true),
('pun-snd-01', NULL, 'BeatPulse Sound & DJ Systems', 'Concert line arrays, JBL VTX rigs, Pioneer CDJ-3000 setups, and wedding party sound.', 'Pune', 'DJ Rahul Roy', 'Viman Nagar, Pune', 'VERIFIED', true),
('pun-fur-01', NULL, 'Royal Lounges & Furniture Rentals', 'Chiavari gold chairs, royal velvet maharaja sofas, and cocktail bar high tables.', 'Pune', 'Vikram Pawar', 'Bavdhan, Pune', 'VERIFIED', true)
ON CONFLICT ("id") DO UPDATE SET
  "business_name" = EXCLUDED."business_name",
  "primary_city" = EXCLUDED."primary_city",
  "verification_status" = EXCLUDED."verification_status";

-- 13. VENDOR SERVICES & SERVICE AREAS
INSERT INTO "vendor_services" ("id", "vendor_id", "category_id", "service_description", "maximum_guest_capacity", "maximum_simultaneous_bookings", "starting_price", "is_active", "is_demo") VALUES
('srv-01', 'pun-cat-01', 'cat-catering', 'Gourmet wedding catering with live Maharashtrian counters.', 1200, 2, 450000, true, true),
('srv-02', 'pun-cat-02', 'cat-catering', 'Traditional royal satvik banquet and multi-cuisine spreads.', 800, 2, 380000, true, true),
('srv-03', 'pun-dec-01', 'cat-decoration', 'Theme mandaps, entrance archways, and fresh floral setups.', 2000, 2, 250000, true, true),
('srv-04', 'pun-lgt-01', 'cat-lighting', 'Intelligent truss lighting, ambient washes, and stage spotlights.', NULL, 2, 150000, true, true),
('srv-05', 'pun-pht-01', 'cat-photography', 'Complete wedding photography, candid cinematic film, and pre-wedding shoot.', NULL, 2, 180000, true, true),
('srv-06', 'pun-snd-01', 'cat-sound', 'Premium sound reinforcement, wireless lavaliers, and acoustic tuning.', NULL, 2, 95000, true, true),
('srv-07', 'pun-fur-01', 'cat-furniture-rental', 'Chiavari chairs, velvet sofas, and banquet setups.', 1500, 2, 120000, true, true)
ON CONFLICT ("id") DO UPDATE SET
  "service_description" = EXCLUDED."service_description",
  "starting_price" = EXCLUDED."starting_price";

INSERT INTO "vendor_service_areas" ("id", "vendor_id", "city", "area", "is_demo") VALUES
('area-01', 'pun-cat-01', 'Pune', 'Baner', true),
('area-02', 'pun-cat-01', 'Pune', 'Wakad', true),
('area-03', 'pun-cat-01', 'Pune', 'Aundh', true),
('area-04', 'pun-cat-02', 'Pune', 'Baner', true),
('area-05', 'pun-cat-02', 'Pune', 'Wakad', true),
('area-06', 'pun-cat-02', 'Pune', 'Kothrud', true),
('area-07', 'pun-dec-01', 'Pune', 'Baner', true),
('area-08', 'pun-lgt-01', 'Pune', 'Baner', true),
('area-09', 'pun-pht-01', 'Pune', 'Baner', true),
('area-10', 'pun-snd-01', 'Pune', 'Baner', true),
('area-11', 'pun-fur-01', 'Pune', 'Baner', true)
ON CONFLICT ("id") DO NOTHING;

-- 14. VENDOR AVAILABILITY
INSERT INTO "vendor_availability" ("id", "vendor_id", "vendor_service_id", "availability_date", "slot", "status", "event_name", "client_name", "is_demo") VALUES
('avail-01', 'pun-cat-01', 'srv-01', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL, true),
('avail-02', 'pun-cat-02', 'srv-02', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL, true),
('avail-03', 'pun-dec-01', 'srv-03', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL, true),
('avail-04', 'pun-lgt-01', 'srv-04', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL, true),
('avail-05', 'pun-pht-01', 'srv-05', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL, true),
('avail-06', 'pun-snd-01', 'srv-06', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL, true),
('avail-07', 'pun-fur-01', 'srv-07', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL, true)
ON CONFLICT ("id") DO UPDATE SET
  "status" = EXCLUDED."status";

-- 15. TIMELINE TASKS
INSERT INTO "timeline_tasks" ("id", "event_id", "task_name", "deadline", "assigned_user_id", "status", "is_demo") VALUES
('tsk-01', 'evt-01', 'Finalize Catering Menu & Tasting', '2026-11-15', 'd0000000-0000-0000-0000-000000000001', 'COMPLETED', true),
('tsk-02', 'evt-01', 'Approve Mandap & Stage Floral 3D Render', '2026-11-20', 'd0000000-0000-0000-0000-000000000001', 'IN_PROGRESS', true),
('tsk-03', 'evt-01', 'Confirm DJ Playlist & Entrance Tracks', '2026-12-01', 'd0000000-0000-0000-0000-000000000001', 'PENDING', true),
('tsk-04', 'evt-01', 'Final Venue Power & Generator Load Check', '2026-12-10', 'd0000000-0000-0000-0000-000000000002', 'PENDING', true),
('tsk-05', 'evt-02', 'Seafront Canopy & Acoustic Wind Shielding', '2026-12-10', 'd0000000-0000-0000-0000-000000000002', 'IN_PROGRESS', true),
('tsk-06', 'evt-03', 'Heritage Peshwai Entrance Installation', '2026-12-28', 'd0000000-0000-0000-0000-000000000002', 'PENDING', true)
ON CONFLICT ("id") DO UPDATE SET
  "task_name" = EXCLUDED."task_name",
  "status" = EXCLUDED."status";

-- 16. ENABLE REALTIME ON RELEVANT TABLES SAFELY
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY['events', 'customer_family_profiles', 'organizer_client_profiles', 'timeline_tasks', 'vendor_availability', 'bookings'];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = tbl
        ) THEN
            EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', tbl);
        END IF;
    END LOOP;
END $$;
