/**
 * Wedora Vendor Reputation System — Data Enrichment Engine
 * Generates deterministic, mathematically consistent reputation metrics,
 * area performance breakdowns, and authentic customer feedback records.
 */

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const CUSTOMER_NAMES = [
  'A. Patil',
  'R. Shah',
  'P. Deshmukh',
  'S. Kulkarni',
  'M. Joshi',
  'N. Nair',
  'V. Mehta',
  'D. Shinde',
  'T. Agarwal',
  'K. Iyer',
  'G. Bhosale',
  'H. Trivedi',
  'B. Chavan',
  'C. Gaikwad',
  'S. Singhania',
  'R. Tendulkar',
  'A. Banerjee',
  'M. Parekh',
  'V. Kadam',
  'S. More'
];

const EVENT_TYPES = [
  'Wedding Ceremony',
  'Grand Reception',
  'Ring Ceremony & Engagement',
  'Sangeet & Cocktail Night',
  'Mehendi Celebration'
];

const MONTH_YEARS = [
  'December 2025',
  'January 2026',
  'February 2026',
  'November 2025',
  'October 2025'
];

// Feedback templates per category group (balanced mix of praise + practical constructive notes)
const CATEGORY_FEEDBACK_TEMPLATES = {
  catering: [
    {
      praise: 'Food quality and live chaat counters were exceptional. Our guests especially loved the hot appetizers and traditional dessert spread.',
      constructive: 'Beverage refills at the far dining section had a brief delay during peak dinner rush, but the floor manager resolved it quickly.'
    },
    {
      praise: 'Professional service staff, spotless buffet presentation, and authentic regional flavours. The tasting session matched the wedding spread exactly.',
      constructive: 'Setup started an hour earlier than scheduled which helped avoid any last-minute rush.'
    },
    {
      praise: 'The fusion menu and mocktail bar kept all our guests thrilled. Portions were generous with zero food wastage.',
      constructive: 'Live pasta station line moved slightly slow during peak hours due to customized orders.'
    }
  ],
  decor: [
    {
      praise: 'The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening.',
      constructive: 'Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.'
    },
    {
      praise: 'Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly.',
      constructive: 'Some extra stage spotlighting had to be requested on the spot for family photos.'
    },
    {
      praise: 'Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night.',
      constructive: 'Dismantling crew arrived promptly after the event ended to clear the premises cleanly.'
    }
  ],
  photography: [
    {
      praise: 'Remarkable candid shots capturing genuine family emotions and smiles. Team was polite, unobtrusive, and punctual.',
      constructive: 'Initial digital proof preview took a couple of extra days, but the final color grading was worth the wait.'
    },
    {
      praise: 'Drone coverage and cinematic trailer were breathtaking. Handled our large guest gatherings with patience and ease.',
      constructive: 'We had to remind them about our specific family group photo list during the crowded stage session.'
    },
    {
      praise: 'Creative framing and gorgeous couple portraits in natural light. Teaser video delivered within 48 hours!',
      constructive: 'Traditional stage portraits took slightly longer than budgeted in the schedule.'
    }
  ],
  venue: [
    {
      praise: 'Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests.',
      constructive: 'Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.'
    },
    {
      praise: 'Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized.',
      constructive: 'Restroom checks needed an extra reminder halfway through the reception.'
    },
    {
      praise: 'Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly.',
      constructive: 'Service entrance was busy during overlapping vendor load-ins.'
    }
  ],
  organizer: [
    {
      praise: 'Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout.',
      constructive: 'Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.'
    },
    {
      praise: 'Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained.',
      constructive: 'Bride side car coordination had minor confusion that was rectified promptly.'
    },
    {
      praise: 'Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch.',
      constructive: 'Pre-wedding rehearsal was brief, but the main day execution went smoothly.'
    }
  ],
  default: [
    {
      praise: 'Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed.',
      constructive: 'Initial briefing call was rescheduled once, but the actual execution on event day was spotless.'
    },
    {
      praise: 'Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision.',
      constructive: 'Additional equipment required a brief spot verification before kickoff.'
    },
    {
      praise: 'Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation.',
      constructive: 'Minor wrap-up delay at midnight due to heavy packing load.'
    }
  ]
};

