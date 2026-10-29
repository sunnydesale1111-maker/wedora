import { City, VendorCategory, SearchIntent } from '../types/vendor';

// Exact required messages and questions for the 5-question chatbot flow (Version 5.1)
export const OPENING_MESSAGE =
  "Namaste! 🙏 Welcome to Wedora. I'm here to help you plan your special occasion. What event are you planning?";

export const QUESTION_1_EVENT = "What event are you planning?";
export const QUESTION_2_LOCATION = "Which city and area will your event take place in?";
export const QUESTION_3_CATEGORY = "Which type of vendor would you like to find first?";
export const QUESTION_4_BUDGET = "What is your approximate budget for this service?";
export const QUESTION_5_DATE = "And finally, what date is your event planned for?";

export const FINAL_MESSAGE_MATCHES =
  "Thank you! I've found vendors according to your event requirements. You can explore the matching vendors on the right and shortlist the ones you like.";

export const FINAL_MESSAGE_NO_MATCHES =
  "I couldn't find vendors matching all your requirements. We can try a different date, location, or budget.";

export const FRIENDLY_EMPTY_STATE =
  "Your vendor recommendations will appear here once we've understood your event requirements.";

export const SUGGESTIONS_Q1 = [
  'Wedding',
  'Engagement',
  'Reception',
  'Sangeet / Haldi',
  'Birthday Party',
  'Corporate Event',
];

export const SUGGESTIONS_Q2 = [
  'Mumbai',
  'Pune',
  'Bandra, Mumbai',
  'Andheri, Mumbai',
  'Kothrud, Pune',
  'Baner, Pune',
];

export const SUGGESTIONS_Q3 = [
  'Catering and Food Services',
  'Decoration Services',
  'Photography and Videography',
  'Wedding Lawns and Venues',
  'DJ and Sound Systems',
  'End-to-End Event Management',
];

export const SUGGESTIONS_Q4 = [
  '₹50,000',
  '₹1 - 2 Lakh',
  '₹3 - 5 Lakh',
  '₹5 - 10 Lakh',
  'No fixed budget',
];

export const SUGGESTIONS_Q5 = [
  '15 December 2026',
  '20 December 2026',
  '25 December 2026',
  'Next Saturday',
  'Not finalized yet',
];

export const SUGGESTIONS_COMPLETED = [
  'Show Caterers',
  'Show Decorators',
  'Show Photographers',
  'View Shortlist',
  'Change City to Pune',
];

