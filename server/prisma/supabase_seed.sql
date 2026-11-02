-- ====================================================================
-- WEDORA — SUPABASE DEMO DATA SEED SCRIPT
-- Target Project: https://zzasmqqaeeyrvmraidbc.supabase.co
-- Idempotent: Can be run multiple times safely
-- All demo records tagged with is_demo = true
-- ====================================================================

-- 1. SERVICE CATEGORIES
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

-- 2. DEMO USERS (Unlinked from real auth.users, is_demo = true)
INSERT INTO "users" ("id", "auth_user_id", "name", "email", "phone", "role", "is_demo") VALUES
('d0000000-0000-0000-0000-000000000001', NULL, 'Rohan Kulkarni', 'rohil@kulkarni.com', '+919822022222', 'CUSTOMER', true),
('d0000000-0000-0000-0000-000000000002', NULL, 'Aditi Sharma (Lead Planner)', 'planner@weddingorchestrator.com', '+919822011111', 'PLANNER', true),
('d0000000-0000-0000-0000-000000000003', NULL, 'Royal Feast Catering & Hospitality', 'vendor1@royalfeast.com', '+919822033333', 'VENDOR', true),
('d0000000-0000-0000-0000-000000000004', NULL, 'Heritage Rasoi Caterers', 'vendor2@heritagerasoi.com', '+919822044444', 'VENDOR', true),
('d0000000-0000-0000-0000-000000000005', NULL, 'Aniket Tribhavan', 'aniket@tribhavan.com', '+919822055555', 'CUSTOMER', true)
ON CONFLICT ("email") DO UPDATE SET
  "name" = EXCLUDED."name",
  "is_demo" = true;

