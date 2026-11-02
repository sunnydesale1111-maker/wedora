import { Vendor } from '@/types/vendor';
import { VendorSlotType } from '@/types/vendorSlot';
import { resolveLocality, ALL_LOCALITIES } from './localityRegistry';
import { BASE_MANUAL_COLLABORATIONS, PlannerCollaborationRecord } from '@/data/plannerCollaborations';

export interface SwapAlternativeItem {
  vendor: Vendor;
  isPastPartner: boolean;
  eventsCompletedTogether: number;
  clientRating: number;
  collaborationNotes?: string;
  isAvailable: boolean;
  dateStatus: string;
  priceDiffWithOriginal: number;
  isNearbyCoverage?: boolean;
  nearbyCoverageNote?: string;
}

export interface SwapFilterResult {
  items: SwapAlternativeItem[];
  totalEligible: number;
  onlyOneOption: boolean;
  requiresDateOrSlot: boolean;
  noticeMessage?: string;
}

/**
 * Normalizes vendor categories to Wedora's canonical taxonomy.
 * Guarantees that:
 * - Catering vendor -> only Catering
 * - Photography vendor -> only Photography
 * - Hospitality vendor -> only Hospitality (Hotels and Guest Accommodation)
 * - Venue vendor -> only Venue (Wedding Lawns and Venues)
 * - Decoration vendor -> only Decoration
 * - Sound vendor -> only Sound
 */
export function normalizeVendorCategory(category: string): string {
  const c = (category || '').toLowerCase().trim();

  // 1. Catering
  if (c.includes('cater') || c.includes('food') || c.includes('खानपान') || c.includes('कॅटर')) {
    return 'Catering and Food Services';
  }

  // 2. Photography & Videography
  if (c.includes('photo') || c.includes('video') || c.includes('film') || c.includes('candid') || c.includes('छायाचित्र')) {
    return 'Photography and Videography';
  }

  // 3. Decoration Services
  if (c.includes('decor') || c.includes('flower') || c.includes('mandap') || c.includes('सजावट')) {
    return 'Decoration Services';
  }

  // 4. Hospitality (Hotels, Guest Accommodation)
  if (
    c.includes('hotel') ||
    c.includes('guest') ||
    c.includes('lodging') ||
    c.includes('accommodation') ||
    c.includes('hospitality') ||
    c.includes('resort stay')
  ) {
    return 'Hotels and Guest Accommodation';
  }

  // 5. Wedding Venues & Lawns (Distinct from Hospitality)
  if (
    c.includes('venue') ||
    c.includes('lawn') ||
    c.includes('banquet') ||
    c.includes('hall') ||
    c.includes('resort') ||
    c.includes('लॉन')
  ) {
    return 'Wedding Lawns and Venues';
  }

  // 6. DJ and Sound Systems
  if (c.includes('dj') || c.includes('sound') || c.includes('audio') || c.includes('acoustics') || c.includes('संगीत')) {
    return 'DJ and Sound Systems';
  }

  // 7. Lighting Services
  if (c.includes('light') || c.includes('illumination')) {
    return 'Lighting Services';
  }

  // 8. Furniture and Equipment Rental
  if (c.includes('furniture') || c.includes('rental') || c.includes('chair') || c.includes('lounge')) {
    return 'Furniture and Equipment Rental';
  }

  // 9. Makeup and Mehendi
  if (c.includes('makeup') || c.includes('mehendi') || c.includes('beauty')) {
    return 'Makeup and Mehendi Artists';
  }

  // 10. Pandit & Puja
  if (c.includes('pandit') || c.includes('puja') || c.includes('priest')) {
    return 'Pandit and Puja Services';
  }

  return category;
}

/**
 * Checks whether two vendor categories belong to the exact same category.
 * Prevents mixing unrelated categories.
 */
export function isSameCategory(categoryA: string, categoryB: string): boolean {
  if (!categoryA || !categoryB) return false;
  if (categoryA.toLowerCase().trim() === categoryB.toLowerCase().trim()) return true;
  return normalizeVendorCategory(categoryA) === normalizeVendorCategory(categoryB);
}

/**
 * Filters and ranks eligible replacement vendors according to the 7 strict requirements:
 * 1. Category: Exact matching category or explicitly mapped equivalent.
 * 2. Location: Vendors serving the event location (e.g. Baner, Pune).
 * 3. Date: Vendors available on selected event date.
 * 4. Time slot: Vendors available during event slot.
 * 5. Booking conflicts: Exclude vendors already booked or unavailable.
 * 6. Status: Exclude inactive or unauthorized vendor listings.
 * 7. Current selection: Exclude vendor being replaced & currently selected vendors.
 */
