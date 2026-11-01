import { Vendor } from '../types/vendor';
import { DEMO_VENDORS } from './demoVendors';
import { resolveLocality, ALL_LOCALITIES } from '../utils/localityRegistry';

export interface PlannerCollaborationRecord {
  id: string;
  plannerEmail: string;
  vendorId: string;
  vendorBusinessName: string;
  category: string;
  city: 'Pune' | 'Mumbai';
  area: string; // e.g. "Baner"
  locationLabel: string; // e.g. "Baner, Pune"
  eventsCompletedTogether: number;
  lastEventDate: string; // e.g. "2026-09-15"
  clientRating: number; // e.g. 4.9
  onTimeDeliveryRate: number; // 0-100%
  serviceQualityScore: number; // 0-100%
  collaborationNotes: string;
  verifiedPastEvents: string[];
  eventId?: string;
  orderRef?: string;
}

export interface PopulatedCollaboration {
  record: PlannerCollaborationRecord;
  vendor: Vendor;
}

/**
 * Base manual collaborations for Aditi Sharma (Lead Event Planner)
 */
const BASE_MANUAL_COLLABORATIONS: PlannerCollaborationRecord[] = [
  // 1. Royal Feast Catering (Baner, Pune)
  {
    id: 'collab-pun-cat-01-baner',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'pun-cat-01',
    vendorBusinessName: 'Royal Feast Catering & Hospitality',
    category: 'Catering and Food Services',
    city: 'Pune',
    area: 'Baner',
    locationLabel: 'Baner, Pune',
    eventsCompletedTogether: 8,
    lastEventDate: '2026-09-12',
    clientRating: 4.9,
    onTimeDeliveryRate: 98,
    serviceQualityScore: 99,
    collaborationNotes: 'Exceptional consistency across 8 large banquets. Signature live chaat stations and spotless royal silver service.',
    verifiedPastEvents: [
      'Sharma & Singhania Reception (Baner, Sep 2026)',
      'Deshmukh Sangeet & Dinner (Aundh, Jul 2026)',
      'Kulkarni Royal Wedding (Baner, Dec 2025)',
    ],
    eventId: 'evt-hist-baner-cat-01',
    orderRef: 'ORD-BAN-CAT-101',
  },
  // 2. ShutterShree Candid Wedding Films (Baner, Pune)
  {
    id: 'collab-pun-pho-01-baner',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'pun-pho-01',
    vendorBusinessName: 'ShutterShree Candid Wedding Films',
    category: 'Photography and Videography',
    city: 'Pune',
    area: 'Baner',
    locationLabel: 'Baner, Pune',
    eventsCompletedTogether: 6,
    lastEventDate: '2026-08-20',
    clientRating: 4.9,
    onTimeDeliveryRate: 97,
    serviceQualityScore: 98,
    collaborationNotes: 'Outstanding cinematic 4K drone videography and unobtrusive candid photography. Same-day teaser reels delivered on time.',
    verifiedPastEvents: [
      'Patil & Joshi Wedding Celebration (Baner, Aug 2026)',
      'Mehta Intimate Sundowner (Kothrud, May 2026)',
    ],
    eventId: 'evt-hist-baner-pho-01',
    orderRef: 'ORD-BAN-PHO-102',
  },
  // 3. Elegance Floral & Mandap Decor (Baner, Pune)
  {
    id: 'collab-pun-dec-01-baner',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'pun-dec-01',
    vendorBusinessName: 'Elegance Floral & Mandap Decor',
    category: 'Decoration Services',
    city: 'Pune',
    area: 'Baner',
    locationLabel: 'Baner, Pune',
    eventsCompletedTogether: 7,
    lastEventDate: '2026-09-04',
    clientRating: 4.8,
    onTimeDeliveryRate: 96,
    serviceQualityScore: 97,
    collaborationNotes: 'Bespoke royal mandap architecture and fresh floral entryway styling. Always ready 90 minutes before ceremony.',
    verifiedPastEvents: [
      'Singhania Grand Mandap (Baner, Sep 2026)',
      'Jadhav Traditional Vivah (Shivajinagar, Jan 2026)',
    ],
    eventId: 'evt-hist-baner-dec-01',
    orderRef: 'ORD-BAN-DEC-103',
  },
  // 4. Emerald Meadows Wedding Lawn & Banquets (Baner, Pune)
  {
    id: 'collab-pun-ven-01-baner',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'pun-ven-01',
    vendorBusinessName: 'Emerald Meadows Wedding Lawn & Banquets',
    category: 'Wedding Lawns and Venues',
    city: 'Pune',
    area: 'Baner',
    locationLabel: 'Baner, Pune',
    eventsCompletedTogether: 5,
    lastEventDate: '2026-09-10',
    clientRating: 4.9,
    onTimeDeliveryRate: 99,
    serviceQualityScore: 98,
    collaborationNotes: 'Premier luxury banquet hall and manicured lawns accommodating up to 1200 guests with ample valet parking.',
    verifiedPastEvents: [
      'Rohan & Priya Pre-Wedding Gala (Baner, Sep 2026)',
      'Choudhary Silver Jubilee Celebration (Baner, Feb 2026)',
    ],
    eventId: 'evt-hist-baner-ven-01',
    orderRef: 'ORD-BAN-VEN-104',
  },
  // 5. Maharaja Royal Banquet Caterers (Bandra, Mumbai)
  {
    id: 'collab-mum-cat-01-bandra',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'mum-cat-01',
    vendorBusinessName: 'Maharaja Royal Banquet Caterers',
    category: 'Catering and Food Services',
    city: 'Mumbai',
    area: 'Bandra',
    locationLabel: 'Bandra, Mumbai',
    eventsCompletedTogether: 9,
    lastEventDate: '2026-08-15',
    clientRating: 4.9,
    onTimeDeliveryRate: 98,
    serviceQualityScore: 99,
    collaborationNotes: 'Grand Gujarati and North Indian spread with 12 live counters and flawless silver service.',
    verifiedPastEvents: [
      'Merchant-Shah Wedding (Bandra, Aug 2026)',
      'Godrej Reception (Lower Parel, Apr 2026)',
    ],
    eventId: 'evt-hist-bandra-cat-01',
    orderRef: 'ORD-BAN-CAT-201',
  },
  // 6. Candid Moments & Cinematic Films (Bandra, Mumbai)
  {
    id: 'collab-mum-pho-01-bandra',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'mum-pho-01',
    vendorBusinessName: 'Candid Moments & Cinematic Films',
    category: 'Photography and Videography',
    city: 'Mumbai',
    area: 'Bandra',
    locationLabel: 'Bandra, Mumbai',
    eventsCompletedTogether: 5,
    lastEventDate: '2026-07-28',
    clientRating: 4.8,
    onTimeDeliveryRate: 96,
    serviceQualityScore: 97,
    collaborationNotes: 'Celebrity-grade wedding photography and cinematic 4K drone cinematography with fast edits.',
    verifiedPastEvents: [
      'Kapoor Sunset Vows (Bandra, Jul 2026)',
      'Malhotra Ring Ceremony (Juhu, Mar 2026)',
    ],
    eventId: 'evt-hist-bandra-pho-01',
    orderRef: 'ORD-BAN-PHO-202',
  },
  // 7. Pushpa Vatika Floral Creations (Thane, Mumbai)
  {
    id: 'collab-mum-dec-01-thane',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'mum-dec-01',
    vendorBusinessName: 'Pushpa Vatika Floral Creations',
    category: 'Decoration Services',
    city: 'Mumbai',
    area: 'Thane',
    locationLabel: 'Thane, Mumbai',
    eventsCompletedTogether: 6,
    lastEventDate: '2026-08-10',
    clientRating: 4.8,
    onTimeDeliveryRate: 97,
    serviceQualityScore: 97,
    collaborationNotes: 'Traditional floral canopies and grand mandap themes executed reliably across multiple Thane banquets.',
    verifiedPastEvents: [
      'Thane Club Grand Reception (Thane, Aug 2026)',
      'Tandel Vivah Samarambh (Thane, May 2026)',
    ],
    eventId: 'evt-hist-thane-dec-01',
    orderRef: 'ORD-THA-DEC-203',
  },
  // 8. Maharaja Royal Banquet Caterers (Kalyan, Mumbai)
  {
    id: 'collab-mum-cat-01-kalyan',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'mum-cat-01',
    vendorBusinessName: 'Maharaja Royal Banquet Caterers',
    category: 'Catering and Food Services',
    city: 'Mumbai',
    area: 'Kalyan',
    locationLabel: 'Kalyan, Mumbai',
    eventsCompletedTogether: 4,
    lastEventDate: '2026-06-22',
    clientRating: 4.9,
    onTimeDeliveryRate: 98,
    serviceQualityScore: 99,
    collaborationNotes: 'Reliable catering logistics for Kalyan destination weddings with full on-site kitchen setup.',
    verifiedPastEvents: [
      'Bhoir Sangeet & Reception (Kalyan, Jun 2026)',
      'Thakur Royal Vivah (Kalyan, Feb 2026)',
    ],
    eventId: 'evt-hist-kalyan-cat-01',
    orderRef: 'ORD-KAL-CAT-204',
  },
  // 9. SoundWave Pro DJs (Wakad, Pune)
  {
    id: 'collab-pun-dj-01-wakad',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'pun-dj-01',
    vendorBusinessName: 'SoundWave Pro DJs & Live Sound',
    category: 'DJ and Sound Systems',
    city: 'Pune',
    area: 'Wakad',
    locationLabel: 'Wakad, Pune',
    eventsCompletedTogether: 7,
    lastEventDate: '2026-09-02',
    clientRating: 4.9,
    onTimeDeliveryRate: 99,
    serviceQualityScore: 98,
    collaborationNotes: 'Phenomenal sangeet dance tracks and crystal-clear acoustic line arrays with zero feedback.',
    verifiedPastEvents: [
      'Chavan Sangeet Night (Wakad, Sep 2026)',
      'Tech Mahindra Annual Gala (Hinjawadi, Jul 2026)',
    ],
    eventId: 'evt-hist-wakad-dj-01',
    orderRef: 'ORD-WAK-DJ-105',
  },
  // 10. ShutterShree Candid Wedding Films (Wakad, Pune)
  {
    id: 'collab-pun-pho-01-wakad',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'pun-pho-01',
    vendorBusinessName: 'ShutterShree Candid Wedding Films',
    category: 'Photography and Videography',
    city: 'Pune',
    area: 'Wakad',
    locationLabel: 'Wakad, Pune',
    eventsCompletedTogether: 5,
    lastEventDate: '2026-08-14',
    clientRating: 4.9,
    onTimeDeliveryRate: 97,
    serviceQualityScore: 98,
    collaborationNotes: 'Timely delivery of high-resolution photo albums and emotive cinematic highlights.',
    verifiedPastEvents: [
      'Gaikwad Ring Ceremony (Wakad, Aug 2026)',
    ],
    eventId: 'evt-hist-wakad-pho-01',
    orderRef: 'ORD-WAK-PHO-106',
  },
  // 11. Royal Feast Catering (Wakad, Pune)
  {
    id: 'collab-pun-cat-01-wakad',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'pun-cat-01',
    vendorBusinessName: 'Royal Feast Catering & Hospitality',
    category: 'Catering and Food Services',
    city: 'Pune',
    area: 'Wakad',
    locationLabel: 'Wakad, Pune',
    eventsCompletedTogether: 4,
    lastEventDate: '2026-07-19',
    clientRating: 4.9,
    onTimeDeliveryRate: 98,
    serviceQualityScore: 99,
    collaborationNotes: 'Consistent high-standard catering for PCMC and Wakad private banquets.',
    verifiedPastEvents: [
      'More Vivah Samarambh (Wakad, Jul 2026)',
    ],
    eventId: 'evt-hist-wakad-cat-01',
    orderRef: 'ORD-WAK-CAT-107',
  },
  // 12. Heritage Rasoi Traditional Caterers (Kothrud, Pune)
  {
    id: 'collab-pun-cat-02-kothrud',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'pun-cat-02',
    vendorBusinessName: 'Heritage Rasoi Traditional Caterers',
    category: 'Catering and Food Services',
    city: 'Pune',
    area: 'Kothrud',
    locationLabel: 'Kothrud, Pune',
    eventsCompletedTogether: 6,
    lastEventDate: '2026-08-28',
    clientRating: 4.8,
    onTimeDeliveryRate: 97,
    serviceQualityScore: 98,
    collaborationNotes: 'Authentic Maharashtrian wedding feast with puran poli live counters and traditional service.',
    verifiedPastEvents: [
      'Karan & Meera Engagement Banquet (Kothrud, Aug 2026)',
    ],
    eventId: 'evt-hist-kothrud-cat-01',
    orderRef: 'ORD-KOT-CAT-108',
  },
  // 13. Saffron & Sage Gourmet Caterers (Hadapsar, Pune)
  {
    id: 'collab-pun-cat-07-hadapsar',
    plannerEmail: 'planner@weddingorchestrator.com',
    vendorId: 'pun-cat-07',
    vendorBusinessName: 'Saffron & Sage Gourmet Caterers',
    category: 'Catering and Food Services',
    city: 'Pune',
    area: 'Hadapsar',
    locationLabel: 'Hadapsar, Pune',
    eventsCompletedTogether: 4,
    lastEventDate: '2026-08-10',
    clientRating: 4.9,
    onTimeDeliveryRate: 97,
    serviceQualityScore: 98,
    collaborationNotes: 'Contemporary live culinary stations and artisanal desserts for IT corridor celebrations.',
    verifiedPastEvents: [
      'Mehta Pre-Wedding Gala at Magarpatta Club (Hadapsar, Aug 2026)',
    ],
    eventId: 'evt-hist-hadapsar-cat-01',
    orderRef: 'ORD-HAD-CAT-109',
  },
];

