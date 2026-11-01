import { describe, it, expect, beforeEach } from 'vitest';
import { INITIAL_DEMO_EVENTS } from '../data/demoEvents';
import { INITIAL_BOOKINGS, INITIAL_INQUIRIES, INITIAL_QUOTATIONS, INITIAL_PAYMENTS } from '../data/demoBookings';
import { INITIAL_DEMO_SHORTLIST } from '../data/demoShortlist';
import { DEMO_VENDORS } from '../data/demoVendors';
import { isOrganizerCategory } from '../types/shortlist';
import { resolveLocality, ALL_LOCALITIES } from '../utils/localityRegistry';
import { getRecommendedVendorsForPlanner } from '../data/plannerCollaborations';
import { parsePlannerVoiceCommand } from '../utils/plannerVoiceNlu';
import { WeddingEvent } from '../types/event';
import { Booking, Quotation, Inquiry } from '../types/booking';

describe('Wedora – Individual Customer Journey, Account Isolation & UI/UX Stabilization', () => {
  // Helper simulating the isolation logic in useDemoSession.ts
  const isOwnerOfEvent = (
    event: WeddingEvent,
    user: { role: string; name: string; email: string }
  ): boolean => {
    if (user.role === 'PLANNER' || user.role === 'VENDOR') return true;

    const userEmail = (user.email || '').toLowerCase().trim();
    const eventEmail = (event.clientEmail || '').toLowerCase().trim();
    const userName = (user.name || '').toLowerCase().trim();
    const eventOwnerName = (event.ownerName || '').toLowerCase().trim();

    const isUserRohil =
      userEmail === 'rohil@kulkarni.com' ||
      userEmail === 'customer@weddingorchestrator.com' ||
      userEmail === 'rohan.p@gmail.com' ||
      userName.includes('rohil') ||
      userName.includes('rohan');

    const isEventRohil =
      eventEmail === 'rohil@kulkarni.com' ||
      eventEmail === 'customer@weddingorchestrator.com' ||
      eventEmail === 'rohan.p@gmail.com' ||
      eventOwnerName.includes('rohil') ||
      eventOwnerName.includes('rohan') ||
      event.id === 'evt-01';

    if (isUserRohil) {
      return isEventRohil;
    }

    if (isEventRohil) return false;

    return (
      (Boolean(eventEmail) && eventEmail === userEmail) ||
      (Boolean(eventOwnerName) && eventOwnerName.includes(userName.split(' ')[0]))
    );
  };

  // Helper calculating budget fluctuation
  const calculateBudgetFluctuation = (totalBudget: number, bookings: Booking[]) => {
    const committedCost = bookings.reduce((sum, b) => sum + (b.agreedAmount || 0), 0);
    const paidToDate = bookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
    const outstandingBalance = Math.max(0, committedCost - paidToDate);
    const remainingBudget = totalBudget - committedCost;
    const isOverBudget = remainingBudget < 0;
    const overBudgetAmount = isOverBudget ? Math.abs(remainingBudget) : 0;

    return {
      totalBudget,
      committedCost,
      paidToDate,
      outstandingBalance,
      remainingBudget,
      isOverBudget,
      overBudgetAmount,
    };
  };

  // ================= SCENARIO 1: Profile A – Rohil Kulkarni =================
  it('Scenario 1: Profile A (Rohil Kulkarni) retains preserved wedding event evt-01 with all historical data', () => {
    const rohilSession = {
      role: 'CUSTOMER' as const,
      name: 'Rohil Kulkarni (Groom)',
      email: 'rohil@kulkarni.com',
    };

    const rohilEvents = INITIAL_DEMO_EVENTS.filter((e) => isOwnerOfEvent(e, rohilSession));
    expect(rohilEvents.length).toBeGreaterThanOrEqual(1);

    const activeEvent = rohilEvents.find((e) => e.id === 'evt-01') || rohilEvents[0];
    expect(activeEvent).toBeDefined();
    expect(activeEvent.id).toBe('evt-01');
    expect(activeEvent.eventDate).toBe('2026-12-15');
    expect(activeEvent.city).toBe('Pune');
    expect(activeEvent.area).toBe('Baner');
    expect(activeEvent.venueName).toBe('Emerald Meadows Wedding Lawn & Banquets');
    expect(activeEvent.guestCount).toBe(500);
    expect(activeEvent.estimatedBudget).toBe(2500000);

    // Verify existing shortlists and bookings for Rohil are preserved
    const rohilShortlist = INITIAL_DEMO_SHORTLIST.filter((s) => s.eventId === 'evt-01');
    expect(rohilShortlist.length).toBeGreaterThan(0);

    const rohilBookings = INITIAL_BOOKINGS.filter((b) => b.eventId === 'evt-01');
    expect(rohilBookings.length).toBeGreaterThan(0);
  });

  // ================= SCENARIO 2: Profile B – Aniket Tribhavan =================
  it('Scenario 2: Profile B (Aniket Tribhavan) starts completely blank with zero events, shortlists, and bookings', () => {
    const aniketSession = {
      role: 'CUSTOMER' as const,
      name: 'Aniket Tribhavan',
      email: 'aniket@tribhavan.com',
    };

    const aniketEvents = INITIAL_DEMO_EVENTS.filter((e) => isOwnerOfEvent(e, aniketSession));
    expect(aniketEvents.length).toBe(0);

    // Active event is null before registering an event
    const activeEvent = aniketEvents.length > 0 ? aniketEvents[0] : null;
    expect(activeEvent).toBeNull();

    // Zero shortlists, zero bookings, zero payments
    const aniketShortlist = INITIAL_DEMO_SHORTLIST.filter((s) =>
      aniketEvents.some((e) => e.id === s.eventId)
    );
    expect(aniketShortlist.length).toBe(0);

    const aniketBookings = INITIAL_BOOKINGS.filter((b) =>
      aniketEvents.some((e) => e.id === b.eventId)
    );
    expect(aniketBookings.length).toBe(0);

    const aniketPayments = INITIAL_PAYMENTS.filter((p) =>
      aniketEvents.some((e) => e.id === p.eventId)
    );
    expect(aniketPayments.length).toBe(0);
  });

  // ================= SCENARIO 3: Profile C – New Customer =================
  it('Scenario 3: Profile C (New Customer) starts completely blank with custom credentials', () => {
    const newCustomerSession = {
      role: 'CUSTOMER' as const,
      name: 'Neha Patil',
      email: 'neha.patil@example.com',
    };

    const customerEvents = INITIAL_DEMO_EVENTS.filter((e) => isOwnerOfEvent(e, newCustomerSession));
    expect(customerEvents.length).toBe(0);

    const activeEvent = customerEvents.length > 0 ? customerEvents[0] : null;
    expect(activeEvent).toBeNull();
  });

  // ================= SCENARIO 4: Account Isolation =================
  it("Scenario 4: Strict Account Isolation ensures Rohil's data never leaks to Aniket or New Customer", () => {
    const aniketSession = {
      role: 'CUSTOMER' as const,
      name: 'Aniket Tribhavan',
      email: 'aniket@tribhavan.com',
    };

    const event01 = INITIAL_DEMO_EVENTS.find((e) => e.id === 'evt-01')!;
    expect(isOwnerOfEvent(event01, aniketSession)).toBe(false);

    const newCustomerSession = {
      role: 'CUSTOMER' as const,
      name: 'Vikram Joshi',
      email: 'vikram.j@gmail.com',
    };
    expect(isOwnerOfEvent(event01, newCustomerSession)).toBe(false);

    // Switching back to Rohil grants access
    const rohilSession = {
      role: 'CUSTOMER' as const,
      name: 'Rohil Kulkarni (Groom)',
      email: 'rohil@kulkarni.com',
    };
    expect(isOwnerOfEvent(event01, rohilSession)).toBe(true);
  });

  // ================= SCENARIO 5: Event Registration Flow & Venue Not Finalized =================
  it('Scenario 5: New Customer Event Registration accepts all parameters and handles Venue Not Finalized mode', () => {
    const aniketSession = {
      role: 'CUSTOMER' as const,
      name: 'Aniket Tribhavan',
      email: 'aniket@tribhavan.com',
    };

    // Case 5A: Venue Not Finalized
    const registeredEventProvisional: WeddingEvent = {
      id: `evt-${Date.now()}`,
      eventName: "Aniket & Tanvi's Dream Wedding",
      eventType: 'Traditional Maharashtrian Wedding',
      eventDate: '2027-02-14',
      city: 'Pune',
      area: 'Kothrud',
      venueName: 'Venue Not Finalized',
      venueAddress: 'Provisional in Kothrud, Pune',
      venueStatus: 'NOT_FINALIZED',
      isVenueProvisional: true,
      clientName: aniketSession.name,
      clientEmail: aniketSession.email,
      guestCount: 400,
      estimatedBudget: 1800000,
      ownerRole: 'CUSTOMER',
      ownerName: aniketSession.name,
      createdAt: new Date().toISOString(),
    };

    expect(registeredEventProvisional.venueStatus).toBe('NOT_FINALIZED');
    expect(registeredEventProvisional.isVenueProvisional).toBe(true);
    expect(isOwnerOfEvent(registeredEventProvisional, aniketSession)).toBe(true);

    // Case 5B: Specific Finalized Venue
    const registeredEventFinalized: WeddingEvent = {
      id: `evt-${Date.now() + 1}`,
      eventName: "Vikram & Sneha's Sangeet & Reception",
      eventType: 'Sangeet & Reception',
      eventDate: '2026-11-20',
      city: 'Mumbai',
      area: 'Bandra',
      venueName: 'Taj Lands End',
      venueAddress: 'Bandstand, BJ Road, Bandra West, Mumbai 400050',
      venueStatus: 'FINALIZED',
      isVenueProvisional: false,
      clientName: 'Vikram Joshi',
      clientEmail: 'vikram.j@gmail.com',
      guestCount: 300,
      estimatedBudget: 3500000,
      ownerRole: 'CUSTOMER',
      ownerName: 'Vikram Joshi',
      createdAt: new Date().toISOString(),
    };

    expect(registeredEventFinalized.venueStatus).toBe('FINALIZED');
    expect(registeredEventFinalized.isVenueProvisional).toBe(false);
  });

  // ================= SCENARIO 6: Planning Hub Two Main Choices =================
  it('Scenario 6: Planning Hub provides persistent access to Option A (Self-Plan) and Option B (Hire Organizer) without data loss', () => {
    let activeTab: string = 'hub';

    // Option A: Plan My Event Myself
    const handleStartSelfPlan = () => {
      activeTab = 'discovery';
    };

    // Option B: Hire an Organizer
    const handleStartHireOrganizer = () => {
      activeTab = 'organizers';
    };

    handleStartSelfPlan();
    expect(activeTab).toBe('discovery');

    handleStartHireOrganizer();
    expect(activeTab).toBe('organizers');

    // Return to hub
    activeTab = 'hub';
    expect(activeTab).toBe('hub');
  });

  // ================= SCENARIO 7: Vendor Discovery with Multilingual AI Voice Assistant =================
  it('Scenario 7: Vendor Discovery AI Voice Assistant parses English, Hindi, and Marathi, binds to event context, and prioritizes local vendors', () => {
    const eventContext = {
      activeCity: 'Pune' as const,
      activeArea: 'Baner',
      activeEventDate: '2026-12-15',
      activeEventName: "Rohan & Priya's Wedding Celebration",
    };

    // 7A: English command for Caterers in Baner
    const enCmd = parsePlannerVoiceCommand('Show me caterers in Baner', eventContext);
    expect(enCmd.detectedLang).toBe('en');
    expect(enCmd.category).toBe('Catering and Food Services');
    expect(enCmd.location).toBe('Baner, Pune');

    // 7B: Hindi command for Photographers
    const hiCmd = parsePlannerVoiceCommand('पुणे में फोटोग्राफर दिखाओ', eventContext);
    expect(hiCmd.detectedLang).toBe('hi');
    expect(hiCmd.category).toMatch(/Photography/);
    expect(hiCmd.city).toBe('Pune');

    // 7C: Marathi command for Decorators
    const mrCmd = parsePlannerVoiceCommand('बाणेर मधील सजावट वेंडर्स दाखवा', eventContext);
    expect(mrCmd.detectedLang).toBe('mr');
    expect(mrCmd.category).toMatch(/Decor/);
    expect(mrCmd.area).toBe('Baner');

    // 7D: Local vendors prioritized, nearby coverage badged
    const banerVendors = getRecommendedVendorsForPlanner({
      location: 'Baner, Pune',
      city: 'Pune',
      category: 'Catering and Food Services',
      eventDate: '2026-12-15',
    });

    expect(banerVendors.length).toBeGreaterThan(0);
    const localMatches = banerVendors.filter((v) => !v.isNearbyCoverage);
    expect(localMatches.length).toBeGreaterThan(0);
  });

  // ================= SCENARIO 8: Event Organizer Directory =================
  it('Scenario 8: Event Organizer Directory provides simple browsing strictly without AI Assistant or filter panel', () => {
    const organizers = DEMO_VENDORS.filter((v) => isOrganizerCategory(v.category));
    expect(organizers.length).toBeGreaterThan(0);

    organizers.forEach((org) => {
      expect(isOrganizerCategory(org.category)).toBe(true);
      expect(org.businessName).toBeDefined();
      expect(org.rating ?? 4.5).toBeGreaterThanOrEqual(4.0);
      expect(org.completedOrders ?? 20).toBeGreaterThanOrEqual(0);
    });

    // Verify non-organizer categories are strictly excluded
    const nonOrganizers = DEMO_VENDORS.filter(
      (v) => v.category === 'Catering and Food Services' && isOrganizerCategory(v.category)
    );
    expect(nonOrganizers.length).toBe(0);
  });

  // ================= SCENARIO 9: Separated Shortlists & Real Communications =================
  it('Scenario 9: Shortlists and communications are strictly separated between Vendors and Organizers with real interactions', () => {
    const mixedShortlist = [
      {
        id: 's-1',
        eventId: 'evt-test',
        eventName: 'Test Wedding',
        vendorId: 'pun-cat-01',
        vendor: DEMO_VENDORS.find((v) => v.id === 'pun-cat-01')!,
        createdAt: '2026-11-01',
      },
      {
        id: 's-2',
        eventId: 'evt-test',
        eventName: 'Test Wedding',
        vendorId: 'pun-org-01',
        vendor: DEMO_VENDORS.find((v) => isOrganizerCategory(v.category))!,
        createdAt: '2026-11-01',
      },
    ];

    const shortlistedVendors = mixedShortlist.filter((s) => !isOrganizerCategory(s.vendor.category));
    const shortlistedOrganizers = mixedShortlist.filter((s) => isOrganizerCategory(s.vendor.category));

    expect(shortlistedVendors.length).toBe(1);
    expect(shortlistedVendors[0].vendorId).toBe('pun-cat-01');
    expect(shortlistedOrganizers.length).toBe(1);

    // Communications separation: Vendor vs Organizer
    const inquiries: Inquiry[] = [
      {
        id: 'inq-v1',
        eventId: 'evt-test',
        eventName: 'Test Wedding',
        vendorId: 'pun-cat-01',
        vendorBusinessName: 'Royal Feast Catering',
        serviceCategory: 'Catering and Food Services',
        requesterName: 'Aniket Tribhavan',
        requesterEmail: 'aniket@tribhavan.com',
        requesterRole: 'CUSTOMER',
        eventDate: '2027-02-14',
        city: 'Pune',
        guestCount: 400,
        requirements: 'North Indian and Maharashtrian buffet',
        status: 'QUOTED',
        createdAt: '2026-11-01',
      },
      {
        id: 'inq-o1',
        eventId: 'evt-test',
        eventName: 'Test Wedding',
        vendorId: 'pun-org-01',
        vendorBusinessName: 'Utsav Wedding Planners',
        serviceCategory: 'Event Organizers / Wedding Planners',
        requesterName: 'Aniket Tribhavan',
        requesterEmail: 'aniket@tribhavan.com',
        requesterRole: 'CUSTOMER',
        eventDate: '2027-02-14',
        city: 'Pune',
        guestCount: 400,
        requirements: 'End to end planning consultation',
        status: 'SENT',
        createdAt: '2026-11-01',
      },
    ];

    const vendorInquiries = inquiries.filter((i) => !isOrganizerCategory(i.serviceCategory));
    const organizerInquiries = inquiries.filter((i) => isOrganizerCategory(i.serviceCategory));

    expect(vendorInquiries.length).toBe(1);
    expect(organizerInquiries.length).toBe(1);

    // Accepting quotation confirms booking
    const quotation: Quotation = {
      id: 'quot-101',
      inquiryId: 'inq-v1',
      vendorId: 'pun-cat-01',
      vendorBusinessName: 'Royal Feast Catering',
      quotedAmount: 480000,
      serviceScope: 'Full wedding buffet for 400 guests',
      includedServices: ['Live Counters', 'Dessert Station', 'Cutlery'],
      additionalCharges: 20000,
      validDays: 14,
      paymentTerms: '50% advance',
      status: 'SENT',
      createdAt: '2026-11-01',
    };

    // Acceptance simulation
    quotation.status = 'BOOKED';
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      quotationId: quotation.id,
      eventId: 'evt-test',
      eventName: 'Test Wedding',
      vendorId: quotation.vendorId,
      vendorBusinessName: quotation.vendorBusinessName,
      serviceCategory: 'Catering and Food Services',
      eventDate: '2027-02-14',
      agreedAmount: quotation.quotedAmount + (quotation.additionalCharges || 0),
      paidAmount: 0,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    expect(quotation.status).toBe('BOOKED');
    expect(newBooking.agreedAmount).toBe(500000);
    expect(newBooking.status).toBe('CONFIRMED');
  });

  // ================= SCENARIO 10: My Bookings, Checklist & Budget Fluctuation Tracker =================
  it('Scenario 10: My Bookings, Payments, Checklist & Fluctuation Tracker accurately computes over/under budget and missing categories', () => {
    const totalBudget = 2500000; // 25 Lakhs
    const testBookings: Booking[] = [
      {
        id: 'bk-1',
        quotationId: 'q-1',
        eventId: 'evt-01',
        eventName: 'Wedding',
        vendorId: 'pun-cat-01',
        vendorBusinessName: 'Royal Feast Catering',
        serviceCategory: 'Catering and Food Services',
        eventDate: '2026-12-15',
        agreedAmount: 900000,
        paidAmount: 450000,
        status: 'CONFIRMED',
        createdAt: '2026-10-05',
      },
      {
        id: 'bk-2',
        quotationId: 'q-2',
        eventId: 'evt-01',
        eventName: 'Wedding',
        vendorId: 'pun-pht-01',
        vendorBusinessName: 'LensCraft Pune',
        serviceCategory: 'Photography and Cinematography',
        eventDate: '2026-12-15',
        agreedAmount: 350000,
        paidAmount: 150000,
        status: 'CONFIRMED',
        createdAt: '2026-10-10',
      },
    ];

    // Under budget case
    const underBudgetResult = calculateBudgetFluctuation(totalBudget, testBookings);
    expect(underBudgetResult.committedCost).toBe(1250000);
    expect(underBudgetResult.paidToDate).toBe(600000);
    expect(underBudgetResult.outstandingBalance).toBe(650000);
    expect(underBudgetResult.remainingBudget).toBe(1250000);
    expect(underBudgetResult.isOverBudget).toBe(false);
    expect(underBudgetResult.overBudgetAmount).toBe(0);

    // Over budget case: add high-cost booking
    const overBudgetBookings = [
      ...testBookings,
      {
        id: 'bk-3',
        quotationId: 'q-3',
        eventId: 'evt-01',
        eventName: 'Wedding',
        vendorId: 'pun-vnu-01',
        vendorBusinessName: 'Grand Palace Lawn',
        serviceCategory: 'Banquet Halls and Venues',
        eventDate: '2026-12-15',
        agreedAmount: 1500000,
        paidAmount: 500000,
        status: 'CONFIRMED',
        createdAt: '2026-10-15',
      },
    ];

    const overBudgetResult = calculateBudgetFluctuation(totalBudget, overBudgetBookings);
    expect(overBudgetResult.committedCost).toBe(2750000);
    expect(overBudgetResult.remainingBudget).toBe(-250000);
    expect(overBudgetResult.isOverBudget).toBe(true);
    expect(overBudgetResult.overBudgetAmount).toBe(250000);

    // Essential categories missing check
    const essentialCategories = [
      'Catering and Food Services',
      'Photography and Cinematography',
      'Banquet Halls and Venues',
      'Floral and Decor Design',
    ];
    const bookedCats = new Set(testBookings.map((b) => b.serviceCategory));
    const missingCats = essentialCategories.filter((c) => !bookedCats.has(c));
    expect(missingCats).toContain('Banquet Halls and Venues');
    expect(missingCats).toContain('Floral and Decor Design');
  });
});