function getCategoryKey(category) {
  const c = (category || '').toLowerCase();
  if (c.includes('cater') || c.includes('food')) return 'catering';
  if (c.includes('decor') || c.includes('flower') || c.includes('lighting')) return 'decor';
  if (c.includes('photo') || c.includes('video')) return 'photography';
  if (c.includes('lawn') || c.includes('venue') || c.includes('hotel') || c.includes('lodging')) return 'venue';
  if (c.includes('organizer') || c.includes('planner') || c.includes('end-to-end') || c.includes('management')) return 'organizer';
  return 'default';
}

function enrichVendorReputation(v) {
  const hash = simpleHash(v.id);
  const catKey = getCategoryKey(v.category);
  const areas = Array.isArray(v.serviceableAreas) && v.serviceableAreas.length > 0
    ? v.serviceableAreas
    : ['Central'];

  // Handle new vendors: fair visibility without inflated numbers
  if (v.isNewToPlatform || v.completedOrders90Days === 0) {
    // Make 2 new vendors have early 1-2 orders to showcase early-stage new vendors
    const hasEarlyOrders = v.id === 'mum-org-05' || v.id === 'pun-dec-06';
    const earlyOrders = hasEarlyOrders ? 2 : 0;
    const earlyFeedback = hasEarlyOrders
      ? [
          {
            id: `fb-${v.id}-1`,
            customerName: 'A. Patil',
            eventType: 'Ring Ceremony & Engagement',
            location: `${areas[0]}, ${v.primaryCity}`,
            comment:
              'A very promising new team on Wedora! They communicated with high enthusiasm and delivered our engagement setup flawlessly on time.',
            isVerifiedBooking: true,
            eventMonthYear: 'February 2026'
          }
        ]
      : [];

    return {
      ...v,
      isNewToPlatform: true,
      completedOrders: earlyOrders,
      completedOrders90Days: earlyOrders,
      successfulReferralBookings: hasEarlyOrders ? 1 : 0,
      repeatCustomerBookings: 0,
      onTimeDeliveryPercent: 100, // No failure on record
      verifiedCustomerFeedbackCount: hasEarlyOrders ? 1 : 0,
      vendorCausedCancellations: 0,
      serviceCommitmentsMetPercent: 100,
      completedOrdersArea: hasEarlyOrders ? { [areas[0]]: 2 } : {},
      repeatOrdersArea: hasEarlyOrders ? { [areas[0]]: 0 } : {},
      referralsArea: hasEarlyOrders ? { [areas[0]]: 1 } : {},
      repeatOrdersTotal: 0,
      referralsTotal: hasEarlyOrders ? 1 : 0,
      customerFeedback: earlyFeedback
    };
  }

  // Active established or growing vendors
  // Seed realistic all-time completed orders (typically 35 to 160 based on ID hash and category)
  const baseFrom90d = Math.max(12, v.completedOrders90Days || 14);
  const allTimeOrders = Math.max(28, (baseFrom90d * 4) + (hash % 38));

  // Successful referral bookings (22% to 32% of completed orders)
  const referralRatio = 0.22 + ((hash % 11) / 100);
  const referralBookings = Math.max(5, Math.min(allTimeOrders - 5, Math.round(allTimeOrders * referralRatio)));

  // Repeat customer bookings (12% to 22% of completed orders)
  const repeatRatio = 0.12 + ((hash % 10) / 100);
  const repeatBookings = Math.max(3, Math.min(allTimeOrders - referralBookings - 2, Math.round(allTimeOrders * repeatRatio)));

  // On-time delivery percent: realistic 93% to 99%
  const onTimePercent = 93 + (hash % 7); // 93, 94, 95, 96, 97, 98, 99

  // Verified customer feedback count (30% to 50% of completed orders)
  const feedbackCount = Math.max(8, Math.round(allTimeOrders * (0.32 + ((hash % 18) / 100))));

  // Cancellations (0, 1, or 2)
  const cancellations = (hash % 5 === 0) ? 2 : (hash % 2 === 0 ? 1 : 0);

  // Commitments met: mathematically consistent (e.g. 95% - 99%)
  const commitmentsMet = Math.max(94, Math.min(99, 100 - cancellations - (100 - onTimePercent) / 3));
  const roundedCommitments = Math.round(commitmentsMet);

  // Distribute completed orders across serviceable areas deterministically
  const completedOrdersArea = {};
  const repeatOrdersArea = {};
  const referralsArea = {};

  let remainingOrders = Math.round(allTimeOrders * 0.85); // 85% in primary areas
  let remainingRepeat = repeatBookings;
  let remainingRefs = referralBookings;

  areas.forEach((area, idx) => {
    const isLast = idx === areas.length - 1;
    const share = isLast ? remainingOrders : Math.max(2, Math.round(remainingOrders / (areas.length - idx + 0.4)));
    remainingOrders = Math.max(0, remainingOrders - share);
    completedOrdersArea[area] = share;

    const areaRep = isLast ? remainingRepeat : Math.min(share, Math.max(1, Math.round(remainingRepeat / (areas.length - idx))));
    remainingRepeat = Math.max(0, remainingRepeat - areaRep);
    repeatOrdersArea[area] = areaRep;

    const areaRef = isLast ? remainingRefs : Math.min(share, Math.max(1, Math.round(remainingRefs / (areas.length - idx))));
    remainingRefs = Math.max(0, remainingRefs - areaRef);
    referralsArea[area] = areaRef;
  });

  // Generate 2 to 3 authentic fictional customer feedback cards
  const templates = CATEGORY_FEEDBACK_TEMPLATES[catKey] || CATEGORY_FEEDBACK_TEMPLATES.default;
  const numFeedback = 2 + (hash % 2); // 2 or 3
  const customerFeedback = [];

  for (let i = 0; i < numFeedback; i++) {
    const tIdx = (hash + i) % templates.length;
    const nameIdx = (hash * 3 + i * 7) % CUSTOMER_NAMES.length;
    const evIdx = (hash * 2 + i * 5) % EVENT_TYPES.length;
    const myIdx = (hash + i * 3) % MONTH_YEARS.length;
    const area = areas[i % areas.length] || areas[0];
    const loc = `${area}, ${v.primaryCity}`;

    const t = templates[tIdx];
    const comment = `${t.praise} ${t.constructive}`;

    customerFeedback.push({
      id: `fb-${v.id}-${i + 1}`,
      customerName: CUSTOMER_NAMES[nameIdx],
      eventType: EVENT_TYPES[evIdx],
      location: loc,
      comment: comment,
      isVerifiedBooking: true,
      eventMonthYear: MONTH_YEARS[myIdx]
    });
  }

  return {
    ...v,
    completedOrders: allTimeOrders,
    successfulReferralBookings: referralBookings,
    repeatCustomerBookings: repeatBookings,
    onTimeDeliveryPercent: onTimePercent,
    verifiedCustomerFeedbackCount: feedbackCount,
    vendorCausedCancellations: cancellations,
    serviceCommitmentsMetPercent: roundedCommitments,
    completedOrdersArea: completedOrdersArea,
    repeatOrdersArea: repeatOrdersArea,
    referralsArea: referralsArea,
    repeatOrdersTotal: repeatBookings,
    referralsTotal: referralBookings,
    customerFeedback: customerFeedback,
    // Keep 90d metric aligned for backward compatibility with existing tests
    completedOrders90Days: Math.max(1, Math.round(allTimeOrders * 0.22))
  };
}

module.exports = {
  enrichVendorReputation,
  simpleHash
};