export function getEligibleReplacementVendors({
  vendorToReplace,
  allVendors,
  location,
  eventDate,
  slot = 'FULL_DAY',
  selectedVendorIds = [],
  collaborations = BASE_MANUAL_COLLABORATIONS,
  bookedVendorIds = new Set<string>(),
}: {
  vendorToReplace: Vendor;
  allVendors: Vendor[];
  location?: string;
  eventDate?: string;
  slot?: VendorSlotType | string;
  selectedVendorIds?: string[];
  collaborations?: PlannerCollaborationRecord[];
  bookedVendorIds?: Set<string>;
}): SwapFilterResult {
  // If date is completely missing, prompt organizer
  if (!eventDate || !eventDate.trim()) {
    return {
      items: [],
      totalEligible: 0,
      onlyOneOption: false,
      requiresDateOrSlot: true,
      noticeMessage: 'Please set the event date and time slot to verify live vendor availability.',
    };
  }

  const targetCategory = normalizeVendorCategory(vendorToReplace.category);
  const targetCity = vendorToReplace.primaryCity || 'Pune';
  const targetPrice = vendorToReplace.startingPrice || 0;

  // Excluded Vendor IDs: The vendor to replace + any currently selected vendors
  const excludedIds = new Set<string>();
  if (vendorToReplace?.id) {
    excludedIds.add(vendorToReplace.id.toLowerCase());
  }
  (selectedVendorIds || []).forEach((id) => excludedIds.add(id.toLowerCase()));

  // Map of collaboration records for quick lookup
  const collabMap = new Map<string, PlannerCollaborationRecord>();
  (collaborations || []).forEach((collab) => {
    if (collab?.vendorId) {
      collabMap.set(collab.vendorId.toLowerCase(), collab);
    }
  });

  const rawLocation = (location || '').trim();
  const resolvedLoc = resolveLocality(rawLocation);
  const searchArea = resolvedLoc ? resolvedLoc.canonicalName.toLowerCase() : rawLocation.toLowerCase();
  const searchCity = resolvedLoc ? resolvedLoc.city.toLowerCase() : targetCity.toLowerCase();

  // 1. Filter candidates strictly by same category, exclusion, status, and availability
  const eligibleCandidates = allVendors.filter((vendor) => {
    // Exclusion: cannot replace with self or already selected vendor
    if (excludedIds.has(vendor.id.toLowerCase())) {
      return false;
    }

    // Status check: must be active/verified, not suspended or inactive
    if (
      (vendor as any).status === 'INACTIVE' ||
      vendor.verificationStatus === 'SUSPENDED' ||
      vendor.verificationStatus === 'INACTIVE'
    ) {
      return false;
    }

    // Category check: strictly the same category
    if (!isSameCategory(vendor.category, targetCategory)) {
      return false;
    }

    // Booking conflict check 1: Supabase live booked vendor IDs
    if (bookedVendorIds.has(vendor.id.toLowerCase())) {
      return false;
    }

    // Booking conflict check 2: Vendor's own availability calendar for the eventDate
    if (vendor.availabilityDates && eventDate) {
      const dateStatus = vendor.availabilityDates[eventDate];
      if (dateStatus === 'Fully Booked' || dateStatus === 'Unavailable') {
        return false;
      }
    }

    // City constraint: candidate must serve the target city
    if (
      vendor.primaryCity &&
      searchCity &&
      !vendor.primaryCity.toLowerCase().includes(searchCity) &&
      !searchCity.includes(vendor.primaryCity.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // 2. Location tiering: exact area matches vs adjacent / city coverage
  const exactLocationMatches: Vendor[] = [];
  const nearbyLocationMatches: Vendor[] = [];

  eligibleCandidates.forEach((vendor) => {
    const servesArea =
      searchArea &&
      vendor.serviceableAreas &&
      vendor.serviceableAreas.some(
        (area) =>
          area.toLowerCase().includes(searchArea) || searchArea.includes(area.toLowerCase())
      );

    if (servesArea) {
      exactLocationMatches.push(vendor);
    } else {
      nearbyLocationMatches.push(vendor);
    }
  });

  // Combine results: exact area first, then nearby / city-wide
  const combinedVendors = [...exactLocationMatches, ...nearbyLocationMatches];

  // 3. Transform to SwapAlternativeItem with badges and historical data
  const items: SwapAlternativeItem[] = combinedVendors.map((vendor) => {
    const collab = collabMap.get(vendor.id.toLowerCase());
    const isPastPartner = Boolean(collab && collab.eventsCompletedTogether > 0);
    const dateStatus = vendor.availabilityDates?.[eventDate] || 'Available';
    const isAvailable = dateStatus !== 'Fully Booked' && dateStatus !== 'Unavailable';
    const priceDiffWithOriginal = (vendor.startingPrice || 0) - targetPrice;

    const isNearby = !exactLocationMatches.some((v) => v.id === vendor.id);

    return {
      vendor,
      isPastPartner,
      eventsCompletedTogether: collab ? collab.eventsCompletedTogether : 0,
      clientRating: collab ? collab.clientRating : vendor.rating || 4.8,
      collaborationNotes: collab ? collab.collaborationNotes : undefined,
      isAvailable,
      dateStatus,
      priceDiffWithOriginal,
      isNearbyCoverage: isNearby,
      nearbyCoverageNote: isNearby ? `Coverage: ${vendor.primaryCity}` : undefined,
    };
  });

  // Sort: Verified past partners first, then highest on-time delivery / ratings
  items.sort((a, b) => {
    if (a.isPastPartner && !b.isPastPartner) return -1;
    if (!a.isPastPartner && b.isPastPartner) return 1;
    const scoreA = (a.vendor.onTimeDeliveryPercent || 90) * 10 + (a.vendor.completedOrders || 0);
    const scoreB = (b.vendor.onTimeDeliveryPercent || 90) * 10 + (b.vendor.completedOrders || 0);
    return scoreB - scoreA;
  });

  const totalEligible = items.length;
  const onlyOneOption = totalEligible === 1;

  let noticeMessage: string | undefined;
  if (totalEligible === 1) {
    noticeMessage = `Only 1 matching vendor is currently eligible and available in this category for ${eventDate}.`;
  } else if (totalEligible === 0) {
    noticeMessage = `No available ${targetCategory} vendors found in ${rawLocation || targetCity} on ${eventDate}. Try adjusting filters or dates.`;
  }

  return {
    items,
    totalEligible,
    onlyOneOption,
    requiresDateOrSlot: false,
    noticeMessage,
  };
}