const TARGET_PRIORITY_CATEGORIES = [
  'Catering and Food Services',
  'Photography and Videography',
  'Decoration Services',
  'Wedding Lawns and Venues',
  'DJ and Sound Systems',
  'Makeup and Mehendi Artists',
  'Lighting Services',
  'Flower Arrangements',
];

/**
 * Builds verified collaboration history for all 76 localities across Pune and Mumbai.
 * Ensures demo Professional Event Planner Aditi Sharma has 4-5 distinct vendor collaborations
 * from different event categories for every targeted locality.
 */
function generateCollaborationsForAllLocalities(
  manualCollabs: PlannerCollaborationRecord[]
): PlannerCollaborationRecord[] {
  const allRecords: PlannerCollaborationRecord[] = [...manualCollabs];
  const PLANNER_EMAIL = 'planner@weddingorchestrator.com';

  ALL_LOCALITIES.forEach((loc) => {
    const locLower = loc.canonicalName.toLowerCase();
    // Count existing for this locality
    const existingForLoc = allRecords.filter(
      (r) => r.area.toLowerCase() === locLower
    );
    const existingVendorIds = new Set(existingForLoc.map((r) => r.vendorId));
    const existingCats = new Set(existingForLoc.map((r) => r.category));

    // Find established vendors serving this locality
    const servingVendors = DEMO_VENDORS.filter(
      (v) =>
        !v.isNewToPlatform &&
        v.serviceableAreas &&
        v.serviceableAreas.includes(loc.canonicalName)
    );

    // Pick vendors to reach at least 5 distinct vendors across distinct categories
    for (const targetCat of TARGET_PRIORITY_CATEGORIES) {
      if (existingForLoc.length >= 5 && existingCats.size >= 4) {
        break;
      }
      if (existingCats.has(targetCat)) continue;

      const candidate = servingVendors.find(
        (v) => v.category === targetCat && !existingVendorIds.has(v.id)
      );

      if (candidate) {
        existingVendorIds.add(candidate.id);
        existingCats.add(candidate.category);

        const seed = loc.canonicalName.length + candidate.id.length;
        const locSlug = loc.canonicalName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const catCode = candidate.category.slice(0, 3).toUpperCase();
        const recordId = `collab-${locSlug}-${candidate.id}`;

        const newRecord: PlannerCollaborationRecord = {
          id: recordId,
          plannerEmail: PLANNER_EMAIL,
          vendorId: candidate.id,
          vendorBusinessName: candidate.businessName,
          category: candidate.category,
          city: loc.city,
          area: loc.canonicalName,
          locationLabel: `${loc.canonicalName}, ${loc.city}`,
          eventsCompletedTogether: 4 + (seed % 5),
          lastEventDate: `2026-0${7 + (seed % 3)}-${String(10 + (seed % 15)).padStart(2, '0')}`,
          clientRating: 4.8 + ((seed % 3 === 0) ? 0.1 : 0),
          onTimeDeliveryRate: 96 + (seed % 4),
          serviceQualityScore: 97 + (seed % 3),
          collaborationNotes: `Verified collaboration with ${candidate.businessName} in ${loc.canonicalName}. Punctual, exceptional team coordination and high client ratings.`,
          verifiedPastEvents: [
            `${loc.canonicalName} Grand Celebration (2026)`,
            `${candidate.businessName.split(' ')[0]} ${loc.canonicalName} Gala (2025)`,
          ],
          eventId: `evt-hist-${locSlug}-${catCode.toLowerCase()}`,
          orderRef: `ORD-${loc.canonicalName.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()}-${candidate.id.replace(/[^0-9]/g, '') || '101'}`,
        };

        allRecords.push(newRecord);
        existingForLoc.push(newRecord);
      }
    }

    // Fallback: If still under 5 vendors, pick from any remaining category
    if (existingForLoc.length < 5) {
      for (const candidate of servingVendors) {
        if (existingForLoc.length >= 5) break;
        if (existingVendorIds.has(candidate.id)) continue;

        existingVendorIds.add(candidate.id);
        existingCats.add(candidate.category);

        const seed = loc.canonicalName.length + candidate.id.length;
        const locSlug = loc.canonicalName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const catCode = candidate.category.slice(0, 3).toUpperCase();

        const newRecord: PlannerCollaborationRecord = {
          id: `collab-${locSlug}-${candidate.id}`,
          plannerEmail: PLANNER_EMAIL,
          vendorId: candidate.id,
          vendorBusinessName: candidate.businessName,
          category: candidate.category,
          city: loc.city,
          area: loc.canonicalName,
          locationLabel: `${loc.canonicalName}, ${loc.city}`,
          eventsCompletedTogether: 4 + (seed % 5),
          lastEventDate: `2026-08-${String(10 + (seed % 15)).padStart(2, '0')}`,
          clientRating: 4.8,
          onTimeDeliveryRate: 97,
          serviceQualityScore: 98,
          collaborationNotes: `Consistently reliable partner for ${candidate.category} in ${loc.canonicalName}. Professional coordination and flawless execution.`,
          verifiedPastEvents: [
            `${loc.canonicalName} Wedding Showcase (2026)`,
          ],
          eventId: `evt-hist-${locSlug}-${catCode.toLowerCase()}`,
          orderRef: `ORD-${loc.canonicalName.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()}-${candidate.id.replace(/[^0-9]/g, '') || '201'}`,
        };

        allRecords.push(newRecord);
        existingForLoc.push(newRecord);
      }
    }
  });

  return allRecords;
}

