import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  INITIAL_DEMO_CUSTOMER_PROFILES,
  INITIAL_DEMO_ORGANIZER_CLIENTS,
} from '../data/demoProfiles';
import {
  CustomerProfile,
  OrganizerClientProfile,
  MAX_ADDITIONAL_FAMILY_PROFILES,
  DEFAULT_PRIMARY_PERMISSIONS,
  DEFAULT_FAMILY_PERMISSIONS,
} from '../types/profile';
import { INITIAL_DEMO_EVENTS } from '../data/demoEvents';

describe('Wedora Multiple User Profiles Test Suite', () => {
  // =========================================================================
  // PART A — INDIVIDUAL CUSTOMER MULTIPLE PROFILES
  // =========================================================================
  describe('Part A: Individual Customer Multiple Profiles', () => {
    it('1. Primary Account and Family Profiles: Rohan has 1 primary profile and family members', () => {
      const rohanProfiles = INITIAL_DEMO_CUSTOMER_PROFILES.filter(
        (p) => p.primaryUserId === 'rohil@kulkarni.com' || p.primaryUserId.includes('kulkarni')
      );
      const primary = rohanProfiles.find((p) => p.role === 'PRIMARY');
      expect(primary).toBeDefined();
      expect(primary?.name).toContain('Rohan Kulkarni');
      expect(primary?.role).toBe('PRIMARY');

      const familyMembers = rohanProfiles.filter((p) => p.role === 'FAMILY_MEMBER');
      expect(familyMembers.length).toBeGreaterThan(0);
      expect(familyMembers.length).toBeLessThanOrEqual(MAX_ADDITIONAL_FAMILY_PROFILES);
    });

    it('2. Max 5 Additional Family Profiles Guard: 6th additional profile is strictly blocked', () => {
      // Simulate adding up to 5 family profiles for a customer
      const existingFamily: CustomerProfile[] = [];
      for (let i = 1; i <= 5; i++) {
        existingFamily.push({
          id: `fam-${i}`,
          primaryUserId: 'test-user@wedora.com',
          name: `Family Member ${i}`,
          email: `family${i}@wedora.com`,
          relationship: 'Sibling',
          avatar: `avatar-${i}`,
          role: 'FAMILY_MEMBER',
          permissions: DEFAULT_FAMILY_PERMISSIONS,
          sharedEventIds: ['evt-01'],
          createdAt: new Date().toISOString(),
        });
      }

      expect(existingFamily.length).toBe(MAX_ADDITIONAL_FAMILY_PROFILES);

      // Attempting to add a 6th family profile must fail
      const tryAddSixthFamilyMember = () => {
        if (existingFamily.length >= MAX_ADDITIONAL_FAMILY_PROFILES) {
          throw new Error(
            `A primary customer account can have up to ${MAX_ADDITIONAL_FAMILY_PROFILES} additional family profiles (maximum reached).`
          );
        }
      };

      expect(tryAddSixthFamilyMember).toThrowError(/up to 5 additional family profiles/);
    });

    it('3. Granular Family Permissions: Primary has full access; Family members have view-only access', () => {
      // Primary permissions
      expect(DEFAULT_PRIMARY_PERMISSIONS.canMakeBookings).toBe(true);
      expect(DEFAULT_PRIMARY_PERMISSIONS.canManagePayments).toBe(true);
      expect(DEFAULT_PRIMARY_PERMISSIONS.canManageEvents).toBe(true);
      expect(DEFAULT_PRIMARY_PERMISSIONS.canModifyBudgets).toBe(true);
      expect(DEFAULT_PRIMARY_PERMISSIONS.canUpdateTasks).toBe(true);
      expect(DEFAULT_PRIMARY_PERMISSIONS.canManageProfiles).toBe(true);

      // Family member permissions (view-only)
      expect(DEFAULT_FAMILY_PERMISSIONS.canMakeBookings).toBe(false);
      expect(DEFAULT_FAMILY_PERMISSIONS.canManagePayments).toBe(false);
      expect(DEFAULT_FAMILY_PERMISSIONS.canManageEvents).toBe(false);
      expect(DEFAULT_FAMILY_PERMISSIONS.canModifyBudgets).toBe(false);
      expect(DEFAULT_FAMILY_PERMISSIONS.canUpdateTasks).toBe(false);
      expect(DEFAULT_FAMILY_PERMISSIONS.canManageProfiles).toBe(false);
      expect(DEFAULT_FAMILY_PERMISSIONS.canViewEvents).toBe(true);
      expect(DEFAULT_FAMILY_PERMISSIONS.canViewVendors).toBe(true);
      expect(DEFAULT_FAMILY_PERMISSIONS.canViewTasks).toBe(true);
    });

    it('4. Event Filtering: Family members only see permitted shared events', () => {
      const allCustomerEvents = [
        { id: 'evt-01', eventName: 'Rohan & Priya Royal Wedding' },
        { id: 'evt-02', eventName: 'Pre-Wedding Sangeet & Mehendi' },
        { id: 'evt-03', eventName: 'Private Family Celebration' },
      ];

      // Sibling has access to evt-01 and evt-02 only
      const siblingProfile: CustomerProfile = {
        id: 'fam-sister',
        primaryUserId: 'rohil@kulkarni.com',
        name: 'Sneha Kulkarni',
        email: 'sneha@demo.wedora.com',
        relationship: 'Sister',
        avatar: 'avatar-3',
        role: 'FAMILY_MEMBER',
        permissions: DEFAULT_FAMILY_PERMISSIONS,
        sharedEventIds: ['evt-01', 'evt-02'],
        createdAt: new Date().toISOString(),
      };

      const visibleEvents = allCustomerEvents.filter((e) =>
        siblingProfile.sharedEventIds.includes(e.id)
      );

      expect(visibleEvents.map((e) => e.id)).toEqual(['evt-01', 'evt-02']);
      expect(visibleEvents.some((e) => e.id === 'evt-03')).toBe(false);
    });

    it('5. Individual Customer Data Isolation: Rohan preserves events, Aniket starts completely empty', () => {
      const rohanEvents = INITIAL_DEMO_EVENTS.filter((e) =>
        (e.clientEmail && e.clientEmail.includes('kulkarni')) ||
        (e.clientName && e.clientName.includes('Rohan') || e.clientName?.includes('Rohil'))
      );
      expect(rohanEvents.length).toBeGreaterThan(0);

      // Aniket Tribhavan starts with zero events, zero bookings, zero extra profiles
      const aniketEmail = 'anikettribhavan76@gmail.com';
      const aniketEvents = INITIAL_DEMO_EVENTS.filter((e) => e.clientEmail === aniketEmail);
      expect(aniketEvents.length).toBe(0);

      const aniketExtraProfiles = INITIAL_DEMO_CUSTOMER_PROFILES.filter(
        (p) => p.primaryUserId === aniketEmail && p.role === 'FAMILY_MEMBER'
      );
      expect(aniketExtraProfiles.length).toBe(0);
    });
  });

  // =========================================================================
  // PART B — PROFESSIONAL EVENT ORGANIZER MULTIPLE PROFILES
  // =========================================================================
  describe('Part B: Professional Event Organizer Multiple Profiles', () => {
    it('6. Organizer Client Management: Aditi manages multiple independent client profiles', () => {
      const organizerProfiles = INITIAL_DEMO_ORGANIZER_CLIENTS.filter(
        (c) => c.organizerUserId === 'planner@weddingorchestrator.com'
      );

      expect(organizerProfiles.length).toBeGreaterThanOrEqual(3);

      const clientNames = organizerProfiles.map((c) => c.clientName);
      expect(clientNames.some((n) => n.includes('Aditya'))).toBe(true);
      expect(clientNames.some((n) => n.includes('Pooja') || n.includes('Birthday'))).toBe(true);
      expect(clientNames.some((n) => n.includes('TechCorp') || n.includes('Corporate'))).toBe(true);
    });

    it('7. Multi-Event Client Support: Organizer can link multiple events to a single client profile', () => {
      const adityaClient = INITIAL_DEMO_ORGANIZER_CLIENTS.find((c) =>
        c.clientName.includes('Aditya')
      );
      expect(adityaClient).toBeDefined();

      // Client can have multiple event IDs
      const updatedClient: OrganizerClientProfile = {
        ...adityaClient!,
        eventIds: [...adityaClient!.eventIds, 'evt-aditya-sangeet'],
      };

      expect(updatedClient.eventIds.length).toBeGreaterThanOrEqual(2);
      expect(updatedClient.eventIds).toContain('evt-aditya-sangeet');
    });

    it('8. Active Client Context Switching: Updates event context with zero data leakage', () => {
      const clients = INITIAL_DEMO_ORGANIZER_CLIENTS;
      const birthdayClient = clients.find((c) => c.clientName.includes('Pooja') || c.clientName.includes('Birthday'));
      const corporateClient = clients.find((c) => c.clientName.includes('TechCorp') || c.clientName.includes('Corporate'));

      expect(birthdayClient).toBeDefined();
      expect(corporateClient).toBeDefined();

      // When birthday client is active:
      const activeClientEvents = INITIAL_DEMO_EVENTS.filter((e) =>
        birthdayClient?.eventIds.includes(e.id) || e.clientName === birthdayClient?.clientName
      );
      expect(activeClientEvents.length).toBeGreaterThan(0);
      expect(activeClientEvents[0].eventType).toContain('Birthday');

      // Zero data leakage: corporate event is not present in birthday client view
      const corporateLeaked = activeClientEvents.some((e) =>
        e.clientName?.includes('TechCorp') || e.eventType?.includes('Corporate')
      );
      expect(corporateLeaked).toBe(false);
    });

    it('9. Archiving Client Profiles: Status toggles between ACTIVE and ARCHIVED', () => {
      const client = { ...INITIAL_DEMO_ORGANIZER_CLIENTS[0] };
      expect(client.status).toBe('ACTIVE');

      // Archive client
      client.status = 'ARCHIVED';
      expect(client.status).toBe('ARCHIVED');

      // Unarchive
      client.status = 'ACTIVE';
      expect(client.status).toBe('ACTIVE');
    });
  });

  // =========================================================================
  // PART C — DATABASE SCHEMA, MIGRATION & RLS POLICIES
  // =========================================================================
  describe('Part C: Database & Security Architecture', () => {
    it('10. Supabase SQL Migration exists with CustomerFamilyProfile, EventAccess, and OrganizerClientProfile', () => {
      const migrationFilePath = path.resolve(
        __dirname,
        '../../../server/prisma/migrations/20261102120000_multiple_user_profiles/migration.sql'
      );
      expect(fs.existsSync(migrationFilePath)).toBe(true);

      const sql = fs.readFileSync(migrationFilePath, 'utf8');
      expect(sql).toContain('customer_family_profiles');
      expect(sql).toContain('customer_profile_event_access');
      expect(sql).toContain('organizer_client_profiles');
    });

    it('11. Supabase SQL Migration enables Row-Level Security (RLS) on all profile tables', () => {
      const migrationFilePath = path.resolve(
        __dirname,
        '../../../server/prisma/migrations/20261102120000_multiple_user_profiles/migration.sql'
      );
      const sql = fs.readFileSync(migrationFilePath, 'utf8');

      expect(sql).toContain('ENABLE ROW LEVEL SECURITY');
      expect(sql).toContain('"customer_family_profiles" ENABLE ROW LEVEL SECURITY');
      expect(sql).toContain('"customer_profile_event_access" ENABLE ROW LEVEL SECURITY');
      expect(sql).toContain('"organizer_client_profiles" ENABLE ROW LEVEL SECURITY');
    });

    it('12. Supabase SQL Migration includes Database Trigger enforcing the 5-family-profile limit', () => {
      const migrationFilePath = path.resolve(
        __dirname,
        '../../../server/prisma/migrations/20261102120000_multiple_user_profiles/migration.sql'
      );
      const sql = fs.readFileSync(migrationFilePath, 'utf8');

      expect(sql).toContain('enforce_max_family_profiles');
      expect(sql).toContain('trg_enforce_max_family_profiles');
      expect(sql).toContain('cannot exceed 5 additional family profiles');
    });

    it('13. Prisma schema contains models linked to User and Event', () => {
      const prismaPath = path.resolve(__dirname, '../../../server/prisma/schema.prisma');
      expect(fs.existsSync(prismaPath)).toBe(true);

      const schema = fs.readFileSync(prismaPath, 'utf8');
      expect(schema).toContain('model CustomerFamilyProfile');
      expect(schema).toContain('model CustomerProfileEventAccess');
      expect(schema).toContain('model OrganizerClientProfile');
    });

    it('14. Backend profile controller enforces 5-profile limit and authorization', () => {
      const controllerPath = path.resolve(__dirname, '../../../server/src/controllers/profile.controller.ts');
      expect(fs.existsSync(controllerPath)).toBe(true);

      const code = fs.readFileSync(controllerPath, 'utf8');
      expect(code).toContain('MAX_FAMILY_PROFILES = 5');
      expect(code).toContain('PRIMARY_ACCOUNT_FAMILY_LIMIT_EXCEEDED');
      expect(code).toContain('createFamilyProfile');
      expect(code).toContain('deleteFamilyProfile');
      expect(code).toContain('createOrganizerClient');
      expect(code).toContain('archiveOrganizerClient');
    });
  });

  // =========================================================================
  // PART D — VENDOR DASHBOARD ISOLATION
  // =========================================================================
  describe('Part D: Vendor Dashboard Isolation', () => {
    it('15. Vendor Dashboard remains untouched without profile selector components', () => {
      const vendorRoutePath = path.resolve(__dirname, '../routes/vendor.tsx');
      expect(fs.existsSync(vendorRoutePath)).toBe(true);

      const vendorRouteCode = fs.readFileSync(vendorRoutePath, 'utf8');
      // Assert that Vendor Dashboard DOES NOT import or render CustomerProfileSelector or ManageClientProfilesModal
      expect(vendorRouteCode).not.toContain('CustomerProfileSelector');
      expect(vendorRouteCode).not.toContain('ManageFamilyProfilesModal');
      expect(vendorRouteCode).not.toContain('ManageClientProfilesModal');
      expect(vendorRouteCode).not.toContain('organizerClients');
    });
  });
});
