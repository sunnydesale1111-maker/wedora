-- ====================================================================
-- WEDORA — SUPABASE MASTER DATABASE SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Target Project: https://zzasmqqaeeyrvmraidbc.supabase.co
-- Completely clean execution: Drops previous partial tables and creates all tables with RLS enabled
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('VENDOR', 'PLANNER', 'CUSTOMER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'TENTATIVELY_RESERVED', 'FULLY_BOOKED', 'UNAVAILABLE', 'NOT_UPDATED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "InquiryStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'QUOTED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'EXPIRED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "BookingStatus" AS ENUM ('PENDING_CONFIRMATION', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentType" AS ENUM ('CUSTOMER_TO_VENDOR', 'PLANNER_TO_VENDOR', 'CUSTOMER_TO_PLANNER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. CLEAN SLATE: DROP PREVIOUS PARTIAL PUBLIC TABLES SAFELY
DROP TABLE IF EXISTS "customer_profile_event_access" CASCADE;
DROP TABLE IF EXISTS "customer_family_profiles" CASCADE;
DROP TABLE IF EXISTS "organizer_client_profiles" CASCADE;
DROP TABLE IF EXISTS "event_participants" CASCADE;
DROP TABLE IF EXISTS "timeline_tasks" CASCADE;
DROP TABLE IF EXISTS "payments" CASCADE;
DROP TABLE IF EXISTS "bookings" CASCADE;
DROP TABLE IF EXISTS "quotations" CASCADE;
DROP TABLE IF EXISTS "inquiries" CASCADE;
DROP TABLE IF EXISTS "events" CASCADE;
DROP TABLE IF EXISTS "vendor_availability" CASCADE;
DROP TABLE IF EXISTS "vendor_service_areas" CASCADE;
DROP TABLE IF EXISTS "vendor_services" CASCADE;
DROP TABLE IF EXISTS "vendors" CASCADE;
DROP TABLE IF EXISTS "service_categories" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- 4. USERS (PUBLIC PROFILES SYNCED WITH auth.users)
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "auth_user_id" UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT NOT NULL DEFAULT '',
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Trigger to sync auth.users with public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, auth_user_id, name, email, phone, role, is_demo)
    VALUES (
        new.id,
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        COALESCE(new.raw_user_meta_data->>'phone', ''),
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

-- 5. SERVICE CATEGORIES
CREATE TABLE "service_categories" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "category_name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT
);

-- 6. VENDORS & SERVICES
CREATE TABLE "vendors" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
    "business_name" TEXT NOT NULL,
    "business_description" TEXT NOT NULL DEFAULT '',
    "primary_city" TEXT NOT NULL,
    "contact_person" TEXT,
    "business_address" TEXT,
    "verification_status" TEXT NOT NULL DEFAULT 'VERIFIED',
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX "vendors_primary_city_idx" ON "vendors"("primary_city");

CREATE TABLE "vendor_services" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "vendor_id" TEXT NOT NULL REFERENCES "vendors"("id") ON DELETE CASCADE,
    "category_id" TEXT NOT NULL REFERENCES "service_categories"("id") ON DELETE RESTRICT,
    "service_description" TEXT NOT NULL,
    "maximum_guest_capacity" INT,
    "maximum_simultaneous_bookings" INT NOT NULL DEFAULT 1,
    "starting_price" DOUBLE PRECISION,
    "portfolio_images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "vendor_service_areas" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "vendor_id" TEXT NOT NULL REFERENCES "vendors"("id") ON DELETE CASCADE,
    "city" TEXT NOT NULL,
    "area" TEXT NOT NULL
);