/**
 * Full registry of verified collaborations for Aditi Sharma across all 76 localities.
 */
export const VERIFIED_PLANNER_COLLABORATIONS: PlannerCollaborationRecord[] =
  generateCollaborationsForAllLocalities(BASE_MANUAL_COLLABORATIONS);

/**
 * Retrieves verified historical collaborations for a professional planner.
 * Strictly checks planner identity and applies locality/category filters.
 */
export function getVerifiedCollaborationsForPlanner(
  plannerEmail: string,
  filter?: {
    location?: string;
    city?: string;
    area?: string;
    category?: string;
    query?: string;
  }
): PopulatedCollaboration[] {
  const normEmail = (plannerEmail || '').toLowerCase().trim();
  if (normEmail !== 'planner@weddingorchestrator.com') {
    return [];
  }

  const rawLoc = filter?.location || filter?.area || '';
  const searchLoc = rawLoc.toLowerCase().trim();
  const resolved = resolveLocality(rawLoc);
  const canonicalArea = resolved ? resolved.canonicalName.toLowerCase() : '';
  const resolvedCity = resolved ? resolved.city.toLowerCase() : '';
  const searchCity = (filter?.city || resolvedCity).toLowerCase().trim();
  const searchCat = (filter?.category || '').toLowerCase().trim();
  const query = (filter?.query || '').toLowerCase().trim();

  const matchedRecords = VERIFIED_PLANNER_COLLABORATIONS.filter((rec) => {
    // 1. Planner match
    if (rec.plannerEmail.toLowerCase() !== normEmail) return false;

    // 2. Location match (Canonical Area or City)
    if (canonicalArea) {
      if (rec.area.toLowerCase() !== canonicalArea) return false;
    } else if (searchLoc) {
      const recArea = rec.area.toLowerCase();
      const recCity = rec.city.toLowerCase();
      const recLoc = rec.locationLabel.toLowerCase();
      const match =
        recArea.includes(searchLoc) ||
        recCity.includes(searchLoc) ||
        recLoc.includes(searchLoc) ||
        searchLoc.includes(recArea) ||
        searchLoc.includes(recCity);
      if (!match) return false;
    }

    if (searchCity) {
      if (!rec.city.toLowerCase().includes(searchCity)) return false;
    }

    // 3. Category match
    if (searchCat) {
      const recCat = rec.category.toLowerCase();
      const match = recCat.includes(searchCat) || searchCat.includes(recCat);
      if (!match) return false;
    }

    // 4. Query match
    if (query) {
      const name = rec.vendorBusinessName.toLowerCase();
      const notes = rec.collaborationNotes.toLowerCase();
      const match = name.includes(query) || notes.includes(query);
      if (!match) return false;
    }

    return true;
  });

  // Map each record to the actual vendor object in DEMO_VENDORS
  const populated: PopulatedCollaboration[] = [];
  for (const record of matchedRecords) {
    const vendor = DEMO_VENDORS.find((v) => v.id === record.vendorId);
    if (vendor) {
      populated.push({ record, vendor });
    }
  }

  return populated;
}

