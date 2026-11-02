-- WEDORA: EVENT PARTICIPANTS & INVITATIONS
-- Supports Event-Level Participant Relationships with Supabase Row Level Security (RLS)

-- 1. Create event_participants table
CREATE TABLE IF NOT EXISTS "event_participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'FAMILY_MEMBER', -- 'PRIMARY', 'CO_HOST', 'FAMILY_MEMBER', 'GUEST'
    "relationship" TEXT DEFAULT 'Participant',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING' or 'ACCEPTED'
    "can_edit" BOOLEAN NOT NULL DEFAULT false,
    "invited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_event_participants_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_event_participants_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "event_participants_event_id_idx" ON "event_participants"("event_id");
CREATE INDEX IF NOT EXISTS "event_participants_user_id_idx" ON "event_participants"("user_id");
CREATE INDEX IF NOT EXISTS "event_participants_email_idx" ON "event_participants"("email");

-- 2. Enable Row Level Security (RLS)
ALTER TABLE "event_participants" ENABLE ROW LEVEL SECURITY;

-- 3. Organizer and Event Owner Policies:
-- Event owner (customer) and assigned organizer can manage all participants for their events
CREATE POLICY "owner_organizer_manage_event_participants"
    ON "event_participants"
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM "events" e
            WHERE e.id = event_participants.event_id 
              AND (e.owner_user_id = auth.uid() OR e.organizer_client_id IN (
                  SELECT id FROM "organizer_client_profiles" WHERE organizer_user_id = auth.uid()
              ))
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "events" e
            WHERE e.id = event_participants.event_id 
              AND (e.owner_user_id = auth.uid() OR e.organizer_client_id IN (
                  SELECT id FROM "organizer_client_profiles" WHERE organizer_user_id = auth.uid()
              ))
        )
    );

-- 4. Participant Access Policy:
-- Participants can view event details ONLY if invitation is accepted and verified
CREATE POLICY "participant_view_accepted_event"
    ON "event_participants"
    FOR SELECT
    USING (
        status = 'ACCEPTED' AND (
            user_id = auth.uid() OR email = auth.jwt() ->> 'email'
        )
    );