-- Slot-level availability with conflict prevention
CREATE TABLE "vendor_availability" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "vendor_id" TEXT NOT NULL REFERENCES "vendors"("id") ON DELETE CASCADE,
    "availability_date" DATE NOT NULL,
    "slot" TEXT NOT NULL DEFAULT 'FULL_DAY', -- FIRST_HALF, SECOND_HALF, FULL_DAY
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, BOOKED, TENTATIVE
    "event_name" TEXT,
    "client_name" TEXT,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "uq_vendor_date_slot" UNIQUE ("vendor_id", "availability_date", "slot")
);

-- 7. ORGANIZER CLIENT PROFILES
CREATE TABLE "organizer_client_profiles" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "organizer_user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "client_phone" TEXT NOT NULL,
    "company" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX "organizer_client_profiles_organizer_idx" ON "organizer_client_profiles"("organizer_user_id");

-- 8. CUSTOMER FAMILY PROFILES
CREATE TABLE "customer_family_profiles" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "primary_user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "relationship" TEXT NOT NULL DEFAULT 'Family Member',
    "avatar" TEXT NOT NULL DEFAULT 'avatar-1',
    "role" TEXT NOT NULL DEFAULT 'FAMILY_MEMBER',
    "permissions" JSONB NOT NULL DEFAULT '{"canViewEvents": true, "canViewVendors": true, "canViewTasks": true, "canViewBudgets": true, "canViewBookings": true, "canMakeBookings": false, "canManagePayments": false, "canManageEvents": false, "canModifyBudgets": false, "canUpdateTasks": false, "canManageProfiles": false, "canInviteMembers": false}',
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX "customer_family_profiles_user_idx" ON "customer_family_profiles"("primary_user_id");

-- 9. EVENTS
CREATE TABLE "events" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "owner_user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "organizer_client_id" TEXT REFERENCES "organizer_client_profiles"("id") ON DELETE SET NULL,
    "event_name" TEXT NOT NULL,
    "event_type" TEXT NOT NULL DEFAULT 'Wedding',
    "event_date" DATE NOT NULL,
    "city" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "guest_count" INT NOT NULL DEFAULT 500,
    "estimated_budget" DOUBLE PRECISION,
    "description" TEXT,
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX "events_owner_idx" ON "events"("owner_user_id");
CREATE INDEX "events_date_idx" ON "events"("event_date");

-- 10. EVENT PARTICIPANTS & INVITATIONS
CREATE TABLE "event_participants" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "event_id" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
    "user_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'FAMILY_MEMBER',
    "relationship" TEXT DEFAULT 'Participant',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "can_edit" BOOLEAN NOT NULL DEFAULT false,
    "invited_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "accepted_at" TIMESTAMP(3) WITH TIME ZONE,
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX "event_participants_event_idx" ON "event_participants"("event_id");

-- 11. INQUIRIES, QUOTATIONS & BOOKINGS
CREATE TABLE "inquiries" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "event_id" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
    "vendor_service_id" TEXT NOT NULL REFERENCES "vendor_services"("id") ON DELETE CASCADE,
    "requester_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "status" "InquiryStatus" NOT NULL DEFAULT 'PENDING',
    "requirements" TEXT NOT NULL,
    "guest_count" INT,
    "event_date" DATE NOT NULL,
    "budget" DOUBLE PRECISION,
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "quotations" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "inquiry_id" TEXT NOT NULL REFERENCES "inquiries"("id") ON DELETE CASCADE,
    "event_id" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
    "vendor_id" TEXT NOT NULL REFERENCES "vendors"("id") ON DELETE CASCADE,
    "vendor_service_id" TEXT NOT NULL REFERENCES "vendor_services"("id") ON DELETE CASCADE,
    "quoted_amount" DOUBLE PRECISION NOT NULL,
    "service_scope" TEXT NOT NULL,
    "included_services" TEXT,
    "additional_charges" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valid_until" DATE NOT NULL,
    "payment_terms" TEXT,
    "status" "QuotationStatus" NOT NULL DEFAULT 'SENT',
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "bookings" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "event_id" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
    "quotation_id" TEXT NOT NULL REFERENCES "quotations"("id") ON DELETE CASCADE,
    "vendor_id" TEXT NOT NULL REFERENCES "vendors"("id") ON DELETE CASCADE,
    "vendor_service_id" TEXT NOT NULL REFERENCES "vendor_services"("id") ON DELETE CASCADE,
    "customer_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "slot" TEXT NOT NULL DEFAULT 'FULL_DAY', -- FIRST_HALF, SECOND_HALF, FULL_DAY
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING_CONFIRMATION',
    "agreed_amount" DOUBLE PRECISION NOT NULL,
    "event_date" DATE NOT NULL,
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 12. PAYMENTS (DEMO / SIMULATED RECORDS)
CREATE TABLE "payments" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "booking_id" TEXT REFERENCES "bookings"("id") ON DELETE SET NULL,
    "event_id" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
    "payer_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "payee_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_purpose" TEXT NOT NULL,
    "is_simulated" BOOLEAN NOT NULL DEFAULT true,
    "transaction_ref" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 13. TIMELINE & PLANNING TASKS
