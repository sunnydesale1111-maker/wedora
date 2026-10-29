import { Vendor } from './vendor';

export interface ShortlistItem {
  id: string; // `shortlist-${eventId}-${vendorId}`
  eventId: string;
  eventName: string;
  vendorId: string;
  vendor: Vendor;
  createdAt: string;
  customerBudget?: number;
}

/**
 * Checks if a category belongs to Event Organizers / Planners section
 * as required by Version 3.0 Section 7.
 */
export function isOrganizerCategory(category: string): boolean {
  return (
    category === 'Event Organizers / Wedding Planners' ||
    category === 'End-to-End Event Management' ||
    category === 'End-to-End Event Management Providers'
  );
}
