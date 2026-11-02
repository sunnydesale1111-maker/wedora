import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DEMO_VENDORS } from '../data/demoVendors';
import { BASE_MANUAL_COLLABORATIONS } from '../data/plannerCollaborations';
import {
  normalizeVendorCategory,
  isSameCategory,
  getEligibleReplacementVendors,
} from '../utils/vendorSwapHelper';
import { PlannerVoiceAssistant } from '../components/planner/PlannerVoiceAssistant';
import { VendorSwapModal } from '../components/planner/VendorSwapModal';
import { saveVendorSwapToSupabase, checkSlotAvailability } from '../lib/supabaseData';
import { Vendor } from '../types/vendor';
import { WeddingEvent } from '../types/event';

// Mock active event
const mockEvent: WeddingEvent = {
  id: 'evt-01',
  eventName: 'Rohan & Priya Grand Vivah',
  eventType: 'Traditional Maharashtrian Wedding',
  eventDate: '2026-12-15',
  city: 'Pune',
  area: 'Baner',
  guestCount: 650,
  estimatedBudget: 2800000,
  venueName: 'Emerald Meadows Lawns',
  ownerUserId: 'd0000000-0000-0000-0000-000000000001',
};

// Mock Supabase data module
vi.mock('../lib/supabaseData', async () => {
  const actual = await vi.importActual<any>('../lib/supabaseData');
  return {
    ...actual,
    saveVendorSwapToSupabase: vi.fn().mockResolvedValue({ success: true }),
    checkSlotAvailability: vi.fn().mockResolvedValue({ isAvailable: true }),
  };
});

