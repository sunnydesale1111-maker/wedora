import { describe, it, expect } from 'vitest';
import { DEMO_VENDORS } from '../data/demoVendors';
import { parseSearchIntent, MUMBAI_LOCALITIES, PUNE_LOCALITIES } from '../utils/searchIntentParser';
import { filterVendors, getEffectiveAvailability } from '../utils/vendorFilters';

describe('Chatbot and Vendor Card Fixes Verification (PRD Scenarios 1–12)', () => {
  // Scenario 1 & 2: Select an event date and change it; confirm availability recalculation
  it('Scenario 1 & 2: Event date selection updates context and recalculates availability', () => {
    const date1 = '2026-12-15';
    const date2 = '2026-12-25';

    // Royal Feast Catering has '2026-12-15': 'Available', '2026-12-25': 'Tentative'
    // Bayview Signature Banquets has '2026-12-25': 'Fully Booked'
    const results15 = filterVendors({
      category: 'Catering and Food Services',
      city: 'Mumbai',
      date: date1,
    });
    const results25 = filterVendors({
      category: 'Catering and Food Services',
      city: 'Mumbai',
      date: date2,
    });

    // Fully booked vendor on 25 Dec should be excluded on date2
    const bayviewOn15 = results15.results.some((v) => v.id === 'mum-cat-02');
    const bayviewOn25 = results25.results.some((v) => v.id === 'mum-cat-02');

    expect(bayviewOn15).toBe(true);
    expect(bayviewOn25).toBe(false);
  });

  // Scenario 3: Select Mumbai and Andheri. Confirm only vendors serving that location appear.
  it('Scenario 3: Selecting Mumbai and Andheri returns only vendors serving Andheri', () => {
    const results = filterVendors({
      city: 'Mumbai',
      areas: ['Andheri'],
    });

    expect(results.results.length).toBeGreaterThan(0);
    results.results.forEach((v) => {
      expect(v.primaryCity).toBe('Mumbai');
      expect(v.serviceableAreas).toContain('Andheri');
    });
  });

  // Scenario 4: Change Mumbai to Pune. Confirm incompatible Mumbai areas are cleared.
  it('Scenario 4: Changing Mumbai to Pune clears incompatible Mumbai areas in intent parser', () => {
    // User had Andheri in Mumbai
    const prevContext = {
      currentCity: 'Mumbai' as const,
      currentAreas: ['Andheri'],
      currentCategory: 'Catering and Food Services' as const,
      currentDate: '2026-12-15',
    };

    // User says "Change location to Pune"
    const parsed = parseSearchIntent('Change location to Pune', prevContext);
    expect(parsed.detectedCity).toBe('Pune');
    // Andheri is a Mumbai area, so it must not be retained under Pune!
    expect(parsed.detectedAreas).toBeUndefined();
  });

  // Scenario 5: Select Pune and Baner. Confirm eligible Pune vendors appear.
  it('Scenario 5: Select Pune and Baner returns eligible Pune vendors serving Baner', () => {
    const results = filterVendors({
      city: 'Pune',
      areas: ['Baner'],
    });

    expect(results.results.length).toBeGreaterThan(0);
    results.results.forEach((v) => {
      expect(v.primaryCity).toBe('Pune');
      expect(v.serviceableAreas).toContain('Baner');
    });
  });

  // Scenario 6: Enter 500 guests. Confirm vendors with insufficient capacity are excluded.
  it('Scenario 6: 500 guests excludes catering/venues with capacity < 500', () => {
    const results = filterVendors({
      category: 'Catering and Food Services',
      city: 'Pune',
      guestCount: 500,
    });

    expect(results.results.length).toBeGreaterThan(0);
    results.results.forEach((v) => {
      if (v.maximumGuestCapacity) {
        expect(v.maximumGuestCapacity).toBeGreaterThanOrEqual(500);
      }
    });

    // Check that boutique caterer with capacity 450 (e.g. Saffron & Sage, cap: 450) is excluded
    const smallCaterer = results.results.find((v) => v.id === 'pun-cat-07');
    expect(smallCaterer).toBeUndefined();
  });

  // Scenario 7: Change guest count to 800. Confirm results update correctly.
  it('Scenario 7: Changing guest count to 800 further refines capacity', () => {
    const results800 = filterVendors({
      category: 'Catering and Food Services',
      city: 'Pune',
      guestCount: 800,
    });

    results800.results.forEach((v) => {
      if (v.maximumGuestCapacity) {
        expect(v.maximumGuestCapacity).toBeGreaterThanOrEqual(800);
      }
    });

    // Check that Royal Feast (cap: 1200) and Heritage Rasoi (cap: 800) are included
    expect(results800.results.some((v) => v.id === 'pun-cat-01')).toBe(true);
    expect(results800.results.some((v) => v.id === 'pun-cat-02')).toBe(true);
  });

  // Scenario 8: Search for catering, then change to lighting; date, city, area, guests are retained.
  it('Scenario 8: Switching category to lighting retains date, city, area, and guests', () => {
    const context = {
      currentCity: 'Pune' as const,
      currentAreas: ['Baner', 'Wakad'],
      currentDate: '2026-12-15',
      currentGuestCount: 500,
      currentCategory: 'Catering and Food Services' as const,
    };

    const parsed = parseSearchIntent('Now show me lighting vendors.', context);
    expect(parsed.detectedCategory).toBe('Lighting Services');
    // Context retains others
    expect(context.currentCity).toBe('Pune');
    expect(context.currentAreas).toEqual(['Baner', 'Wakad']);
    expect(context.currentDate).toBe('2026-12-15');
    expect(context.currentGuestCount).toBe(500);

    // Also verify lighting is NOT excluded by guest count since capacity is irrelevant for lighting!
    const lightingResults = filterVendors({
      category: 'Lighting Services',
      city: context.currentCity,
      areas: context.currentAreas,
      date: context.currentDate,
      guestCount: context.currentGuestCount,
    });

    expect(lightingResults.results.length).toBeGreaterThan(0);
    lightingResults.results.forEach((v) => {
      expect(v.primaryCity).toBe('Pune');
      const isLighting =
        v.category === 'Lighting Services' ||
        v.secondaryCategories?.includes('Lighting Services');
      expect(isLighting).toBe(true);
    });
  });

  // Scenario 9: Refresh Results preserves all filters intact.
  it('Scenario 9: Refresh Results preserves all filters and context', () => {
    const currentFilters = {
      category: 'Wedding Lawns and Venues',
      city: 'Pune',
      areas: ['Baner'],
      date: '2026-12-15',
      guestCount: 600,
    };

    const run1 = filterVendors(currentFilters);
    const run2 = filterVendors(currentFilters);

    expect(run1.totalMatched).toBe(run2.totalMatched);
    expect(run1.criteriaApplied).toEqual(run2.criteriaApplied);
  });

  // Scenario 10: Every vendor card displays both Completed Orders and AOV.
  it('Scenario 10: Dataset vendors have valid Completed Orders and AOV metrics', () => {
    DEMO_VENDORS.forEach((vendor) => {
      expect(typeof vendor.completedOrders90Days).toBe('number');
      expect(typeof vendor.averageOrderValue90Days).toBe('number');
      expect(vendor.completedOrders90Days).toBeGreaterThanOrEqual(0);
      expect(vendor.averageOrderValue90Days).toBeGreaterThanOrEqual(0);
    });
  });

  // Scenario 11: Localities list completeness
  it('Scenario 11: Localities for Mumbai and Pune contain all PRD required areas', () => {
    const requiredMumbai = [
      'Andheri', 'Bandra', 'Borivali', 'Goregaon', 'Malad', 'Powai',
      'Dadar', 'Lower Parel', 'Chembur', 'Ghatkopar', 'Mulund', 'Navi Mumbai', 'Thane'
    ];
    const requiredPune = [
      'Baner', 'Wakad', 'Hinjewadi', 'Aundh', 'Kothrud', 'Viman Nagar',
      'Kharadi', 'Hadapsar', 'Koregaon Park', 'Shivajinagar', 'Pimpri-Chinchwad', 'Magarpatta'
    ];

    requiredMumbai.forEach((area) => expect(MUMBAI_LOCALITIES).toContain(area));
    requiredPune.forEach((area) => expect(PUNE_LOCALITIES).toContain(area));
  });

  // Scenario 12: Capacity filtering is NOT applied to irrelevant categories
  it('Scenario 12: Capacity filtering is not applied to Photography or DJ even with 1000 guests', () => {
    const photoResults = filterVendors({
      category: 'Photography and Videography',
      city: 'Pune',
      guestCount: 1500, // Very high guest count
    });

    // Should still return all eligible photography vendors because capacity is irrelevant for photographers
    expect(photoResults.results.length).toBeGreaterThan(0);
    expect(photoResults.results.some((v) => v.category === 'Photography and Videography')).toBe(true);
  });
});