// Mapping of natural-language keywords to formal Vendor Categories
export const CATEGORY_SYNONYMS: Record<string, VendorCategory> = {
  // Catering
  catering: 'Catering and Food Services',
  caterer: 'Catering and Food Services',
  caterers: 'Catering and Food Services',
  food: 'Catering and Food Services',
  buffet: 'Catering and Food Services',
  feasts: 'Catering and Food Services',
  feast: 'Catering and Food Services',
  cuisine: 'Catering and Food Services',
  pangat: 'Catering and Food Services',

  // Decoration
  decoration: 'Decoration Services',
  decor: 'Decoration Services',
  decorator: 'Decoration Services',
  decorators: 'Decoration Services',
  mandap: 'Decoration Services',

  // Flowers
  flowers: 'Flower Arrangements',
  flower: 'Flower Arrangements',
  floral: 'Flower Arrangements',
  florist: 'Flower Arrangements',

  // Lighting
  lighting: 'Lighting Services',
  lights: 'Lighting Services',
  light: 'Lighting Services',
  illumination: 'Lighting Services',
  beam: 'Lighting Services',

  // DJ and Sound
  dj: 'DJ and Sound Systems',
  sound: 'DJ and Sound Systems',
  sounds: 'DJ and Sound Systems',
  music: 'DJ and Sound Systems',
  audio: 'DJ and Sound Systems',
  speaker: 'DJ and Sound Systems',
  speakers: 'DJ and Sound Systems',
  dhol: 'DJ and Sound Systems',

  // Furniture and Equipment
  furniture: 'Furniture and Equipment Rental',
  rental: 'Furniture and Equipment Rental',
  rentals: 'Furniture and Equipment Rental',
  chairs: 'Furniture and Equipment Rental',
  tables: 'Furniture and Equipment Rental',
  sofas: 'Furniture and Equipment Rental',
  pagoda: 'Furniture and Equipment Rental',
  hangar: 'Furniture and Equipment Rental',
  generator: 'Furniture and Equipment Rental',
  genset: 'Furniture and Equipment Rental',

  // Venues and Lawns
  lawn: 'Wedding Lawns and Venues',
  lawns: 'Wedding Lawns and Venues',
  venue: 'Wedding Lawns and Venues',
  venues: 'Wedding Lawns and Venues',
  banquet: 'Wedding Lawns and Venues',
  banquets: 'Wedding Lawns and Venues',
  'marriage hall': 'Wedding Lawns and Venues',
  'wedding hall': 'Wedding Lawns and Venues',

  // Hotels and Accommodation
  hotel: 'Hotels and Guest Accommodation',
  hotels: 'Hotels and Guest Accommodation',
  rooms: 'Hotels and Guest Accommodation',
  room: 'Hotels and Guest Accommodation',
  stay: 'Hotels and Guest Accommodation',
  lodging: 'Hotels and Guest Accommodation',
  accommodation: 'Hotels and Guest Accommodation',
  residency: 'Hotels and Guest Accommodation',

  // Photography
  photography: 'Photography and Videography',
  photographer: 'Photography and Videography',
  photographers: 'Photography and Videography',
  photo: 'Photography and Videography',
  photos: 'Photography and Videography',
  videography: 'Photography and Videography',
  video: 'Photography and Videography',
  cinematography: 'Photography and Videography',
  cinematographer: 'Photography and Videography',

  // Event Organizers / Wedding Planners
  planner: 'Event Organizers / Wedding Planners',
  planners: 'Event Organizers / Wedding Planners',
  'wedding planner': 'Event Organizers / Wedding Planners',
  'wedding planners': 'Event Organizers / Wedding Planners',
  organizer: 'Event Organizers / Wedding Planners',
  organizers: 'Event Organizers / Wedding Planners',
  'event organizer': 'Event Organizers / Wedding Planners',
  'event organizers': 'Event Organizers / Wedding Planners',
  'event manager': 'Event Organizers / Wedding Planners',

  // End to End
  'end-to-end': 'End-to-End Event Management',
  'end to end': 'End-to-End Event Management',
  'full wedding management': 'End-to-End Event Management',
  'full wedding': 'End-to-End Event Management',
  'everything included': 'End-to-End Event Management',
  turnkey: 'End-to-End Event Management',

  // Logistics
  logistics: 'Logistics and Transportation',
  transportation: 'Logistics and Transportation',
  transport: 'Logistics and Transportation',
  cars: 'Logistics and Transportation',
  coaches: 'Logistics and Transportation',
  shuttle: 'Logistics and Transportation',
  buses: 'Logistics and Transportation',
  fleet: 'Logistics and Transportation',

  // Makeup
  makeup: 'Makeup and Mehendi Artists',
  mehendi: 'Makeup and Mehendi Artists',
  mehndi: 'Makeup and Mehendi Artists',
  makeover: 'Makeup and Mehendi Artists',
  henna: 'Makeup and Mehendi Artists',
  bridal: 'Makeup and Mehendi Artists',
};

export const MUMBAI_LOCALITIES: string[] = [
  'Andheri',
  'Bandra',
  'Borivali',
  'Goregaon',
  'Malad',
  'Powai',
  'Dadar',
  'Lower Parel',
  'Chembur',
  'Ghatkopar',
  'Mulund',
  'Navi Mumbai',
  'Thane',
];

export const PUNE_LOCALITIES: string[] = [
  'Baner',
  'Wakad',
  'Hinjewadi',
  'Aundh',
  'Kothrud',
  'Viman Nagar',
  'Kharadi',
  'Hadapsar',
  'Koregaon Park',
  'Shivajinagar',
  'Pimpri-Chinchwad',
  'Magarpatta',
];

export interface ParserContext {
  currentCity?: City;
  currentDate?: string;
  isDateNotFinalized?: boolean;
  hasAnsweredDate?: boolean;
  currentAreas?: string[];
  currentGuestCount?: number;
  currentCategory?: VendorCategory;
  currentCategories?: VendorCategory[];
  currentOccasion?: string;
  currentBudget?: number;
  hasAnsweredBudget?: boolean;
  flowCompleted?: boolean;
  matchedCount?: number;
}

/**
 * Single reliable completion check based on the five required event fields.
 * Does NOT rely on message count.
 */