/**
 * Retrieves recommended alternative vendors matching location and category.
 * Follows strict 3-tier sequence:
 *   1. Exact event locality
 *   2. Nearby adjacent localities (same region) - clearly badged
 *   3. City-wide fallback
 * Excludes already collaborated vendors (or specified IDs).
 */
export function getRecommendedVendorsForPlanner(filter: {
  city?: string;
  area?: string;
  location?: string;
  category?: string;
  excludeVendorIds?: string[];
  eventDate?: string;
  limit?: number;
}): Vendor[] {
  const rawLoc = filter.location || filter.area || '';
  const searchLoc = rawLoc.toLowerCase().trim();
  const resolved = resolveLocality(rawLoc);
  const canonicalArea = resolved ? resolved.canonicalName.toLowerCase() : '';
  const resolvedCity = resolved ? resolved.city.toLowerCase() : '';
  const searchCity = (filter.city || resolvedCity).toLowerCase().trim();
  const searchCat = (filter.category || '').toLowerCase().trim();
  const excluded = new Set((filter.excludeVendorIds || []).map((id) => id.toLowerCase()));
  const limit = filter.limit || 8;

  const matchesCategory = (vendorCat: string, queryCat: string): boolean => {
    if (!queryCat) return true;
    const catLower = vendorCat.toLowerCase();
    if (catLower.includes(queryCat) || queryCat.includes(catLower)) return true;
    if (queryCat.includes('decor') && (catLower.includes('decor') || catLower.includes('flower'))) return true;
    if (queryCat.includes('photo') && (catLower.includes('photo') || catLower.includes('video'))) return true;
    if ((queryCat.includes('venue') || queryCat.includes('hall')) && (catLower.includes('venue') || catLower.includes('lawn') || catLower.includes('hotel') || catLower.includes('accommodation'))) return true;
    if ((queryCat.includes('dj') || queryCat.includes('sound')) && (catLower.includes('dj') || catLower.includes('sound'))) return true;
    if ((queryCat.includes('makeup') || queryCat.includes('styling')) && (catLower.includes('makeup') || catLower.includes('mehendi'))) return true;
    if ((queryCat.includes('cater') || queryCat.includes('food')) && catLower.includes('cater')) return true;
    return false;
  };

  // 1. Exact locality matches
  const exactMatches = DEMO_VENDORS.filter((v) => {
    if (excluded.has(v.id.toLowerCase())) return false;
    if (searchCity && !v.primaryCity.toLowerCase().includes(searchCity)) return false;

    if (searchCat && !matchesCategory(v.category, searchCat)) {
      return false;
    }

    if (canonicalArea) {
      return (
        v.serviceableAreas &&
        v.serviceableAreas.some((a) => a.toLowerCase() === canonicalArea)
      );
    } else if (searchLoc) {
      const servesArea =
        v.serviceableAreas &&
        v.serviceableAreas.some((a) => a.toLowerCase().includes(searchLoc) || searchLoc.includes(a.toLowerCase()));
      const cityMatches = v.primaryCity.toLowerCase().includes(searchLoc) || searchLoc.includes(v.primaryCity.toLowerCase());
      return servesArea || cityMatches;
    }

    return true;
  });

  exactMatches.sort((a, b) => {
    const scoreA = (a.onTimeDeliveryPercent || 90) * 10 + (a.completedOrders || 0);
    const scoreB = (b.onTimeDeliveryPercent || 90) * 10 + (b.completedOrders || 0);
    return scoreB - scoreA;
  });

  const results: Vendor[] = exactMatches.map((v) => ({
    ...v,
    isNearbyCoverage: false,
    nearbyCoverageNote: undefined,
  }));

  // 2. Nearby Adjacent Localities in same region (if available matches are < 3 or < limit)
  if (results.length < limit && resolved) {
    const existingIds = new Set(results.map((v) => v.id.toLowerCase()));
    excluded.forEach((id) => existingIds.add(id));

    const adjacentLocalities = ALL_LOCALITIES.filter(
      (l) =>
        l.region === resolved.region &&
        l.canonicalName.toLowerCase() !== canonicalArea &&
        l.city === resolved.city
    );

    for (const adj of adjacentLocalities) {
      if (results.length >= limit) break;
      const adjNameLower = adj.canonicalName.toLowerCase();

      const adjMatches = DEMO_VENDORS.filter((v) => {
        if (existingIds.has(v.id.toLowerCase())) return false;
        if (v.primaryCity.toLowerCase() !== resolved.city.toLowerCase()) return false;
        if (searchCat && !matchesCategory(v.category, searchCat)) return false;
        return (
          v.serviceableAreas &&
          v.serviceableAreas.some((a) => a.toLowerCase() === adjNameLower)
        );
      });

      for (const vendor of adjMatches) {
        if (results.length >= limit) break;
        if (!existingIds.has(vendor.id.toLowerCase())) {
          existingIds.add(vendor.id.toLowerCase());
          results.push({
            ...vendor,
            isNearbyCoverage: true,
            nearbyCoverageNote: `Nearby Coverage: ${adj.canonicalName}`,
          });
        }
      }
    }
  }

  // 3. City-Wide fallback if still under limit
  if (results.length < limit && searchCity) {
    const existingIds = new Set(results.map((v) => v.id.toLowerCase()));
    excluded.forEach((id) => existingIds.add(id));

    const cityMatches = DEMO_VENDORS.filter((v) => {
      if (existingIds.has(v.id.toLowerCase())) return false;
      if (!v.primaryCity.toLowerCase().includes(searchCity)) return false;
      if (searchCat && !matchesCategory(v.category, searchCat)) return false;
      return true;
    });

    for (const vendor of cityMatches) {
      if (results.length >= limit) break;
      if (!existingIds.has(vendor.id.toLowerCase())) {
        existingIds.add(vendor.id.toLowerCase());
        results.push({
          ...vendor,
          isNearbyCoverage: true,
          nearbyCoverageNote: `City-Wide Coverage (${vendor.primaryCity})`,
        });
      }
    }
  }

  return results.slice(0, limit);
}