-- 3. CUSTOMER FAMILY PROFILES (Rohan Kulkarni's Family)
INSERT INTO "customer_family_profiles" ("id", "primary_user_id", "name", "email", "relationship", "avatar", "role", "permissions", "is_demo") VALUES
('prof-rohan-primary', 'd0000000-0000-0000-0000-000000000001', 'Rohan Kulkarni', 'rohil@kulkarni.com', 'Primary Account Holder', 'avatar-1', 'PRIMARY', '{"canViewEvents": true, "canViewVendors": true, "canViewTasks": true, "canViewBudgets": true, "canViewBookings": true, "canMakeBookings": true, "canManagePayments": true, "canManageEvents": true, "canModifyBudgets": true, "canUpdateTasks": true, "canManageProfiles": true, "canInviteMembers": true}', true),
('prof-priya-spouse', 'd0000000-0000-0000-0000-000000000001', 'Priya Deshmukh', 'priya.d@gmail.com', 'Bride / Spouse', 'avatar-2', 'FAMILY_MEMBER', '{"canViewEvents": true, "canViewVendors": true, "canViewTasks": true, "canViewBudgets": true, "canViewBookings": true, "canMakeBookings": false, "canManagePayments": false, "canManageEvents": false, "canModifyBudgets": false, "canUpdateTasks": false, "canManageProfiles": false, "canInviteMembers": false}', true),
('prof-sunita-mother', 'd0000000-0000-0000-0000-000000000001', 'Sunita Kulkarni', 'sunita.k@gmail.com', 'Mother of Groom', 'avatar-3', 'FAMILY_MEMBER', '{"canViewEvents": true, "canViewVendors": true, "canViewTasks": true, "canViewBudgets": true, "canViewBookings": true, "canMakeBookings": false, "canManagePayments": false, "canManageEvents": false, "canModifyBudgets": false, "canUpdateTasks": false, "canManageProfiles": false, "canInviteMembers": false}', true),
('prof-ramesh-father', 'd0000000-0000-0000-0000-000000000001', 'Ramesh Kulkarni', 'ramesh.k@gmail.com', 'Father of Groom', 'avatar-4', 'FAMILY_MEMBER', '{"canViewEvents": true, "canViewVendors": true, "canViewTasks": true, "canViewBudgets": true, "canViewBookings": true, "canMakeBookings": false, "canManagePayments": false, "canManageEvents": false, "canModifyBudgets": false, "canUpdateTasks": false, "canManageProfiles": false, "canInviteMembers": false}', true)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "relationship" = EXCLUDED."relationship",
  "permissions" = EXCLUDED."permissions";

-- 4. ORGANIZER CLIENT PROFILES (Aditi Sharma's Clients)
INSERT INTO "organizer_client_profiles" ("id", "organizer_user_id", "client_name", "client_email", "client_phone", "company", "status", "notes", "is_demo") VALUES
('client-01', 'd0000000-0000-0000-0000-000000000002', 'Rohan & Priya', 'rohil@kulkarni.com', '+919822022222', 'Kulkarni Family', 'ACTIVE', 'Grand Maharashtrian wedding at Baner. 500 guests.', true),
('client-02', 'd0000000-0000-0000-0000-000000000002', 'Rocky & Sneha', 'rocky@deshmukh.com', '+919822033333', 'Deshmukh Corporation', 'ACTIVE', 'Seafront celebration in Bandra, Mumbai. 750 guests.', true),
('client-03', 'd0000000-0000-0000-0000-000000000002', 'Amit & Neha', 'amit@patil.com', '+919822044444', 'Patil Group', 'ACTIVE', 'Traditional Vivah & Mandap at Kothrud, Pune. 350 guests.', true)
ON CONFLICT ("id") DO UPDATE SET
  "client_name" = EXCLUDED."client_name",
  "client_email" = EXCLUDED."client_email",
  "status" = EXCLUDED."status";

-- 5. DEMO EVENTS
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

-- 6. EVENT PARTICIPANTS (Shared With)
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

-- 7. DEMO VENDORS
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

-- 8. VENDOR SERVICES & SERVICE AREAS
INSERT INTO "vendor_services" ("id", "vendor_id", "category_id", "service_description", "maximum_guest_capacity", "maximum_simultaneous_bookings", "starting_price", "is_active") VALUES
('srv-01', 'pun-cat-01', 'cat-catering', 'Gourmet wedding catering with live Maharashtrian counters.', 1200, 2, 450000, true),
('srv-02', 'pun-cat-02', 'cat-catering', 'Traditional royal satvik banquet and multi-cuisine spreads.', 800, 2, 380000, true),
('srv-03', 'pun-dec-01', 'cat-decoration', 'Theme mandaps, entrance archways, and fresh floral setups.', 2000, 2, 250000, true),
('srv-04', 'pun-lgt-01', 'cat-lighting', 'Intelligent truss lighting, ambient washes, and stage spotlights.', NULL, 2, 150000, true),
('srv-05', 'pun-pht-01', 'cat-photography', 'Complete wedding photography, candid cinematic film, and pre-wedding shoot.', NULL, 2, 180000, true),
('srv-06', 'pun-snd-01', 'cat-sound', 'Premium sound reinforcement, wireless lavaliers, and acoustic tuning.', NULL, 2, 95000, true),
('srv-07', 'pun-fur-01', 'cat-furniture-rental', 'Chiavari chairs, velvet sofas, and banquet setups.', 1500, 2, 120000, true)
ON CONFLICT ("id") DO UPDATE SET
  "service_description" = EXCLUDED."service_description",
  "starting_price" = EXCLUDED."starting_price";

INSERT INTO "vendor_service_areas" ("id", "vendor_id", "city", "area") VALUES
('area-01', 'pun-cat-01', 'Pune', 'Baner'),
('area-02', 'pun-cat-01', 'Pune', 'Wakad'),
('area-03', 'pun-cat-01', 'Pune', 'Aundh'),
('area-04', 'pun-cat-02', 'Pune', 'Baner'),
('area-05', 'pun-cat-02', 'Pune', 'Wakad'),
('area-06', 'pun-cat-02', 'Pune', 'Kothrud'),
('area-07', 'pun-dec-01', 'Pune', 'Baner'),
('area-08', 'pun-lgt-01', 'Pune', 'Baner'),
('area-09', 'pun-pht-01', 'Pune', 'Baner'),
('area-10', 'pun-snd-01', 'Pune', 'Baner'),
('area-11', 'pun-fur-01', 'Pune', 'Baner')
ON CONFLICT ("id") DO NOTHING;

-- 9. VENDOR AVAILABILITY (Factual Date Checking)
INSERT INTO "vendor_availability" ("id", "vendor_id", "availability_date", "slot", "status", "event_name", "client_name") VALUES
('avail-01', 'pun-cat-01', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL),
('avail-02', 'pun-cat-02', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL),
('avail-03', 'pun-dec-01', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL),
('avail-04', 'pun-lgt-01', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL),
('avail-05', 'pun-pht-01', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL),
('avail-06', 'pun-snd-01', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL),
('avail-07', 'pun-fur-01', '2026-12-15', 'FULL_DAY', 'AVAILABLE', NULL, NULL)
ON CONFLICT ("vendor_id", "availability_date", "slot") DO UPDATE SET
  "status" = EXCLUDED."status";

-- 10. TIMELINE TASKS
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