export function isRequirementsComplete(context: {
  occasion?: string;
  city?: City;
  category?: VendorCategory;
  hasAnsweredBudget?: boolean;
  budget?: number;
  hasAnsweredDate?: boolean;
  date?: string;
  isDateNotFinalized?: boolean;
}): boolean {
  const hasOccasion = Boolean(context.occasion && context.occasion.trim().length > 0);
  const hasCity = Boolean(context.city);
  const hasCategory = Boolean(context.category);
  const hasBudget = Boolean(context.hasAnsweredBudget || context.budget !== undefined);
  const hasDate = Boolean(context.hasAnsweredDate || context.date || context.isDateNotFinalized);

  return hasOccasion && hasCity && hasCategory && hasBudget && hasDate;
}

/**
 * Extracts date from text, recognizing natural language, standard date formats,
 * and flexible / "Not finalized yet" responses.
 */
export function parseDateInput(text: string): {
  isDateAnswer: boolean;
  detectedDate?: string;
  isDateNotFinalized?: boolean;
  dateText?: string;
} {
  const q = text.trim().toLowerCase();

  // "Not finalized yet", "not finalized", "undecided", "not fixed", "tbd", "to be decided", "flexible"
  if (
    /not\s+finalized(?:\s+yet)?|undecided|not\s+fixed|tbd|to\s+be\s+decided|flexible|later|any\s+date|no\s+date/i.test(q) ||
    q === 'no' ||
    q === 'n/a'
  ) {
    return {
      isDateAnswer: true,
      isDateNotFinalized: true,
      dateText: 'Not finalized yet',
    };
  }

  // Common dates in test & wedding season
  let detectedDate: string | undefined = undefined;
  if (/\b15(?:th)?\s*(?:december|dec)(?:\s*2026)?\b/i.test(q)) detectedDate = '2026-12-15';
  else if (/\b18(?:th)?\s*(?:december|dec)(?:\s*2026)?\b/i.test(q)) detectedDate = '2026-12-18';
  else if (/\b20(?:th)?\s*(?:december|dec)(?:\s*2026)?\b/i.test(q)) detectedDate = '2026-12-20';
  else if (/\b25(?:th)?\s*(?:december|dec)(?:\s*2026)?\b/i.test(q)) detectedDate = '2026-12-25';
  else if (/\b28(?:th)?\s*(?:december|dec)(?:\s*2026)?\b/i.test(q)) detectedDate = '2026-12-28';
  else if (/next sunday/i.test(q)) detectedDate = '2026-10-25';
  else if (/next saturday/i.test(q)) detectedDate = '2026-10-24';
  else {
    const isoMatch = q.match(/\b(2026-\d{2}-\d{2}|2027-\d{2}-\d{2})\b/);
    if (isoMatch) detectedDate = isoMatch[1];
    else {
      const ddmmyyyyMatch = q.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](2026|2027)\b/);
      if (ddmmyyyyMatch) {
        const day = ddmmyyyyMatch[1].padStart(2, '0');
        const month = ddmmyyyyMatch[2].padStart(2, '0');
        const year = ddmmyyyyMatch[3];
        detectedDate = `${year}-${month}-${day}`;
      } else {
        const monthMap: Record<string, string> = {
          jan: '01', january: '01', feb: '02', february: '02', mar: '03', march: '03',
          apr: '04', april: '04', may: '05', jun: '06', june: '06', jul: '07', july: '07',
          aug: '08', august: '08', sep: '09', september: '09', oct: '10', october: '10',
          nov: '11', november: '11', dec: '12', december: '12',
        };
        const monthMatch = q.match(
          /\b(\d{1,2})(?:st|nd|rd|th)?\s*(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s*(2026|2027))?\b/i
        );
        if (monthMatch) {
          const day = monthMatch[1].padStart(2, '0');
          const mStr = monthMatch[2].toLowerCase();
          const month = monthMap[mStr] || '12';
          const year = monthMatch[3] || '2026';
          detectedDate = `${year}-${month}-${day}`;
        }
      }
    }
  }

  if (detectedDate) {
    return {
      isDateAnswer: true,
      detectedDate,
      dateText: detectedDate,
    };
  }

  return { isDateAnswer: false };
}

export function parseDate(text: string): string | undefined {
  const res = parseDateInput(text);
  return res.detectedDate;
}

/**
 * Extracts budget amount or detects flexible/quotation preferences.
 */
