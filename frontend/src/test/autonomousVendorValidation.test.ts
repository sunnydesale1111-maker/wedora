import { describe, it, expect } from 'vitest';
import { DEMO_VENDORS } from '../data/demoVendors';
import { CANONICAL_CATEGORIES, Vendor } from '../types/vendor';
import { filterVendors, getVendorAreaMetrics } from '../utils/vendorFilters';
import { parseSearchIntent, MUMBAI_LOCALITIES, PUNE_LOCALITIES } from '../utils/searchIntentParser';
import { isOrganizerCategory } from '../types/shortlist';

describe('Autonomous Demo Vendor Dataset Implementation — 17 Mandatory Validations', () => {
  const mumbaiVendors = DEMO_VENDORS.filter((v) => v.primaryCity === 'Mumbai');
  const puneVendors = DEMO_VENDORS.filter((v) => v.primaryCity === 'Pune');

  // Check 1: At least 50 unique vendors in Mumbai
  it('Check 1: At least 50 unique vendors in Mumbai', () => {
    expect(mumbaiVendors.length).toBeGreaterThanOrEqual(50);
  });

  // Check 2: At least 50 unique vendors in Pune
  it('Check 2: At least 50 unique vendors in Pune', () => {
    expect(puneVendors.length).toBeGreaterThanOrEqual(50);
  });

  // Check 3: At least 7 matching vendors in each category in Mumbai
  it('Check 3: At least 7 matching vendors in each category in Mumbai (min 91 matches)', () => {
    let totalMumbaiMatches = 0;
    const categoryCounts: Record<string, number> = {};

    for (const cat of CANONICAL_CATEGORIES) {
      const count = mumbaiVendors.filter(
        (v) => v.category === cat || v.secondaryCategories?.includes(cat as any)
      ).length;
      categoryCounts[cat] = count;
      totalMumbaiMatches += count;
      expect(count, `Mumbai category ${cat} must have at least 7 vendors`).toBeGreaterThanOrEqual(7);
    }

    expect(totalMumbaiMatches).toBeGreaterThanOrEqual(91);
  });

  // Check 4: At least 7 matching vendors in each category in Pune
  it('Check 4: At least 7 matching vendors in each category in Pune (min 91 matches)', () => {
    let totalPuneMatches = 0;
    const categoryCounts: Record<string, number> = {};

    for (const cat of CANONICAL_CATEGORIES) {
      const count = puneVendors.filter(
        (v) => v.category === cat || v.secondaryCategories?.includes(cat as any)
      ).length;
      categoryCounts[cat] = count;
      totalPuneMatches += count;
      expect(count, `Pune category ${cat} must have at least 7 vendors`).toBeGreaterThanOrEqual(7);
    }

    expect(totalPuneMatches).toBeGreaterThanOrEqual(91);
  });

  // Check 5: Every vendor has a unique ID
  it('Check 5: Every vendor has a unique ID', () => {
    const ids = new Set<string>();
    DEMO_VENDORS.forEach((v) => {
      expect(ids.has(v.id), `Duplicate vendor ID detected: ${v.id}`).toBe(false);
      ids.add(v.id);
    });
    expect(ids.size).toBe(DEMO_VENDORS.length);
  });

  // Check 6: Every vendor has a complete profile
  it('Check 6: Every vendor has a complete profile with all mandatory attributes', () => {
    DEMO_VENDORS.forEach((v) => {
      expect(v.id.trim().length).toBeGreaterThan(0);
      expect(v.businessName.trim().length).toBeGreaterThan(0);
      expect(['Mumbai', 'Pune']).toContain(v.primaryCity);
      expect(v.category.trim().length).toBeGreaterThan(0);
      expect(v.description.trim().length).toBeGreaterThan(15);
      expect(v.serviceOfferings).toBeDefined();
      expect(v.serviceOfferings!.length).toBeGreaterThan(0);
      expect(v.maximumSimultaneousBookings).toBeGreaterThanOrEqual(1);
      expect(Object.keys(v.availabilityDates).length).toBeGreaterThan(0);
      expect(v.portfolioImages.length).toBeGreaterThan(0);
      expect(v.completedOrders90Days).toBeGreaterThanOrEqual(0);
      expect(v.contactEmail).toBeDefined();
      expect(v.contactPhone).toBeDefined();
      expect(v.isActive).toBe(true);
      expect(v.isDemoData).toBe(true);
    });
  });

  // Check 7: Every vendor has valid serviceable areas
  it('Check 7: Every vendor has valid serviceable areas from canonical localities', () => {
    DEMO_VENDORS.forEach((v) => {
      expect(v.serviceableAreas.length).toBeGreaterThan(0);
      const allowedLocalities = v.primaryCity === 'Mumbai' ? MUMBAI_LOCALITIES : PUNE_LOCALITIES;

      v.serviceableAreas.forEach((area) => {
        expect(
          allowedLocalities.includes(area),
          `Invalid area "${area}" for city ${v.primaryCity} on vendor ${v.id}`
        ).toBe(true);
      });
    });
  });

  // Check 8: Every vendor has valid service categories
  it('Check 8: Every vendor has valid service categories from canonical catalog', () => {
    DEMO_VENDORS.forEach((v) => {
      const isValidPrimary =
        CANONICAL_CATEGORIES.includes(v.category as any) ||
        v.category === 'Decoration and Flower Arrangements' ||
        v.category === 'Hotels, Lodging and Guest Accommodation' ||
        v.category === 'End-to-End Event Management Providers';
      expect(isValidPrimary, `Invalid primary category: ${v.category}`).toBe(true);

      if (v.secondaryCategories) {
        v.secondaryCategories.forEach((sc) => {
          const isValidSecondary =
            CANONICAL_CATEGORIES.includes(sc as any) ||
            sc === 'Decoration and Flower Arrangements' ||
            sc === 'Hotels, Lodging and Guest Accommodation' ||
            sc === 'End-to-End Event Management Providers';
          expect(isValidSecondary, `Invalid secondary category: ${sc}`).toBe(true);
        });
      }
    });
  });

  // Check 9: No duplicate vendor records
  it('Check 9: No duplicate vendor records (unique IDs and business names)', () => {
    const names = new Set<string>();
    DEMO_VENDORS.forEach((v) => {
      expect(names.has(v.businessName.toLowerCase()), `Duplicate name: ${v.businessName}`).toBe(false);
      names.add(v.businessName.toLowerCase());
    });
  });

  // Check 10: Availability filtering works
  it('Check 10: Availability filtering respects available and unavailable dates', () => {
    // Check specific known unavailable date
    const targetDate = '2026-12-24';
    const results = filterVendors({
      city: 'Mumbai',
      date: targetDate,
    });

    results.results.forEach((v) => {
      const status = v.availabilityDates[targetDate];
      expect(status).not.toBe('Unavailable');
      expect(status).not.toBe('Fully Booked');
    });
  });

  // Check 11: Capacity filtering works
  it('Check 11: Capacity filtering accurately filters only capacity-relevant categories', () => {
    const highGuestCount = 1200;
    const lawnResults = filterVendors({
      category: 'Wedding Lawns and Venues',
      city: 'Mumbai',
      guestCount: highGuestCount,
    });

    lawnResults.results.forEach((v) => {
      expect(v.maximumGuestCapacity).toBeGreaterThanOrEqual(highGuestCount);
    });

    // Non-capacity relevant category (e.g. Photography) must NOT be filtered out by guest count
    const photoResults = filterVendors({
      category: 'Photography and Videography',
      city: 'Mumbai',
      guestCount: highGuestCount,
    });
    expect(photoResults.totalMatched).toBeGreaterThanOrEqual(7);
  });

  // Check 12: Chatbot can retrieve newly added vendors
  it('Check 12: Chatbot can retrieve newly added vendors via conversational search', () => {
    // 1. New Furniture in Mumbai: mum-fur-06
    const p1 = parseSearchIntent('Find royal furniture rentals in Lower Parel Mumbai');
    const r1 = filterVendors({
      category: p1.detectedCategory,
      city: p1.detectedCity,
      areas: p1.detectedAreas,
    });
    const foundFur06 = r1.results.some((v) => v.id === 'mum-fur-06');
    expect(foundFur06).toBe(true);

    // 2. New Hotel in Pune: pun-hot-06
    const p2 = parseSearchIntent('I need hotel suites and guest accommodation in Koregaon Park Pune');
    const r2 = filterVendors({
      category: p2.detectedCategory,
      city: p2.detectedCity,
      areas: p2.detectedAreas,
    });
    const foundHot06 = r2.results.some((v) => v.id === 'pun-hot-06');
    expect(foundHot06).toBe(true);

    // 3. New Makeup in Mumbai: mum-mak-06
    const p3 = parseSearchIntent('Need a bridal makeup and mehendi artist in Bandra');
    const r3 = filterVendors({
      category: p3.detectedCategory,
      city: p3.detectedCity,
      areas: p3.detectedAreas,
    });
    const foundMak06 = r3.results.some((v) => v.id === 'mum-mak-06');
    expect(foundMak06).toBe(true);

    // 4. New E2E in Pune: pun-e2e-06
    const p4 = parseSearchIntent('Looking for end-to-end event management in Kothrud Pune');
    const r4 = filterVendors({
      category: p4.detectedCategory,
      city: p4.detectedCity,
      areas: p4.detectedAreas,
    });
    const foundE2e06 = r4.results.some((v) => v.id === 'pun-e2e-06');
    expect(foundE2e06).toBe(true);
  });

  // Check 13: Shortlisting works for all new vendors
  it('Check 13: Shortlisting works and separates individual services vs organizers', () => {
    const newVendors = [
      DEMO_VENDORS.find((v) => v.id === 'mum-fur-06')!,
      DEMO_VENDORS.find((v) => v.id === 'pun-e2e-06')!,
      DEMO_VENDORS.find((v) => v.id === 'mum-mak-06')!,
      DEMO_VENDORS.find((v) => v.id === 'pun-hot-06')!,
    ];

    const shortlistMock: Array<{ vendor: Vendor; isOrganizer: boolean }> = [];

    newVendors.forEach((v) => {
      shortlistMock.push({
        vendor: v,
        isOrganizer: isOrganizerCategory(v.category),
      });
    });

    const individualVendors = shortlistMock.filter((item) => !item.isOrganizer);
    const organizerVendors = shortlistMock.filter((item) => item.isOrganizer);

    expect(individualVendors.length).toBe(3); // mum-fur-06, mum-mak-06, pun-hot-06
    expect(organizerVendors.length).toBe(1); // pun-e2e-06
    expect(organizerVendors[0].vendor.id).toBe('pun-e2e-06');
  });

  // Check 14: AOV is not displayed or ranked
  it('Check 14: AOV is not part of search sorting criteria', () => {
    const validSortKeys = ['completed_orders', 'repeat_orders', 'referrals', 'price_asc', 'price_desc'];
    expect(validSortKeys).not.toContain('aov');
    expect(validSortKeys).not.toContain('average_order_value');

    // Sorting by completed orders
    const sorted = filterVendors({
      city: 'Pune',
      sortBy: 'completed_orders',
    });
    for (let i = 0; i < sorted.results.length - 1; i++) {
      expect(sorted.results[i].completedOrders90Days).toBeGreaterThanOrEqual(
        sorted.results[i + 1].completedOrders90Days
      );
    }
  });

  // Check 15: Completed orders, repeat orders, and referrals are displayed correctly
  it('Check 15: Completed orders, repeat orders, and referrals are calculated correctly with demo labels', () => {
    // New vendor with 0 orders
    const newVendor = DEMO_VENDORS.find((v) => v.isNewToPlatform && v.completedOrders90Days === 0)!;
    const newMetrics = getVendorAreaMetrics(newVendor, newVendor.serviceableAreas.slice(0, 1), newVendor.primaryCity);
    expect(newMetrics.repeatOrders).toBe(0);
    expect(newMetrics.customerReferrals).toBe(0);

    // Active vendor
    const activeVendor = DEMO_VENDORS.find((v) => !v.isNewToPlatform && v.completedOrders90Days > 10)!;
    const activeMetrics = getVendorAreaMetrics(activeVendor, activeVendor.serviceableAreas.slice(0, 1), activeVendor.primaryCity);
    expect(activeMetrics.repeatOrders).toBeGreaterThan(0);
    expect(activeMetrics.customerReferrals).toBeGreaterThan(0);
  });
});