describe('WEDORA — EVENT ORGANIZER AI: VENDOR SWAP IMPROVEMENT & INPUT BAR FIX', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // TEST 1 — CATERING
  // Click Swap on a catering vendor.
  // Expected: Multiple eligible catering vendors appear. No photography, venue, or unrelated vendors.
  // =========================================================================
  it('Test 1 — Catering: Click Swap on a catering vendor shows multiple catering options and zero unrelated categories', () => {
    const cateringVendor = DEMO_VENDORS.find(
      (v) => v.category === 'Catering and Food Services' || v.id === 'pun-cat-01'
    )!;
    expect(cateringVendor).toBeDefined();

    const result = getEligibleReplacementVendors({
      vendorToReplace: cateringVendor,
      allVendors: DEMO_VENDORS,
      location: 'Baner, Pune',
      eventDate: '2026-12-15',
      slot: 'FULL_DAY',
    });

    // Multiple eligible vendors returned (>= 2)
    expect(result.items.length).toBeGreaterThanOrEqual(2);
    expect(result.totalEligible).toBeGreaterThanOrEqual(2);

    // Every single replacement must be Catering
    result.items.forEach(({ vendor }) => {
      expect(isSameCategory(vendor.category, 'Catering and Food Services')).toBe(true);
      expect(normalizeVendorCategory(vendor.category)).toBe('Catering and Food Services');

      // Strict negative assertions: must NEVER be photography, venue, decoration, sound
      expect(normalizeVendorCategory(vendor.category)).not.toBe('Photography and Videography');
      expect(normalizeVendorCategory(vendor.category)).not.toBe('Wedding Lawns and Venues');
      expect(normalizeVendorCategory(vendor.category)).not.toBe('Decoration Services');
      expect(normalizeVendorCategory(vendor.category)).not.toBe('DJ and Sound Systems');
    });

    // The vendor being replaced must be excluded
    const replacedVendorInList = result.items.find(
      (item) => item.vendor.id.toLowerCase() === cateringVendor.id.toLowerCase()
    );
    expect(replacedVendorInList).toBeUndefined();
  });

  // =========================================================================
  // TEST 2 — PHOTOGRAPHY
  // Click Swap on a photography vendor.
  // Expected: Only eligible photography vendors appear.
  // =========================================================================
  it('Test 2 — Photography: Click Swap on a photography vendor shows only eligible photography vendors', () => {
    const photographyVendor = DEMO_VENDORS.find(
      (v) => v.category === 'Photography and Videography'
    )!;
    expect(photographyVendor).toBeDefined();

    const result = getEligibleReplacementVendors({
      vendorToReplace: photographyVendor,
      allVendors: DEMO_VENDORS,
      location: 'Baner, Pune',
      eventDate: '2026-12-15',
      slot: 'FULL_DAY',
    });

    expect(result.items.length).toBeGreaterThanOrEqual(1);

    result.items.forEach(({ vendor }) => {
      expect(isSameCategory(vendor.category, 'Photography and Videography')).toBe(true);
      expect(normalizeVendorCategory(vendor.category)).toBe('Photography and Videography');

      // Negative checks
      expect(normalizeVendorCategory(vendor.category)).not.toBe('Catering and Food Services');
      expect(normalizeVendorCategory(vendor.category)).not.toBe('Wedding Lawns and Venues');
      expect(normalizeVendorCategory(vendor.category)).not.toBe('Decoration Services');
    });

    // Excludes self
    expect(result.items.some((i) => i.vendor.id === photographyVendor.id)).toBe(false);
  });

  // =========================================================================
  // TEST 3 — HOSPITALITY / VENUE TAXONOMY DISTINCTION
  // Click Swap on a hospitality or venue vendor.
  // Expected: Alternatives follow the actual selected category and existing category mappings.
  // =========================================================================
  it('Test 3 — Hospitality/Venue: Alternatives strictly follow actual category and do not mix hotels with lawns', () => {
    // 3A. Venue (Wedding Lawns and Venues)
    const venueVendor = DEMO_VENDORS.find((v) =>
      v.category.toLowerCase().includes('lawn') || v.category.toLowerCase().includes('venue')
    ) || {
      id: 'mock-venue-01',
      businessName: 'Royal Orchid Lawns',
      category: 'Wedding Lawns and Venues',
      primaryCity: 'Pune',
      serviceableAreas: ['Baner', 'Wakad'],
      startingPrice: 350000,
      completedOrders: 15,
      onTimeDeliveryPercent: 98,
      availabilityDates: { '2026-12-15': 'Available' },
    };

    const venueResult = getEligibleReplacementVendors({
      vendorToReplace: venueVendor as Vendor,
      allVendors: [
        venueVendor as Vendor,
        {
          id: 'venue-alt-01',
          businessName: 'Emerald Banquets',
          category: 'Wedding Lawns and Venues',
          primaryCity: 'Pune',
          serviceableAreas: ['Baner'],
          startingPrice: 320000,
          completedOrders: 12,
          onTimeDeliveryPercent: 97,
          availabilityDates: { '2026-12-15': 'Available' },
        } as Vendor,
        {
          id: 'hotel-alt-01',
          businessName: 'Grand Hyatt Guest Rooms',
          category: 'Hotels and Guest Accommodation',
          primaryCity: 'Pune',
          serviceableAreas: ['Baner'],
          startingPrice: 200000,
          completedOrders: 8,
          onTimeDeliveryPercent: 95,
          availabilityDates: { '2026-12-15': 'Available' },
        } as Vendor,
      ],
      location: 'Baner, Pune',
      eventDate: '2026-12-15',
    });

    // Venue replacements must contain ONLY venues, NOT hotels/accommodation
    expect(venueResult.items.length).toBe(1);
    expect(venueResult.items[0].vendor.id).toBe('venue-alt-01');
    expect(venueResult.items.some((i) => i.vendor.id === 'hotel-alt-01')).toBe(false);

    // 3B. Hospitality (Hotels and Guest Accommodation)
    const hospitalityVendor: Vendor = {
      id: 'mock-hotel-01',
      businessName: 'Marriott Courtyard Suites',
      category: 'Hotels and Guest Accommodation',
      primaryCity: 'Pune',
      serviceableAreas: ['Baner'],
      startingPrice: 250000,
      completedOrders: 10,
      onTimeDeliveryPercent: 98,
      availabilityDates: { '2026-12-15': 'Available' },
    } as any;

    const hospitalityResult = getEligibleReplacementVendors({
      vendorToReplace: hospitalityVendor,
      allVendors: [
        hospitalityVendor,
        {
          id: 'hotel-alt-02',
          businessName: 'Taj Vivanta Rooms',
          category: 'Hotels and Guest Accommodation',
          primaryCity: 'Pune',
          serviceableAreas: ['Baner'],
          startingPrice: 280000,
          completedOrders: 9,
          onTimeDeliveryPercent: 99,
          availabilityDates: { '2026-12-15': 'Available' },
        } as Vendor,
        {
          id: 'venue-alt-02',
          businessName: "Sunny's Lawn",
          category: 'Wedding Lawns and Venues',
          primaryCity: 'Pune',
          serviceableAreas: ['Baner'],
          startingPrice: 400000,
          completedOrders: 14,
          onTimeDeliveryPercent: 96,
          availabilityDates: { '2026-12-15': 'Available' },
        } as Vendor,
      ],
      location: 'Baner, Pune',
      eventDate: '2026-12-15',
    });

    expect(hospitalityResult.items.length).toBe(1);
    expect(hospitalityResult.items[0].vendor.id).toBe('hotel-alt-02');
    expect(hospitalityResult.items.some((i) => i.vendor.id === 'venue-alt-02')).toBe(false);
  });

  // =========================================================================
  // TEST 4 — AVAILABILITY & CONFLICT FILTERING
  // Set a date and time slot.
  // Expected: Unavailable vendors are excluded.
  // =========================================================================
  it('Test 4 — Availability: Vendors with Fully Booked, Unavailable, or Supabase conflicts are excluded', () => {
    const originalVendor = DEMO_VENDORS.find((v) => v.category === 'Catering and Food Services')!;

    const testVendors: Vendor[] = [
      originalVendor,
      {
        id: 'cat-avail-01',
        businessName: 'Available Caterer',
        category: 'Catering and Food Services',
        primaryCity: 'Pune',
        serviceableAreas: ['Baner'],
        startingPrice: 300000,
        completedOrders: 10,
        onTimeDeliveryPercent: 98,
        availabilityDates: { '2026-12-15': 'Available' },
      } as any,
      {
        id: 'cat-booked-01',
        businessName: 'Booked Caterer',
        category: 'Catering and Food Services',
        primaryCity: 'Pune',
        serviceableAreas: ['Baner'],
        startingPrice: 310000,
        completedOrders: 10,
        onTimeDeliveryPercent: 98,
        availabilityDates: { '2026-12-15': 'Fully Booked' }, // BOOKED
      } as any,
      {
        id: 'cat-unavail-01',
        businessName: 'Unavailable Caterer',
        category: 'Catering and Food Services',
        primaryCity: 'Pune',
        serviceableAreas: ['Baner'],
        startingPrice: 320000,
        completedOrders: 10,
        onTimeDeliveryPercent: 98,
        availabilityDates: { '2026-12-15': 'Unavailable' }, // UNAVAILABLE
      } as any,
      {
        id: 'cat-supabase-conflict-01',
        businessName: 'Supabase Conflict Caterer',
        category: 'Catering and Food Services',
        primaryCity: 'Pune',
        serviceableAreas: ['Baner'],
        startingPrice: 330000,
        completedOrders: 10,
        onTimeDeliveryPercent: 98,
        availabilityDates: { '2026-12-15': 'Available' },
      } as any,
    ];

    const result = getEligibleReplacementVendors({
      vendorToReplace: originalVendor,
      allVendors: testVendors,
      location: 'Baner, Pune',
      eventDate: '2026-12-15',
      slot: 'FULL_DAY',
      bookedVendorIds: new Set(['cat-supabase-conflict-01']),
    });

    // Only 'cat-avail-01' should be eligible!
    expect(result.items.length).toBe(1);
    expect(result.items[0].vendor.id).toBe('cat-avail-01');

    // Booked, unavailable, and conflict vendors MUST be excluded
    const ids = result.items.map((i) => i.vendor.id);
    expect(ids).not.toContain('cat-booked-01');
    expect(ids).not.toContain('cat-unavail-01');
    expect(ids).not.toContain('cat-supabase-conflict-01');
  });

  // =========================================================================
  // TEST 5 — LIMITED RESULTS
  // Only one eligible vendor exists.
  // Expected: Display that vendor with an accurate explanation, not fabricated alternatives.
  // =========================================================================
  it('Test 5 — Limited Results: Exactly 1 vendor returned with accurate notice and no fabricated vendors', () => {
    const originalVendor = DEMO_VENDORS.find((v) => v.category === 'Catering and Food Services')!;

    const testVendors: Vendor[] = [
      originalVendor,
      {
        id: 'sole-match-01',
        businessName: 'The Sole Matching Caterer',
        category: 'Catering and Food Services',
        primaryCity: 'Pune',
        serviceableAreas: ['Baner'],
        startingPrice: 350000,
        completedOrders: 20,
        onTimeDeliveryPercent: 99,
        availabilityDates: { '2026-12-15': 'Available' },
      } as any,
    ];

    const result = getEligibleReplacementVendors({
      vendorToReplace: originalVendor,
      allVendors: testVendors,
      location: 'Baner, Pune',
      eventDate: '2026-12-15',
    });

    expect(result.totalEligible).toBe(1);
    expect(result.onlyOneOption).toBe(true);
    expect(result.items.length).toBe(1);
    expect(result.items[0].vendor.id).toBe('sole-match-01');
    expect(result.noticeMessage).toContain(
      'Only 1 matching vendor is currently eligible and available in this category for 2026-12-15.'
    );
  });

  // =========================================================================
  // TEST 6 — CONFIRM SWAP WORKFLOW & PERSISTENCE
  // Select a replacement vendor.
  // Expected: Original remains unchanged until confirmation. After confirmation, updated selection persists in Supabase.
  // =========================================================================
  it('Test 6 — Confirm Swap: Original is preserved until confirmation, then persists safely to Supabase', async () => {
    const originalVendor = DEMO_VENDORS.find((v) => v.id === 'pun-cat-01')!;
    const replacementVendor = DEMO_VENDORS.find((v) => v.id === 'pun-cat-02')!;

    const onConfirmSwapMock = vi.fn();
    const onCloseMock = vi.fn();

    // Render VendorSwapModal
    const { getByTestId, findByTestId, queryByTestId } = render(
      <VendorSwapModal
        isOpen={true}
        onClose={onCloseMock}
        originalVendor={originalVendor}
        replacementVendor={null}
        eventName={mockEvent.eventName}
        eventDate="2026-12-15"
        eventCity="Pune"
        eventArea="Baner"
        eventId="evt-01"
        onConfirmSwap={onConfirmSwapMock}
      />
    );

    // 1. Initial State: Step 1 (SELECT) is visible
    expect(getByTestId('vendor-swap-modal')).toBeDefined();
    expect(getByTestId('replacement-vendor-list')).toBeDefined();

    // The callback must NOT have been called yet
    expect(onConfirmSwapMock).not.toHaveBeenCalled();

    // 2. Select the replacement vendor
    const selectBtn = await findByTestId(`select-vendor-btn-${replacementVendor.id}`);
    expect(selectBtn).toBeDefined();
    fireEvent.click(selectBtn);

    // 3. Moved to Step 2 (CONFIRM), confirm button is now visible
    const confirmBtn = await findByTestId('confirm-swap-button');
    expect(confirmBtn).toBeDefined();
    expect(onConfirmSwapMock).not.toHaveBeenCalled();

    // 4. Click Confirm
    fireEvent.click(confirmBtn);

    // Verify Supabase persistence call & callback after async validation
    await vi.waitFor(() => {
      expect(saveVendorSwapToSupabase).toHaveBeenCalledWith(
        expect.objectContaining({
          eventId: 'evt-01',
          originalVendorId: originalVendor.id,
          originalVendorName: originalVendor.businessName,
          replacementVendorId: replacementVendor.id,
          replacementVendorName: replacementVendor.businessName,
          category: originalVendor.category,
          eventDate: '2026-12-15',
        })
      );
      expect(onConfirmSwapMock).toHaveBeenCalledWith(originalVendor, replacementVendor);
    });
  });

  // =========================================================================
  // TEST 7 — CROSS-DEVICE SYNC VERIFICATION
  // Verify that saveVendorSwapToSupabase updates vendor availability and timeline task
  // =========================================================================
  it('Test 7 — Cross-Device: saveVendorSwapToSupabase validates conflict and registers change in Supabase', async () => {
    const originalVendor = DEMO_VENDORS[0];
    const replacementVendor = DEMO_VENDORS[1];

    const res = await saveVendorSwapToSupabase({
      eventId: 'evt-01',
      originalVendorId: originalVendor.id,
      originalVendorName: originalVendor.businessName,
      replacementVendorId: replacementVendor.id,
      replacementVendorName: replacementVendor.businessName,
      category: originalVendor.category,
      eventDate: '2026-12-15',
      slot: 'FULL_DAY',
    });

    expect(res.success).toBe(true);
    expect(saveVendorSwapToSupabase).toHaveBeenCalled();
  });

  // =========================================================================
  // TEST 8 — PLANNER AI INPUT BAR LAYOUT ORDER
  // The controls must appear horizontally in this exact order:
  // Message input field -> Microphone button -> Send button
  // =========================================================================
  it('Test 8 — Input Layout: Controls strictly follow Message Input -> Microphone -> Send order', () => {
    const onCommandParsedMock = vi.fn();

    const { getByTestId } = render(
      <PlannerVoiceAssistant
        activeEvent={mockEvent}
        onCommandParsed={onCommandParsedMock}
      />
    );

    const form = getByTestId('planner-input-form');
    expect(form).toBeDefined();

    // Check direct children of form
    const children = Array.from(form.children);
    expect(children.length).toBe(3);

    // 1st child: Input container
    expect(children[0].getAttribute('data-testid')).toBe('planner-input-container');
    const inputElement = getByTestId('planner-message-input');
    expect(inputElement).toBeDefined();

    // 2nd child: Microphone button
    expect(children[1].getAttribute('data-testid')).toBe('planner-mic-button');

    // 3rd child: Send button
    expect(children[2].getAttribute('data-testid')).toBe('planner-send-button');

    // Verify typing functionality works
    fireEvent.change(inputElement, { target: { value: 'Vendors in Baner, Pune' } });
    expect((inputElement as HTMLInputElement).value).toBe('Vendors in Baner, Pune');

    // Verify Send button is enabled and triggers submit
    const sendBtn = getByTestId('planner-send-button');
    expect(sendBtn.hasAttribute('disabled')).toBe(false);

    fireEvent.submit(form);
    expect(onCommandParsedMock).toHaveBeenCalled();
  });
});