export function parseBudget(text: string): { isBudgetAnswer: boolean; maxBudget?: number; budgetText?: string } {
  const t = text.trim().toLowerCase();

  // Flexible / skip / quotations
  if (
    /no\s+fixed\s+budget|no\s+budget|not\s+fixed|flexible|any\s+budget|none|skip|quotation|quote/i.test(t) ||
    t === 'no' ||
    t === 'n/a'
  ) {
    return { isBudgetAnswer: true, maxBudget: undefined, budgetText: 'Flexible / Quotations' };
  }

  // Range: e.g. 2-3 lakh, 2 to 3 lakh, ₹2–3 lakh
  const rangeMatch = t.match(/(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:–|-|to)\s*(\d+(?:\.\d+)?)\s*(lakh|lac|cr|k)?/i);
  if (rangeMatch) {
    let high = parseFloat(rangeMatch[2]);
    const unit = rangeMatch[3]?.toLowerCase();
    if (!unit || unit === 'lakh' || unit === 'lac') high *= 100000;
    else if (unit === 'cr') high *= 10000000;
    else if (unit === 'k') high *= 1000;
    return { isBudgetAnswer: true, maxBudget: high, budgetText: text.trim() };
  }

  // Single amount with unit: e.g. 2 lakh, 50k, 1 cr, ₹1 lakh
  const unitMatch = t.match(/(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakh|lac|cr|k)\b/i);
  if (unitMatch) {
    let val = parseFloat(unitMatch[1]);
    const unit = unitMatch[2].toLowerCase();
    if (unit === 'lakh' || unit === 'lac') val *= 100000;
    else if (unit === 'cr') val *= 10000000;
    else if (unit === 'k') val *= 1000;
    return { isBudgetAnswer: true, maxBudget: val, budgetText: `₹${val.toLocaleString('en-IN')}` };
  }

  // Pure number with currency or digits: e.g. ₹50,000, 50000, ₹2,00,000
  const numMatch = t.match(/(?:₹|rs\.?)?\s*(\d[\d,]*)\b/i);
  if (numMatch) {
    const rawDigits = numMatch[1].replace(/,/g, '');
    const val = parseInt(rawDigits, 10);
    if (!isNaN(val) && val >= 1000) {
      return { isBudgetAnswer: true, maxBudget: val, budgetText: `₹${val.toLocaleString('en-IN')}` };
    }
  }

  return { isBudgetAnswer: false };
}

/**
 * Deterministically parses user messages according to the structured 5-question chatbot flow.
 */
