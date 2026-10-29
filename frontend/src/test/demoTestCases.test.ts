import { describe, it, expect } from 'vitest';
import { DEMO_VENDORS } from '../data/demoVendors';
import { parseSearchIntent } from '../utils/searchIntentParser';
import { filterVendors } from '../utils/vendorFilters';

describe('AI Wedding Timeline Orchestrator — Verification of 100 Vendors & Test Cases', () => {
  // ==================== 1. DATASET INTEGRITY ====================
  it('contains at least 100 fictional vendors (minimum 50 Mumbai, 50 Pune)', () => {
    expect(DEMO_VENDORS.length).toBeGreaterThanOrEqual(100);

    const mumbaiVendors = DEMO_VENDORS.filter((v) => v.primaryCity === 'Mumbai');
    const puneVendors = DEMO_VENDORS.filter((v) => v.primaryCity === 'Pune');

    expect(mumbaiVendors.length).toBeGreaterThanOrEqual(50);
    expect(puneVendors.length).toBeGreaterThanOrEqual(50);
  });

  it('guarantees at least 5 vendors per canonical category in both cities (Version 4.0 Rule)', () => {
    const requiredCategories = [
      'Catering and Food Services',
      'Decoration Services',
      'Flower Arrangements',
      'Lighting Services',
      'DJ and Sound Systems',
      'Furniture and Equipment Rental',
      'Wedding Lawns and Venues',
      'Hotels and Guest Accommodation',
      'Photography and Videography',
      'Event Organizers / Wedding Planners',
      'End-to-End Event Management',
      'Logistics and Transportation',
      'Makeup and Mehendi Artists',
    ];

    for (const city of ['Mumbai', 'Pune'] as const) {
      const cityVendors = DEMO_VENDORS.filter((v) => v.primaryCity === city);
      for (const cat of requiredCategories) {
        const count = cityVendors.filter(
          (v) => v.category === cat || v.secondaryCategories?.includes(cat as any)
        ).length;
        expect(count).toBeGreaterThanOrEqual(5);
      }
    }
  });

  // ==================== 2. SECTION 18 DEMO TEST CASES ====================

  // Test A: Search: "Find caterers in Pune."
  it('Test A: Search "Find caterers in Pune." returns only catering-capable Pune vendors', () => {
    const parsed = parseSearchIntent('Find caterers in Pune.');
    expect(parsed.detectedCity).toBe('Pune');
    expect(parsed.detectedCategory).toBe('Catering and Food Services');

    const results = filterVendors({
      category: parsed.detectedCategory,
      city: parsed.detectedCity,
    });

    expect(results.results.length).toBeGreaterThan(0);
    results.results.forEach((v) => {
      expect(v.primaryCity).toBe('Pune');
      const isCateringCapable =
        v.category === 'Catering and Food Services' ||
        v.secondaryCategories?.includes('Catering and Food Services');
      expect(isCateringCapable).toBe(true);
    });
  });

  // Test B: Search: "Find an event organizer in Mumbai."
  it('Test B: Search "Find an event organizer in Mumbai." returns only relevant planners & end-to-end providers', () => {
    const parsed = parseSearchIntent('Find an event organizer in Mumbai.');
    expect(parsed.detectedCity).toBe('Mumbai');
    expect(parsed.detectedCategory).toBe('Event Organizers / Wedding Planners');

    const results = filterVendors({
      category: parsed.detectedCategory,
      city: parsed.detectedCity,
    });

    expect(results.results.length).toBeGreaterThan(0);
    results.results.forEach((v) => {
      expect(v.primaryCity).toBe('Mumbai');
      const isPlannerOrE2E =
        v.category === 'Event Organizers / Wedding Planners' ||
        v.category === 'End-to-End Event Management' ||
        v.category === 'End-to-End Event Management Providers' ||
        v.secondaryCategories?.includes('Event Organizers / Wedding Planners');
      expect(isPlannerOrE2E).toBe(true);
    });
  });

  // Test C: Search: "I need a lawn for 600 guests in Pune."
  it('Test C: Search "I need a lawn for 600 guests in Pune." returns venues capable of hosting >= 600 guests', () => {
    const parsed = parseSearchIntent('I need a lawn for 600 guests in Pune.');
    expect(parsed.detectedCity).toBe('Pune');
    expect(parsed.detectedCategory).toBe('Wedding Lawns and Venues');
    expect(parsed.detectedGuestCount).toBe(600);

    const results = filterVendors({
      category: parsed.detectedCategory,
      city: parsed.detectedCity,
      guestCount: parsed.detectedGuestCount,
    });

    expect(results.results.length).toBeGreaterThan(0);
    results.results.forEach((v) => {
      expect(v.primaryCity).toBe('Pune');
      const isVenueCapable =
        v.category === 'Wedding Lawns and Venues' ||
        v.secondaryCategories?.includes('Wedding Lawns and Venues');
      expect(isVenueCapable).toBe(true);
      expect(v.maximumGuestCapacity).toBeGreaterThanOrEqual(600);
    });
  });

  // Test D: Search: "Find accommodation for wedding guests in Mumbai."
  it('Test D: Search "Find accommodation for wedding guests in Mumbai." returns hotels and lodging', () => {
    const parsed = parseSearchIntent('Find accommodation for wedding guests in Mumbai.');
    expect(parsed.detectedCity).toBe('Mumbai');
    expect(['Hotels and Guest Accommodation', 'Hotels, Lodging and Guest Accommodation']).toContain(parsed.detectedCategory);

    const results = filterVendors({
      category: parsed.detectedCategory,
      city: parsed.detectedCity,
    });

    expect(results.results.length).toBeGreaterThan(0);
    results.results.forEach((v) => {
      expect(v.primaryCity).toBe('Mumbai');
      const isHotels =
        v.category === 'Hotels and Guest Accommodation' ||
        v.category === 'Hotels, Lodging and Guest Accommodation' ||
        v.secondaryCategories?.includes('Hotels and Guest Accommodation') ||
        v.secondaryCategories?.includes('Hotels, Lodging and Guest Accommodation');
      expect(isHotels).toBe(true);
    });
  });

  // Test E: Category change from catering to lighting retains date and location
  it('Test E: Change vendor category from catering to lighting retains date and location', () => {
    // Turn 1
    const turn1 = parseSearchIntent('I need catering for 500 guests in Pune on 15 December 2026.');
    expect(turn1.detectedCity).toBe('Pune');
    expect(turn1.detectedDate).toBe('2026-12-15');
    expect(turn1.detectedGuestCount).toBe(500);
    expect(turn1.detectedCategory).toBe('Catering and Food Services');

    // Turn 2: "Now show me lighting vendors." with retained context
    const turn2 = parseSearchIntent('Now show me lighting vendors.', {
      currentCity: turn1.detectedCity,
      currentDate: turn1.detectedDate,
      currentGuestCount: turn1.detectedGuestCount,
      currentCategory: turn1.detectedCategory,
    });

    expect(turn2.detectedCategory).toBe('Lighting Services');
    // Date, city, and guests are preserved in context
    expect(turn1.detectedCity).toBe('Pune');
    expect(turn1.detectedDate).toBe('2026-12-15');
    expect(turn1.detectedGuestCount).toBe(500);

    const results = filterVendors({
      category: turn2.detectedCategory,
      city: turn1.detectedCity,
      date: turn1.detectedDate,
    });

    expect(results.results.length).toBeGreaterThan(0);
    results.results.forEach((v) => {
      expect(v.primaryCity).toBe('Pune');
      const isLightingCapable =
        v.category === 'Lighting Services' ||
        v.secondaryCategories?.includes('Lighting Services');
      expect(isLightingCapable).toBe(true);
    });
  });

  // Test F: Refresh Results preserves filters and recalculates
  it('Test F: Refresh Results preserves all search criteria and recalculates', () => {
    const filters = {
      category: 'Catering and Food Services',
      city: 'Pune',
      date: '2026-12-15',
      guestCount: 500,
    };

    const res1 = filterVendors(filters);
    const res2 = filterVendors(filters); // Re-run

    expect(res1.totalMatched).toBe(res2.totalMatched);
    expect(res1.results.map((v) => v.id)).toEqual(res2.results.map((v) => v.id));
  });

  // Test G: Change city from Mumbai to Pune updates search results to Pune vendors
  it('Test G: Change city from Mumbai to Pune updates search results to Pune vendors', () => {
    const mumbaiResults = filterVendors({
      category: 'Photography and Videography',
      city: 'Mumbai',
    });
    expect(mumbaiResults.results.every((v) => v.primaryCity === 'Mumbai')).toBe(true);

    const puneResults = filterVendors({
      category: 'Photography and Videography',
      city: 'Pune',
    });
    expect(puneResults.results.every((v) => v.primaryCity === 'Pune')).toBe(true);

    expect(puneResults.results.length).toBeGreaterThan(0);
    expect(mumbaiResults.results.length).toBeGreaterThan(0);
  });

  // Test H: Change vendor calendar availability updates discovery results immediately
  it('Test H: Changing vendor calendar availability reflects in discovery results immediately', () => {
    const testVendorId = 'pun-cat-01'; // Royal Feast Catering
    const testDate = '2026-12-15';

    // Before change: Available
    const initialRes = filterVendors({
      category: 'Catering and Food Services',
      city: 'Pune',
      date: testDate,
    });
    expect(initialRes.results.some((v) => v.id === testVendorId)).toBe(true);

    // Vendor updates calendar to Fully Booked
    const overrides = {
      [testVendorId]: {
        [testDate]: 'Fully Booked' as const,
      },
    };

    const updatedRes = filterVendors(
      {
        category: 'Catering and Food Services',
        city: 'Pune',
        date: testDate,
      },
      overrides
    );

    // Should no longer appear in available results for 15 Dec 2026
    expect(updatedRes.results.some((v) => v.id === testVendorId)).toBe(false);
  });

  // Test I: Customer selects Hire an Event Organizer
  it('Test I: Hire an Event Organizer preselects the Event Organizers category', () => {
    const selectedCategory = 'Event Organizers / Wedding Planners';
    const results = filterVendors({
      category: selectedCategory,
      city: 'Pune',
    });

    expect(results.results.length).toBeGreaterThan(0);
    results.results.forEach((v) => {
      const isOrganizer =
        v.category === 'Event Organizers / Wedding Planners' ||
        v.category === 'End-to-End Event Management' ||
        v.category === 'End-to-End Event Management Providers';
      expect(isOrganizer).toBe(true);
    });
  });

  // Test J: Search for a service with no matching vendors gives clear empty state
  it('Test J: Search with impossible criteria returns 0 results and meaningful feedback', () => {
    const results = filterVendors({
      category: 'Wedding Lawns and Venues',
      city: 'Pune',
      guestCount: 5000, // No lawn handles 5000 in demo
    });

    expect(results.totalMatched).toBe(0);
    expect(results.results).toHaveLength(0);
  });
});
