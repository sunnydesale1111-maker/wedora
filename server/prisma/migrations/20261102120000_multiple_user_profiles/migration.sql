-- WEDORA: MULTIPLE USER PROFILES (CUSTOMER FAMILY PROFILES & ORGANIZER CLIENT PROFILES)
-- Supports Part A (Customer Family Profiles) & Part B (Organizer Client Profiles) with Row Level Security

-- 1. Create customer_family_profiles table
CREATE TABLE IF NOT EXISTS "customer_family_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "primary_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "relationship" TEXT NOT NULL DEFAULT 'Family Member',
    "avatar" TEXT NOT NULL DEFAULT 'avatar-1',
    "role" TEXT NOT NULL DEFAULT 'FAMILY_MEMBER', -- 'PRIMARY' or 'FAMILY_MEMBER'
    "permissions" JSONB NOT NULL DEFAULT '{"canViewEvents": true, "canViewVendors": true, "canViewTasks": true, "canViewBudgets": true, "canViewBookings": true, "canMakeBookings": false, "canManagePayments": false, "canManageEvents": false, "canModifyBudgets": false, "canUpdateTasks": false, "canManageProfiles": false, "canInviteMembers": false}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_customer_family_profiles_user" FOREIGN KEY ("primary_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "customer_family_profiles_primary_user_id_idx" ON "customer_family_profiles"("primary_user_id");
CREATE INDEX IF NOT EXISTS "customer_family_profiles_email_idx" ON "customer_family_profiles"("email");

-- 2. Create customer_profile_event_access table
CREATE TABLE IF NOT EXISTS "customer_profile_event_access" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profile_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "can_view_budget" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_profile_access_profile" FOREIGN KEY ("profile_id") REFERENCES "customer_family_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_profile_access_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "uq_profile_event" UNIQUE ("profile_id", "event_id")
);

CREATE INDEX IF NOT EXISTS "customer_profile_event_access_profile_id_idx" ON "customer_profile_event_access"("profile_id");
CREATE INDEX IF NOT EXISTS "customer_profile_event_access_event_id_idx" ON "customer_profile_event_access"("event_id");

-- 3. Create organizer_client_profiles table
CREATE TABLE IF NOT EXISTS "organizer_client_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizer_user_id" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "client_phone" TEXT NOT NULL,
    "company" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' or 'ARCHIVED'
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_organizer_client_profiles_user" FOREIGN KEY ("organizer_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "organizer_client_profiles_organizer_user_id_idx" ON "organizer_client_profiles"("organizer_user_id");

-- 4. Alter events table to link to organizer_client_profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'organizer_client_id'
    ) THEN
        ALTER TABLE "events" ADD COLUMN "organizer_client_id" TEXT;
        ALTER TABLE "events" ADD CONSTRAINT "fk_events_organizer_client" 
            FOREIGN KEY ("organizer_client_id") REFERENCES "organizer_client_profiles"("id") 
            ON DELETE SET NULL ON UPDATE CASCADE;
        CREATE INDEX "events_organizer_client_id_idx" ON "events"("organizer_client_id");
    END IF;
END $$;

-- 5. Supabase Row Level Security (RLS) Policies
ALTER TABLE "customer_family_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customer_profile_event_access" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organizer_client_profiles" ENABLE ROW LEVEL SECURITY;

-- Customer Profile Policies:
-- Primary user can manage all family profiles under their account
CREATE POLICY "customer_primary_manage_family_profiles"
    ON "customer_family_profiles"
    FOR ALL
    USING (auth.uid() = primary_user_id)
    WITH CHECK (auth.uid() = primary_user_id);

-- Family members can view their own profile by matching email or id
CREATE POLICY "customer_family_view_own_profile"
    ON "customer_family_profiles"
    FOR SELECT
    USING (email = auth.jwt() ->> 'email' OR id = auth.uid()::text);

-- Event Access Policies:
-- Primary account holder can view and manage event access
CREATE POLICY "customer_primary_manage_event_access"
    ON "customer_profile_event_access"
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM "customer_family_profiles" p 
            WHERE p.id = customer_profile_event_access.profile_id AND p.primary_user_id = auth.uid()
        )
    );

-- Family member can view permitted event access records
CREATE POLICY "customer_family_view_event_access"
    ON "customer_profile_event_access"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "customer_family_profiles" p 
            WHERE p.id = customer_profile_event_access.profile_id AND (p.email = auth.jwt() ->> 'email' OR p.id = auth.uid()::text)
        )
    );

-- Organizer Client Policies:
-- Organizer can only access and manage their own clients
CREATE POLICY "organizer_manage_client_profiles"
    ON "organizer_client_profiles"
    FOR ALL
    USING (auth.uid() = organizer_user_id)
    WITH CHECK (auth.uid() = organizer_user_id);

-- Enforce Maximum of 5 Additional Family Profiles per Primary Customer Trigger
CREATE OR REPLACE FUNCTION enforce_max_family_profiles()
RETURNS TRIGGER AS $$
DECLARE
    family_count INTEGER;
BEGIN
    IF NEW.role = 'FAMILY_MEMBER' THEN
        SELECT COUNT(*) INTO family_count
        FROM "customer_family_profiles"
        WHERE primary_user_id = NEW.primary_user_id AND role = 'FAMILY_MEMBER' AND id != NEW.id;

        IF family_count >= 5 THEN
            RAISE EXCEPTION 'A primary customer account cannot exceed 5 additional family profiles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_max_family_profiles ON "customer_family_profiles";
CREATE TRIGGER trg_enforce_max_family_profiles
    BEFORE INSERT OR UPDATE ON "customer_family_profiles"
    FOR EACH ROW
    EXECUTE FUNCTION enforce_max_family_profiles();