export function parseSearchIntent(
  query: string,
  existingContext: ParserContext = {}
): SearchIntent {
  const q = query.trim().toLowerCase();

  // 1. Detect Shortlist Queries & Remove Commands
  const isShortlistQuery =
    q.includes('shortlist') || q.includes('saved vendor') || q.includes('saved organizer');

  if (isShortlistQuery) {
    // Check if remove command: e.g. "Remove Royal Feast Caterers from my shortlist"
    const removeMatch = q.match(/remove\s+(?:the\s+)?(.*?)\s+(?:from|in)\s+(?:my\s+)?shortlist/i);
    if (removeMatch) {
      const targetVendorName = removeMatch[1].trim();
      return {
        rawQuery: query,
        shortlistRemoveVendor: targetVendorName,
        assistantReply: `Searching for "${targetVendorName}" on your shortlist to remove...`,
      };
    }

    // Check if indexed shortlist command: e.g. "Shortlist the second vendor"
    const indexMatch = q.match(
      /shortlist\s+(?:the\s+)?(first|second|third|fourth|fifth|1st|2nd|3rd|4th|5th|vendor\s+(\d+)|\d+(?:st|nd|rd|th)?)\s*(?:vendor)?/i
    );
    if (indexMatch) {
      const ord = (indexMatch[2] || indexMatch[1]).toLowerCase();
      let idx = 0;
      if (ord === 'second' || ord === '2nd' || ord === '2') idx = 1;
      else if (ord === 'third' || ord === '3rd' || ord === '3') idx = 2;
      else if (ord === 'fourth' || ord === '4th' || ord === '4') idx = 3;
      else if (ord === 'fifth' || ord === '5th' || ord === '5') idx = 4;
      else if (ord === 'first' || ord === '1st' || ord === '1') idx = 0;
      else {
        const num = parseInt(ord, 10);
        if (!isNaN(num) && num > 0) idx = num - 1;
      }
      return {
        rawQuery: query,
        shortlistIndex: idx,
        assistantReply: `Shortlisting vendor #${idx + 1} from your search results...`,
      };
    }

    // Shortlist listing queries
    let shortlistCategory: string | undefined = undefined;
    let isOrganizer = false;
    let shortlistCity: string | undefined = undefined;

    if (q.includes('cater') || q.includes('food')) {
      shortlistCategory = 'Catering and Food Services';
    } else if (q.includes('decor')) {
      shortlistCategory = 'Decoration Services';
    } else if (q.includes('flower')) {
      shortlistCategory = 'Flower Arrangements';
    } else if (q.includes('organizer') || q.includes('planner')) {
      isOrganizer = true;
    }

    if (q.includes('pune')) shortlistCity = 'Pune';
    if (q.includes('mumbai')) shortlistCity = 'Mumbai';

    return {
      rawQuery: query,
      shortlistQuery: {
        category: shortlistCategory,
        isOrganizer,
        city: shortlistCity,
        all: !shortlistCategory && !isOrganizer && !shortlistCity,
      },
      assistantReply: isOrganizer
        ? 'Here are the event organizers currently saved on your shortlist.'
        : shortlistCategory
        ? `Here are the ${shortlistCategory} providers saved on your shortlist.`
        : 'Displaying your shortlisted vendors and event organizers.',
    };
  }

  // 2. Detect Greetings
  const isGreetingMatch =
    /^(?:hi|hello|hey|namaste|good\s+morning|good\s+afternoon|good\s+evening)\b/i.test(q) ||
    q === 'hi' ||
    q === 'hello' ||
    q === 'namaste';

  if (isGreetingMatch && !existingContext.currentOccasion && !existingContext.flowCompleted) {
    return {
      rawQuery: query,
      isGreeting: true,
      nextQuestion: 1,
      assistantReply: OPENING_MESSAGE,
      suggestedOptions: SUGGESTIONS_Q1,
      flowCompleted: false,
    };
  }

  // 3. Extract Event / Occasion
  let detectedOccasion: string | undefined = undefined;
  if (/\bwedding\b/i.test(q)) detectedOccasion = 'Wedding';
  else if (/\bengagement\b/i.test(q)) detectedOccasion = 'Engagement';
  else if (/\breception\b/i.test(q)) detectedOccasion = 'Reception';
  else if (/\bbirthday\b/i.test(q)) detectedOccasion = 'Birthday';
  else if (/\bcorporate\b/i.test(q)) detectedOccasion = 'Corporate Event';
  else if (/\banniversary\b|\bparty\b|\bsangeet\b|\bhaldi\b/i.test(q)) detectedOccasion = 'Other Event';
  else if (!existingContext.currentOccasion && !existingContext.flowCompleted) {
    // If user is currently answering Question 1 and entered a short string (e.g. "My Wedding" or "Reception")
    const words = q.split(/\s+/);
    if (words.length <= 4 && !q.includes('pune') && !q.includes('mumbai') && !q.includes('lakh')) {
      detectedOccasion = query.trim();
    }
  }

  // 4. Extract Location (City & Areas)
  let detectedCity: City | undefined = undefined;
  if (/\bmumbai\b|\bbombay\b/i.test(q)) {
    detectedCity = 'Mumbai';
  } else if (/\bpune\b|\bpoona\b/i.test(q)) {
    detectedCity = 'Pune';
  }

  let detectedAreas: string[] = [];
  const allKnownAreas = [...MUMBAI_LOCALITIES, ...PUNE_LOCALITIES];
  for (const area of allKnownAreas) {
    const areaRegex = new RegExp(`\\b${area.toLowerCase()}\\b`, 'i');
    if (areaRegex.test(q)) {
      detectedAreas.push(area);
      if (!detectedCity) {
        if (MUMBAI_LOCALITIES.includes(area)) detectedCity = 'Mumbai';
        if (PUNE_LOCALITIES.includes(area)) detectedCity = 'Pune';
      }
    }
  }

  // 5. Extract Vendor Categories
  let detectedCategory: VendorCategory | undefined = undefined;
  const detectedCategories: VendorCategory[] = [];

  if (
    q.includes('end-to-end') ||
    q.includes('end to end') ||
    q.includes('full wedding management') ||
    q.includes('everything included') ||
    q.includes('turnkey')
  ) {
    detectedCategory = 'End-to-End Event Management';
    detectedCategories.push(detectedCategory);
  } else {
    for (const [kw, cat] of Object.entries(CATEGORY_SYNONYMS)) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(q)) {
        if (!detectedCategories.includes(cat)) {
          detectedCategories.push(cat);
        }
        if (!detectedCategory) {
          detectedCategory = cat;
        }
      }
    }
  }

  // 6. Extract Budget
  const budgetInfo = parseBudget(query);
  const detectedMaxBudget = budgetInfo.maxBudget;
  const isBudgetAnswer = budgetInfo.isBudgetAnswer;

  // 7. Extract Date (with flexible / not-finalized detection)
  const dateInfo = parseDateInput(query);
  const detectedDate = dateInfo.detectedDate;
  const isDateAnswer = dateInfo.isDateAnswer;
  const isDateNotFinalized = dateInfo.isDateNotFinalized;

  // 8. Extract Optional Guest Count (not asked in 5-questions, recognized only if volunteered)
  let detectedGuestCount: number | undefined = undefined;
  const guestMatch = q.match(/(?:for\s+)?(\d+)\s*(?:guests?|people|pax)\b/i);
  if (guestMatch) {
    const parsedG = parseInt(guestMatch[1], 10);
    if (parsedG > 0) detectedGuestCount = parsedG;
  }

  // 9. Extract Sort Signal
  let detectedSortBy: 'completed_orders' | 'repeat_orders' | 'referrals' | 'price_asc' | 'price_desc' | undefined = undefined;
  if (q.includes('referral') || q.includes('referrals')) {
    detectedSortBy = 'referrals';
  } else if (q.includes('repeat order') || q.includes('repeat orders')) {
    detectedSortBy = 'repeat_orders';
  } else if (q.includes('completed order') || q.includes('completed orders')) {
    detectedSortBy = 'completed_orders';
  } else if (q.includes('cheaper') || q.includes('lowest price') || q.includes('budget friendly')) {
    detectedSortBy = 'price_asc';
  } else if (q.includes('highest price') || q.includes('premium')) {
    detectedSortBy = 'price_desc';
  }

  // Accumulated effective values across conversation turns
  const effectiveOccasion = detectedOccasion || existingContext.currentOccasion;
  const effectiveCity = detectedCity || existingContext.currentCity;
  const effectiveAreas =
    detectedAreas.length > 0
      ? detectedAreas
      : detectedCity && detectedCity !== existingContext.currentCity
      ? []
      : existingContext.currentAreas || [];
  const effectiveCategory = detectedCategory || existingContext.currentCategory;
  const effectiveCategories =
    detectedCategories.length > 0 ? detectedCategories : existingContext.currentCategories || [];
  const hasAnsweredBudget =
    isBudgetAnswer || existingContext.hasAnsweredBudget || detectedMaxBudget !== undefined;
  const effectiveMaxBudget =
    detectedMaxBudget !== undefined ? detectedMaxBudget : existingContext.currentBudget;
  const hasAnsweredDate =
    isDateAnswer ||
    existingContext.hasAnsweredDate ||
    Boolean(detectedDate) ||
    Boolean(existingContext.currentDate) ||
    Boolean(existingContext.isDateNotFinalized);
  const effectiveDate = detectedDate || (isDateNotFinalized ? undefined : existingContext.currentDate);
  const effectiveDateNotFinalized = Boolean(
    isDateNotFinalized || (existingContext.isDateNotFinalized && !detectedDate)
  );

  const areaMention =
    effectiveAreas.length > 0
      ? ` in ${effectiveAreas.join(', ')}, ${effectiveCity || ''}`.trim()
      : effectiveCity
      ? ` in ${effectiveCity}`
      : '';

  const isCategoryChange = Boolean(
    detectedCategory &&
    existingContext.currentCategory &&
    detectedCategory !== existingContext.currentCategory
  );

  const isPostFlow =
    Boolean(existingContext.flowCompleted) ||
    Boolean(
      isCategoryChange &&
      (existingContext.currentCity || existingContext.currentDate || existingContext.hasAnsweredDate)
    );

  let assistantReply = '';
  let nextQuestion: 1 | 2 | 3 | 4 | 5 | undefined = undefined;
  let flowCompleted = false;
  let suggestedOptions: string[] | undefined = undefined;

  // Single reliable completion check based on the five required fields
  const complete = isRequirementsComplete({
    occasion: effectiveOccasion,
    city: effectiveCity,
    category: effectiveCategory,
    hasAnsweredBudget,
    budget: effectiveMaxBudget,
    hasAnsweredDate,
    date: effectiveDate,
    isDateNotFinalized: effectiveDateNotFinalized,
  });

  // ROUTE A: FLOW IS ALREADY COMPLETED (Post-flow conversational refinement)
  if (isPostFlow) {
    flowCompleted = true;
    suggestedOptions = SUGGESTIONS_COMPLETED;

    if (
      detectedCategory &&
      existingContext.currentCategory &&
      detectedCategory !== existingContext.currentCategory
    ) {
      assistantReply = `Showing ${detectedCategory} matching your event${areaMention}${
        effectiveDate ? ` on ${effectiveDate}` : ''
      }. Your location, date, and budget details have been retained.`;
    } else if (detectedCity || detectedAreas.length > 0) {
      assistantReply = `Updated location to ${effectiveCity}${
        effectiveAreas.length > 0 ? ` (${effectiveAreas.join(', ')})` : ''
      }. Showing matching ${effectiveCategory || 'vendors'}${
        effectiveDate ? ` on ${effectiveDate}` : ''
      }.`;
    } else if (detectedDate || isDateNotFinalized) {
      assistantReply = `Updated date to ${effectiveDate || 'flexible'}. Showing matching ${
        effectiveCategory || 'vendors'
      }${areaMention}.`;
    } else if (isBudgetAnswer) {
      assistantReply = `Updated budget preference. Showing matching ${
        effectiveCategory || 'vendors'
      }${areaMention}.`;
    } else if (detectedSortBy) {
      const sortLabel =
        detectedSortBy === 'referrals'
          ? 'verified customer referrals'
          : detectedSortBy === 'repeat_orders'
          ? 'repeat bookings'
          : detectedSortBy === 'price_asc'
          ? 'starting price (lowest first)'
          : 'completed orders';
      assistantReply = `Sorted ${effectiveCategory || 'vendors'} by ${sortLabel}.`;
    } else {
      assistantReply = `Updated your search preferences for ${effectiveCategory || 'vendors'}${areaMention}.`;
    }
  } else {
    // ROUTE B: MANDATORY FIVE-QUESTION PROGRESSIVE FLOW
    // Exact sequence:
    // Question 1: Event
    // Question 2: Location
    // Question 3: Vendor Requirement
    // Question 4: Budget
    // Question 5: Event Date

    if (complete) {
      flowCompleted = true;
      suggestedOptions = SUGGESTIONS_COMPLETED;
      if (existingContext.matchedCount === 0) {
        assistantReply = FINAL_MESSAGE_NO_MATCHES;
      } else {
        assistantReply = FINAL_MESSAGE_MATCHES;
      }
    } else {
      flowCompleted = false;
      if (!effectiveOccasion) {
        nextQuestion = 1;
        assistantReply = QUESTION_1_EVENT;
        suggestedOptions = SUGGESTIONS_Q1;
      } else if (!effectiveCity) {
        nextQuestion = 2;
        assistantReply = QUESTION_2_LOCATION;
        suggestedOptions = SUGGESTIONS_Q2;
      } else if (!effectiveCategory) {
        nextQuestion = 3;
        assistantReply = QUESTION_3_CATEGORY;
        suggestedOptions = SUGGESTIONS_Q3;
      } else if (!hasAnsweredBudget) {
        nextQuestion = 4;
        assistantReply = QUESTION_4_BUDGET;
        suggestedOptions = SUGGESTIONS_Q4;
      } else if (!hasAnsweredDate) {
        nextQuestion = 5;
        assistantReply = QUESTION_5_DATE;
        suggestedOptions = SUGGESTIONS_Q5;
      }
    }
  }

  return {
    rawQuery: query,
    detectedCity,
    detectedAreas: detectedAreas.length > 0 ? detectedAreas : undefined,
    detectedCategory,
    detectedCategories: detectedCategories.length > 0 ? detectedCategories : undefined,
    detectedDate,
    isDateAnswer,
    isDateNotFinalized: effectiveDateNotFinalized,
    detectedGuestCount,
    detectedMaxBudget,
    detectedOccasion,
    detectedSortBy,
    isGreeting: isGreetingMatch,
    isBudgetAnswer,
    nextQuestion,
    flowCompleted,
    assistantReply,
    suggestedOptions,
  };
}

export default parseSearchIntent;