CREATE TABLE "timeline_tasks" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "event_id" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
    "task_name" TEXT NOT NULL,
    "deadline" DATE,
    "assigned_user_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "related_booking_id" TEXT REFERENCES "bookings"("id") ON DELETE SET NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) ACTIVATION (Every public table protected)
-- ====================================================================

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "service_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendor_services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendor_service_areas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendor_availability" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customer_family_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organizer_client_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "event_participants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inquiries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "quotations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "timeline_tasks" ENABLE ROW LEVEL SECURITY;

-- 1. Users Policies
DROP POLICY IF EXISTS "users_select_all" ON "users";
CREATE POLICY "users_select_all" ON "users" FOR SELECT USING (true);

DROP POLICY IF EXISTS "users_update_own" ON "users";
CREATE POLICY "users_update_own" ON "users" FOR UPDATE USING (auth.uid() = id);

-- 2. Service Categories & Catalog Policies (Publicly readable)
DROP POLICY IF EXISTS "service_categories_read_all" ON "service_categories";
CREATE POLICY "service_categories_read_all" ON "service_categories" FOR SELECT USING (true);

DROP POLICY IF EXISTS "vendors_select_public" ON "vendors";
CREATE POLICY "vendors_select_public" ON "vendors" FOR SELECT USING (true);

DROP POLICY IF EXISTS "vendor_services_select_public" ON "vendor_services";
CREATE POLICY "vendor_services_select_public" ON "vendor_services" FOR SELECT USING (true);

DROP POLICY IF EXISTS "vendor_service_areas_read_all" ON "vendor_service_areas";
CREATE POLICY "vendor_service_areas_read_all" ON "vendor_service_areas" FOR SELECT USING (true);

DROP POLICY IF EXISTS "vendor_availability_select_public" ON "vendor_availability";
CREATE POLICY "vendor_availability_select_public" ON "vendor_availability" FOR SELECT USING (true);

-- Vendor Management: Vendors manage their own business profile, services, and availability
DROP POLICY IF EXISTS "vendors_manage_own" ON "vendors";
CREATE POLICY "vendors_manage_own" ON "vendors" FOR ALL USING (
    is_demo = true OR auth.uid() = user_id
);

DROP POLICY IF EXISTS "vendor_services_manage_own" ON "vendor_services";
CREATE POLICY "vendor_services_manage_own" ON "vendor_services" FOR ALL USING (
    is_active = true OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "vendor_service_areas_manage_own" ON "vendor_service_areas";
CREATE POLICY "vendor_service_areas_manage_own" ON "vendor_service_areas" FOR ALL USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "vendor_availability_manage_own" ON "vendor_availability";
CREATE POLICY "vendor_availability_manage_own" ON "vendor_availability" FOR ALL USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
);

