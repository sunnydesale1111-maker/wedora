/**
 * Multiple User Profiles Types for Wedora
 *
 * Supports:
 * Part A: Individual Customer Multiple Profiles (Primary + up to 5 Family Members)
 * Part B: Professional Event Organizer Multiple Client Profiles
 */

export type CustomerProfileRole = 'PRIMARY' | 'FAMILY_MEMBER';

export interface CustomerProfilePermissions {
  canViewEvents: boolean;
  canViewVendors: boolean;
  canViewTasks: boolean;
  canViewBudgets: boolean;
  canViewBookings: boolean;
  canMakeBookings: boolean;
  canManagePayments: boolean;
  canManageEvents: boolean;
  canModifyBudgets: boolean;
  canUpdateTasks: boolean;
  canManageProfiles: boolean;
  canInviteMembers: boolean;
}

export interface CustomerProfile {
  id: string;
  primaryUserId: string;
  name: string;
  email: string;
  relationship: string; // e.g. "Primary Account", "Spouse", "Parent", "Sibling", "Family Member"
  avatar: string; // avatar identifier (e.g. "avatar-1", "avatar-2", etc.)
  role: CustomerProfileRole;
  permissions: CustomerProfilePermissions;
  sharedEventIds: string[];
  createdAt: string;
}

export interface OrganizerClientProfile {
  id: string;
  organizerUserId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  company?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  notes?: string;
  eventIds: string[];
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PRIMARY_PERMISSIONS: CustomerProfilePermissions = {
  canViewEvents: true,
  canViewVendors: true,
  canViewTasks: true,
  canViewBudgets: true,
  canViewBookings: true,
  canMakeBookings: true,
  canManagePayments: true,
  canManageEvents: true,
  canModifyBudgets: true,
  canUpdateTasks: true,
  canManageProfiles: true,
  canInviteMembers: true,
};

export const DEFAULT_FAMILY_PERMISSIONS: CustomerProfilePermissions = {
  canViewEvents: true,
  canViewVendors: true,
  canViewTasks: true,
  canViewBudgets: true,
  canViewBookings: true,
  canMakeBookings: false,
  canManagePayments: false,
  canManageEvents: false,
  canModifyBudgets: false,
  canUpdateTasks: false,
  canManageProfiles: false,
  canInviteMembers: false,
};

export const MAX_ADDITIONAL_FAMILY_PROFILES = 5;