-- 3. Events Policies (Owner, assigned organizer, or accepted participant can view/manage)
DROP POLICY IF EXISTS "events_access" ON "events";
CREATE POLICY "events_access" ON "events" FOR ALL USING (
    is_demo = true OR
    auth.uid() = owner_user_id OR 
    organizer_client_id IN (
        SELECT id FROM organizer_client_profiles WHERE organizer_user_id = auth.uid()
    ) OR
    id IN (
        SELECT event_id FROM event_participants WHERE (user_id = auth.uid() OR email = (auth.jwt() ->> 'email')) AND status = 'ACCEPTED'
    )
);

-- 4. Customer Family Profiles Policies
DROP POLICY IF EXISTS "family_profiles_manage" ON "customer_family_profiles";
CREATE POLICY "family_profiles_manage" ON "customer_family_profiles" FOR ALL USING (
    is_demo = true OR
    auth.uid() = primary_user_id
);

DROP POLICY IF EXISTS "family_profiles_read_member" ON "customer_family_profiles";
CREATE POLICY "family_profiles_read_member" ON "customer_family_profiles" FOR SELECT USING (
    is_demo = true OR
    email = (auth.jwt() ->> 'email')
);

-- 5. Organizer Client Profiles Policies
DROP POLICY IF EXISTS "organizer_clients_manage" ON "organizer_client_profiles";
CREATE POLICY "organizer_clients_manage" ON "organizer_client_profiles" FOR ALL USING (
    is_demo = true OR
    auth.uid() = organizer_user_id
);

-- 6. Event Participants Policies
DROP POLICY IF EXISTS "participants_access" ON "event_participants";
CREATE POLICY "participants_access" ON "event_participants" FOR ALL USING (
    is_demo = true OR
    event_id IN (SELECT id FROM events WHERE owner_user_id = auth.uid()) OR
    user_id = auth.uid() OR
    email = (auth.jwt() ->> 'email')
);

-- 7. Inquiries, Quotations & Bookings Policies
DROP POLICY IF EXISTS "inquiries_access" ON "inquiries";
CREATE POLICY "inquiries_access" ON "inquiries" FOR ALL USING (
    is_demo = true OR requester_id = auth.uid() OR
    vendor_service_id IN (SELECT id FROM vendor_services WHERE vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()))
);

DROP POLICY IF EXISTS "quotations_access" ON "quotations";
CREATE POLICY "quotations_access" ON "quotations" FOR ALL USING (
    is_demo = true OR
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()) OR
    event_id IN (SELECT id FROM events WHERE owner_user_id = auth.uid())
);

DROP POLICY IF EXISTS "bookings_access" ON "bookings";
CREATE POLICY "bookings_access" ON "bookings" FOR ALL USING (
    is_demo = true OR customer_id = auth.uid() OR
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
);

-- 8. Payments Policies
DROP POLICY IF EXISTS "payments_access" ON "payments";
CREATE POLICY "payments_access" ON "payments" FOR ALL USING (
    is_simulated = true OR payer_id = auth.uid() OR payee_id = auth.uid()
);

-- 9. Timeline Tasks Policies
DROP POLICY IF EXISTS "timeline_tasks_access" ON "timeline_tasks";
CREATE POLICY "timeline_tasks_access" ON "timeline_tasks" FOR ALL USING (
    is_demo = true OR
    event_id IN (SELECT id FROM events WHERE owner_user_id = auth.uid())
);

-- ====================================================================
-- SUPABASE REALTIME REPLICATION (For Cross-Device Sync)
-- ====================================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'events') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE "events";
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'timeline_tasks') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE "timeline_tasks";
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'bookings') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE "bookings";
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'vendor_availability') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE "vendor_availability";
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'event_participants') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE "event_participants";
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'customer_family_profiles') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE "customer_family_profiles";
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'organizer_client_profiles') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE "organizer_client_profiles";
    END IF;
EXCEPTION WHEN others THEN null; END $$;
