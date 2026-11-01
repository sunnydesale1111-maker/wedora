import { VendorSlotType } from '@/types/vendorSlot';
import {
  VoiceLanguage,
  detectLanguage,
  calculateQuotation,
  QuotationCalculationResult,
  normalizeDevanagariNumerals,
  convertSpokenNumberWords,
} from './vendorVoiceNlu';
import { resolveLocality, LocalityDefinition } from './localityRegistry';

export type PlannerVoiceIntentType =
  | 'DISCOVER_VENDORS'
  | 'FIND_ALTERNATIVES'
  | 'CHECK_AVAILABILITY'
  | 'SWAP_VENDOR'
  | 'CREATE_QUOTE'
  | 'REVIEW_QUOTE'
  | 'BOOK_SLOT'
  | 'VIEW_CALENDAR'
  | 'PERFORMANCE_FORECAST'
  | 'NEED_CLARIFICATION'
  | 'HELP'
  | 'UNKNOWN';

export interface ParsedPlannerCommand {
  intent: PlannerVoiceIntentType;
  rawText: string;
  detectedLang: VoiceLanguage;
  location?: string; // e.g. "Baner, Pune" or "Baner"
  city?: 'Pune' | 'Mumbai';
  area?: string; // e.g. "Baner"
  category?: string; // canonical category label
  vendorName?: string;
  targetVendorToReplace?: string;
  replacementVendorName?: string;
  date?: string; // YYYY-MM-DD
  slot?: VendorSlotType;
  guestCount?: number;
  pricePerPlate?: number;
  calculation?: QuotationCalculationResult;
  needsClarification?: boolean;
  clarificationPrompt?: string;
  assistantSpeechResponse: string;
}

/**
 * Normalizes location keywords and identifies city / area across all Pune and Mumbai localities
 */
export function extractLocationFromText(text: string): {
  location?: string;
  city?: 'Pune' | 'Mumbai';
  area?: string;
  devanagariArea?: string;
} {
  const lower = text.toLowerCase();

  // 1. Check full canonical locality registry with aliases and Devanagari mappings
  const resolved = resolveLocality(text);
  if (resolved) {
    if (resolved.canonicalName === 'Pune City') {
      return { city: 'Pune', location: 'Pune', area: 'Pune City', devanagariArea: 'पुणे' };
    }
    if (resolved.canonicalName === 'Mumbai City and Mumbai Suburbs') {
      return { city: 'Mumbai', location: 'Mumbai', area: 'Mumbai City and Mumbai Suburbs', devanagariArea: 'मुंबई' };
    }
    return {
      area: resolved.canonicalName,
      city: resolved.city,
      location: `${resolved.canonicalName}, ${resolved.city}`,
      devanagariArea: resolved.devanagari,
    };
  }

  // 2. City fallback
  if (lower.includes('pune') || lower.includes('पुणे') || lower.includes('पुण्यातील')) {
    return { city: 'Pune', location: 'Pune', devanagariArea: 'पुणे' };
  }

  if (lower.includes('mumbai') || lower.includes('मुंबई') || lower.includes('बॉम्बे')) {
    return { city: 'Mumbai', location: 'Mumbai', devanagariArea: 'मुंबई' };
  }

  return {};
}

/**
 * Extracts category from user query
 */
export function extractCategoryFromText(text: string): string | undefined {
  const lower = text.toLowerCase();

  if (
    lower.includes('photo') ||
    lower.includes('camera') ||
    lower.includes('video') ||
    lower.includes('फोटोग्राफर') ||
    lower.includes('फोटो') ||
    lower.includes('छायाचित्रण')
  ) {
    return 'Photography and Videography';
  }

  if (
    lower.includes('cater') ||
    lower.includes('food') ||
    lower.includes('plate') ||
    lower.includes('कॅटरर') ||
    lower.includes('कॅटरर्स') ||
    lower.includes('कॅटरिंग') ||
    lower.includes('कैटरर') ||
    lower.includes('कैटरर्स') ||
    lower.includes('कैटरिंग') ||
    lower.includes('जेवण') ||
    lower.includes('खानपान') ||
    lower.includes('खान-पान') ||
    lower.includes('थाळी')
  ) {
    return 'Catering and Food Services';
  }

  if (
    lower.includes('decor') ||
    lower.includes('mandap') ||
    lower.includes('flower') ||
    lower.includes('डेकोर') ||
    lower.includes('डेकोरेशन') ||
    lower.includes('मंडप') ||
    lower.includes('सजावट') ||
    lower.includes('फुले')
  ) {
    return 'Decoration Services';
  }

  if (
    lower.includes('venue') ||
    lower.includes('hall') ||
    lower.includes('lawn') ||
    lower.includes('resort') ||
    lower.includes('हॉल') ||
    lower.includes('जागा') ||
    lower.includes('लॉन') ||
    lower.includes('बँक्वेट')
  ) {
    return 'Wedding Lawns and Venues';
  }

  if (
    lower.includes('dj') ||
    lower.includes('sound') ||
    lower.includes('music') ||
    lower.includes('संगीत') ||
    lower.includes('ध्वनी') ||
    lower.includes('डीजे')
  ) {
    return 'DJ and Sound Systems';
  }

  if (
    lower.includes('makeup') ||
    lower.includes('mehendi') ||
    lower.includes('beauty') ||
    lower.includes('मेकअप') ||
    lower.includes('मेहंदी') ||
    lower.includes('सौंदर्य')
  ) {
    return 'Makeup and Mehendi Artists';
  }

  return undefined;
}

/**
 * Extracts date in YYYY-MM-DD from English, Hindi, or Marathi input
 */
export function extractDateFromPlannerText(text: string): string | undefined {
  const cleaned = normalizeDevanagariNumerals(text.toLowerCase());

  // 1. ISO format: YYYY-MM-DD
  const isoMatch = cleaned.match(/\b(202[5-9])[-/.](0?[1-9]|1[0-2])[-/.](0?[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // 2. Day Month Year
  const monthNames: Record<string, string> = {
    january: '01', jan: '01', जानेवारी: '01', जनवरी: '01',
    february: '02', feb: '02', फेब्रुवारी: '02', फरवरी: '02',
    march: '03', mar: '03', मार्च: '03',
    april: '04', apr: '04', एप्रिल: '04', अप्रैल: '04',
    may: '05', मे: '05', मई: '05',
    june: '06', jun: '06', जून: '06',
    july: '07', jul: '07', जुलै: '07', जुलाई: '07',
    august: '08', aug: '08', ऑगस्ट: '08', अगस्त: '08',
    september: '09', sep: '09', sept: '09', सप्टेंबर: '09', सितंबर: '09',
    october: '10', oct: '10', ऑक्टोबर: '10', अक्टूबर: '10',
    november: '11', nov: '11', नोव्हेंबर: '11', नवंबर: '11',
    december: '12', dec: '12', डिसेंबर: '12', दिसंबर: '12',
  };

  const monthRegexPart = Object.keys(monthNames).join('|');

  // Match: "15 December 2026", "20 डिसेंबर 2026", "15th Dec 2026", "24th of Dec 2026"
  const regexDayMonthYear = new RegExp(
    `(\\b[0-3]?\\d)(?:st|nd|rd|th)?\\s+(?:of\\s+)?(${monthRegexPart})(?:\\s+(202[5-9]))?`,
    'i'
  );
  const match = cleaned.match(regexDayMonthYear);
  if (match) {
    const day = parseInt(match[1], 10);
    const mName = match[2].toLowerCase();
    const month = monthNames[mName];
    const year = match[3] || '2026';
    if (day >= 1 && day <= 31 && month) {
      return `${year}-${month}-${String(day).padStart(2, '0')}`;
    }
  }

  // Match: "December 25 2026", "Dec 24, 2026"
  const regexMonthDayYear = new RegExp(
    `(${monthRegexPart})\\s+(\\b[0-3]?\\d)(?:st|nd|rd|th)?,?\\s*(202[5-9])?`,
    'i'
  );
  const matchMDY = cleaned.match(regexMonthDayYear);
  if (matchMDY) {
    const mName = matchMDY[1].toLowerCase();
    const month = monthNames[mName];
    const day = parseInt(matchMDY[2], 10);
    const year = matchMDY[3] || '2026';
    if (day >= 1 && day <= 31 && month) {
      return `${year}-${month}-${String(day).padStart(2, '0')}`;
    }
  }

  return undefined;
}

/**
 * Extracts slot from text
 */
export function extractSlotFromPlannerText(text: string): VendorSlotType | undefined {
  const lower = text.toLowerCase();

  // Full day
  if (
    lower.includes('full day') ||
    lower.includes('both slots') ||
    lower.includes('पूर्ण दिवस') ||
    lower.includes('दोन्ही स्लॉट') ||
    lower.includes('पूरा दिन') ||
    lower.includes('दोनों स्लॉट')
  ) {
    return 'FULL_DAY';
  }

  // First half
  if (
    lower.includes('first half') ||
    lower.includes('morning') ||
    lower.includes('पहिला स्लॉट') ||
    lower.includes('पहिली वेळ') ||
    lower.includes('पहिला भाग') ||
    lower.includes('सकाळ') ||
    lower.includes('पहला हाफ') ||
    lower.includes('पहला स्लॉट') ||
    lower.includes('सुबह')
  ) {
    return 'FIRST_HALF';
  }

  // Second half
  if (
    lower.includes('second half') ||
    lower.includes('evening') ||
    lower.includes('दुसरा स्लॉट') ||
    lower.includes('दुसरी वेळ') ||
    lower.includes('दुसरा भाग') ||
    lower.includes('संध्याकाळ') ||
    lower.includes('दूसरा हाफ') ||
    lower.includes('दूसरा स्लॉट') ||
    lower.includes('शाम')
  ) {
    return 'SECOND_HALF';
  }

  return undefined;
}

/**
 * Main NLU Engine for the Wedora Professional Event Planner Assistant
 */
export function parsePlannerVoiceCommand(
  rawInput: string,
  context?: {
    activeCity?: 'Pune' | 'Mumbai';
    activeArea?: string;
    activeEventDate?: string;
    activeEventName?: string;
  }
): ParsedPlannerCommand {
  const lang = detectLanguage(rawInput);
  const normalizedInput = convertSpokenNumberWords(rawInput);
  const lower = normalizedInput.toLowerCase();

  const loc = extractLocationFromText(normalizedInput);
  const detectedCity = loc.city || context?.activeCity || 'Pune';
  const detectedArea = loc.area || (loc.location ? undefined : context?.activeArea);
  const effectiveLocation = loc.location || (loc.area ? `${loc.area}, ${detectedCity}` : context?.activeArea ? `${context.activeArea}, ${detectedCity}` : detectedCity);

  const category = extractCategoryFromText(normalizedInput);
  const date = extractDateFromPlannerText(normalizedInput) || context?.activeEventDate;
  const slot = extractSlotFromPlannerText(normalizedInput);

  // 1. VIEW CALENDAR INTENT
  if (
    lower.includes('calendar') ||
    lower.includes('कॅलेंडर') ||
    lower.includes('कैलेंडर') ||
    lower.includes('availability calendar')
  ) {
    const speech =
      lang === 'mr'
        ? 'कॅलेंडर टॅब उघडला आहे. आपण तारीख आणि स्लॉट तपासू शकता.'
        : lang === 'hi'
        ? 'कैलेंडर टैब खोल दिया गया है। आप तारीख और स्लॉट उपलब्धता देख सकते हैं।'
        : 'Opened the Availability Calendar. You can inspect daily First Half and Second Half slots.';

    return {
      intent: 'VIEW_CALENDAR',
      rawText: rawInput,
      detectedLang: lang,
      location: effectiveLocation,
      city: detectedCity,
      area: detectedArea,
      category,
      date,
      slot,
      assistantSpeechResponse: speech,
    };
  }

  // 2. EVENT PERFORMANCE FORECAST INTENT
  if (
    lower.includes('forecast') ||
    lower.includes('readiness') ||
    lower.includes('performance') ||
    lower.includes('अंदाज') ||
    lower.includes('फोरकास्ट') ||
    lower.includes('कामगिरी')
  ) {
    const speech =
      lang === 'mr'
        ? 'इव्हेंट परफॉर्मन्स अंदाज खाली अद्यतनित केला आहे.'
        : lang === 'hi'
        ? 'इवेंट परफॉर्मेंस फोरकास्ट नीचे अपडेट कर दिया गया है।'
        : 'Event Performance Forecast has been refreshed with your active vendors.';

    return {
      intent: 'PERFORMANCE_FORECAST',
      rawText: rawInput,
      detectedLang: lang,
      location: effectiveLocation,
      city: detectedCity,
      area: detectedArea,
      category,
      date,
      slot,
      assistantSpeechResponse: speech,
    };
  }

  // 3. SWAP VENDOR INTENT
  if (
    lower.includes('swap') ||
    lower.includes('replace') ||
    lower.includes('बदला') ||
    lower.includes('बदल') ||
    lower.includes('रिप्लेस')
  ) {
    const speech =
      lang === 'mr'
        ? `उपलब्ध पर्यायी वेंडरसह बदल करण्यासाठी कृपया खालील वेंडर कार्डवरील 'Swap Vendor' वर क्लिक करा.`
        : lang === 'hi'
        ? `वेंडर बदलने के लिए कृपया नीचे दिए गए वेंडर कार्ड पर 'Swap Vendor' पर क्लिक करके पुष्टि करें।`
        : `Ready to swap vendor. Click 'Swap Vendor' on the recommended alternative below to confirm the replacement.`;

    return {
      intent: 'SWAP_VENDOR',
      rawText: rawInput,
      detectedLang: lang,
      location: effectiveLocation,
      city: detectedCity,
      area: detectedArea,
      category,
      date,
      slot,
      assistantSpeechResponse: speech,
    };
  }

  // 4. CHECK AVAILABILITY INTENT
  if (
    lower.includes('available') ||
    lower.includes('availability') ||
    lower.includes('उपलब्ध') ||
    lower.includes('खाली') ||
    lower.includes('फ्री')
  ) {
    const dateFormatted = date || '15 December 2026';
    const slotLabel = slot === 'FIRST_HALF' ? 'First Half' : slot === 'SECOND_HALF' ? 'Second Half' : 'requested slots';

    const speech =
      lang === 'mr'
        ? `${dateFormatted} साठी वेंडर उपलब्धता तपासली आहे.`
        : lang === 'hi'
        ? `${dateFormatted} के लिए वेंडर उपलब्धता जांच ली गई है।`
        : `Checked vendor availability for ${dateFormatted} (${slotLabel}). Available vendors are highlighted below.`;

    return {
      intent: 'CHECK_AVAILABILITY',
      rawText: rawInput,
      detectedLang: lang,
      location: effectiveLocation,
      city: detectedCity,
      area: detectedArea,
      category,
      date,
      slot,
      assistantSpeechResponse: speech,
    };
  }

  // 5. CREATE / CALCULATE QUOTE INTENT
  // Strip commas within numbers (e.g. 1,100 -> 1100, 1,200 -> 1200)
  const decommified = normalizedInput.replace(/(\d+),(\d+)/g, '$1$2');
  const digits = decommified.match(/\d+/g);
  const isQuoteCommand =
    lower.includes('quote') ||
    lower.includes('quotation') ||
    lower.includes('कोटेशन') ||
    lower.includes('दर') ||
    lower.includes('plate') ||
    lower.includes('थाळी') ||
    lower.includes('guest') ||
    lower.includes('पाहुणे') ||
    lower.includes('मेहमान');

  if (isQuoteCommand && digits && digits.length >= 2) {
    const val1 = parseInt(digits[0], 10);
    const val2 = parseInt(digits[1], 10);

    const guestMatch = decommified.match(/(\d+)\s*(?:guests?|पाहुणे|मेहमान)/i);
    const plateMatch = decommified.match(/(?:at|@|₹|rs\.?|दर)?\s*(\d+)\s*(?:per\s*plate|प्रमाणे|दर|थाळी)/i);

    let guestCount = 500;
    let pricePerPlate = 1000;

    if (guestMatch) {
      guestCount = parseInt(guestMatch[1], 10);
      pricePerPlate = val1 === guestCount ? val2 : val1;
    } else if (plateMatch) {
      pricePerPlate = parseInt(plateMatch[1], 10);
      guestCount = val1 === pricePerPlate ? val2 : val1;
    } else {
      guestCount = val1 > 40 && val1 < 5000 ? val1 : val2;
      pricePerPlate = guestCount === val1 ? val2 : val1;
    }

    try {
      const calc = calculateQuotation({ guestCount, pricePerPlate });
      const speech =
        lang === 'mr'
          ? `${calc.guestCount} पाहुण्यांसाठी ₹${calc.pricePerPlate.toLocaleString('en-IN')} प्रमाणे तात्पुरती रक्कम ₹${calc.totalAmount.toLocaleString('en-IN')} आहे.`
          : lang === 'hi'
          ? `${calc.guestCount} मेहमानों के लिए ₹${calc.pricePerPlate.toLocaleString('en-IN')} प्रति प्लेट पर कुल अनंतिम राशि ₹${calc.totalAmount.toLocaleString('en-IN')} है।`
          : `Your provisional quotation for ${calc.guestCount} guests at ₹${calc.pricePerPlate.toLocaleString('en-IN')} per plate is ₹${calc.totalAmount.toLocaleString('en-IN')}.`;

      return {
        intent: 'CREATE_QUOTE',
        rawText: rawInput,
        detectedLang: lang,
        location: effectiveLocation,
        city: detectedCity,
        area: detectedArea,
        category: 'Catering and Food Services',
        guestCount,
        pricePerPlate,
        calculation: calc,
        assistantSpeechResponse: speech,
      };
    } catch {
      // fallback
    }
  }

  // Localized location for speech synthesis
  const speechLoc =
    (lang === 'mr' || lang === 'hi') && loc.devanagariArea
      ? `${loc.devanagariArea}, ${detectedCity === 'Pune' ? 'पुणे' : 'मुंबई'}`
      : effectiveLocation;

  // 6. FIND ALTERNATIVES INTENT
  if (
    lower.includes('alternative') ||
    lower.includes('recommend') ||
    lower.includes('पर्याय') ||
    lower.includes('पर्यायी') ||
    lower.includes('वैकल्पिक') ||
    lower.includes('दुसरे')
  ) {
    const targetCat = category || 'Vendors';
    const speech =
      lang === 'mr'
        ? `${speechLoc} मधील योग्य पर्यायी वेंडर्स खाली दाखवले आहेत.`
        : lang === 'hi'
        ? `${speechLoc} में उपयुक्त अनुशंसित वैकल्पिक वेंडर्स नीचे दिखाए गए हैं।`
        : `Showing recommended alternative ${targetCat} in ${effectiveLocation}.`;

    return {
      intent: 'FIND_ALTERNATIVES',
      rawText: rawInput,
      detectedLang: lang,
      location: effectiveLocation,
      city: detectedCity,
      area: detectedArea,
      category,
      date,
      slot,
      assistantSpeechResponse: speech,
    };
  }

  // 7. DISCOVER VENDORS INTENT (Default for searching/showing vendors worked with or in an area)
  // e.g. "Can you show me the vendors we have previously worked with in Baner, Pune?"
  const speech =
    lang === 'mr'
      ? `${speechLoc} मधील पूर्वी काम केलेले वेंडर्स आणि पर्यायी शिफारसी खाली दाखवल्या आहेत.`
      : lang === 'hi'
      ? `${speechLoc} में पूर्व सहयोग वाले वेंडर्स और अनुशंसित विकल्प नीचे प्रस्तुत हैं।`
      : `Here are the vendors we have previously worked with in ${effectiveLocation}, along with recommended alternatives.`;

  return {
    intent: 'DISCOVER_VENDORS',
    rawText: rawInput,
    detectedLang: lang,
    location: effectiveLocation,
    city: detectedCity,
    area: detectedArea,
    category,
    date,
    slot,
    assistantSpeechResponse: speech,
  };
}

export interface ParsedCreateEventCommand {
  rawText: string;
  detectedLang: VoiceLanguage;
  isValid: boolean;
  missingFields: ('clientName' | 'eventDate' | 'venueName' | 'location')[];
  eventName?: string;
  eventType?: string;
  eventDate?: string; // YYYY-MM-DD
  venueName?: string;
  venueAddress?: string;
  city?: 'Pune' | 'Mumbai';
  area?: string;
  guestCount?: number;
  estimatedBudget?: number;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  assistantSpeechResponse: string;
}

/**
 * Intelligent Multilingual Voice & Text Parser for AI Event Creation
 * Extracts client, venue, date, location, guests, budget.
 * Strictly enforces mandatory fields: client name, date, venue, location.
 * Under NO circumstances does it invent or assume missing mandatory fields.
 */
export function parsePlannerCreateEventCommand(rawInput: string): ParsedCreateEventCommand {
  const lang = detectLanguage(rawInput);
  const normalized = convertSpokenNumberWords(normalizeDevanagariNumerals(rawInput));
  const lower = normalized.toLowerCase();

  // 1. Extract Phone & Email
  const phoneMatch = normalized.match(/\b(?:\+91[\s-]?)?[6-9]\d{9}\b/);
  const clientPhone = phoneMatch ? phoneMatch[0].replace(/\s+/g, '') : undefined;

  const emailMatch = normalized.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const clientEmail = emailMatch ? emailMatch[0] : undefined;

  // 2. Extract Date (Mandatory)
  const eventDate = extractDateFromPlannerText(normalized);

  // 3. Extract Location (City & Locality) (Mandatory)
  const loc = extractLocationFromText(normalized);
  const city = loc.city;
  const area = loc.area || (loc.canonicalName ? loc.canonicalName : undefined);

  // 4. Extract Guest Count
  let guestCount: number | undefined;
  const guestMatch = normalized.match(/(\d+)\s*(?:guests?|people|pax|पाहुणे|पाहुण्यां|मेहमान)/i);
  if (guestMatch) {
    guestCount = parseInt(guestMatch[1], 10);
  }

  // 5. Extract Estimated Budget
  let estimatedBudget: number | undefined;
  const budgetLakhMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:lakhs?|lac|lacs?|लाख)/i);
  if (budgetLakhMatch) {
    estimatedBudget = Math.round(parseFloat(budgetLakhMatch[1]) * 100000);
  } else {
    const budgetCrMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:crores?|cr|करोड)/i);
    if (budgetCrMatch) {
      estimatedBudget = Math.round(parseFloat(budgetCrMatch[1]) * 10000000);
    } else {
      const rawBudgetMatch = normalized.match(/(?:budget|बजेट|बजट|amount|cost)[\s:₹rs\.]*(\d{5,8})/i);
      if (rawBudgetMatch) {
        estimatedBudget = parseInt(rawBudgetMatch[1], 10);
      }
    }
  }

  // 6. Extract Client Name (Mandatory)
  let clientName: string | undefined;

  // English: "for Vikram and Ananya", "client Vikram Malhotra & Ananya Sen", "wedding for Vikram and Ananya"
  const enClientMatch = normalized.match(
    /(?:for|client|couple)\s+([A-Z][a-z]+(?:\s+(?:and|&)\s+[A-Z][a-z]+|\s+[A-Z][a-z]+)*)/i
  );
  if (enClientMatch) {
    clientName = enClientMatch[1].replace(/\s+(?:on|at|for|with|in|date)$/i, '').trim();
  } else {
    // Marathi: "राहुल आणि स्नेहाचा", "रोहित आणि पूजा यांचा"
    const mrClientMatch = normalized.match(
      /([^\s,]+(?:\s+(?:आणि|व)\s+[^\s,]+?))(?:चा|ची|चे|यांचा|यांचे)?\s*(?:विवाह|लग्न)/
    );
    if (mrClientMatch) {
      clientName = mrClientMatch[1].trim();
    } else {
      // Hindi: "राज और सिमरन की शादी"
      const hiClientMatch = normalized.match(
        /([^\s,]+(?:\s+(?:और|तथा)\s+[^\s,]+?))\s*(?:की|का|के)?\s*शादी/
      );
      if (hiClientMatch) {
        clientName = hiClientMatch[1].trim();
      } else {
        // Fallback: look for "Name and Name"
        const pairMatch = normalized.match(/([A-Z][a-zA-Z]+(?:\s+(?:and|&)\s+[A-Z][a-zA-Z]+))/);
        if (pairMatch) {
          clientName = pairMatch[1].trim();
        }
      }
    }
  }

  // 7. Extract Venue Name (Mandatory)
  let venueName: string | undefined;
  let venueAddress: string | undefined;

  // Patterns: "at Grand Hyatt Ballroom", "venue Emerald Meadows Banquets", "at Orchid Lawns"
  const venueEnMatch = normalized.match(
    /(?:at|venue)\s+([A-Z][a-zA-Z0-9\s&'-]+?)(?=\s+(?:in|on|for|with|guests|budget|city|date|phone|$))/i
  );
  if (venueEnMatch) {
    const rawVenue = venueEnMatch[1].trim();
    if (rawVenue.length > 2 && !rawVenue.toLowerCase().includes('december') && !rawVenue.toLowerCase().includes('pune') && !rawVenue.toLowerCase().includes('mumbai')) {
      venueName = rawVenue;
    }
  }

  // Marathi / Hindi venue patterns: "स्थळ अमर बॅनक्वेट्स", "वेन्यू ताज हॉटेल", "हॉल [नाव]", or ending in बॅनक्वेट्स / लॉन्स / हॉटेल / हॉल
  if (!venueName) {
    const venueMrHiMatch = normalized.match(
      /(?:स्थळ|वेन्यू|हॉल|venue)\s+([^\s,]+(?:\s+[^\s,]+){0,3})/i
    );
    if (venueMrHiMatch) {
      venueName = venueMrHiMatch[1].replace(/\s+(?:मध्ये|येथे|ला|in|at)$/i, '').trim();
    } else {
      const directVenueMatch = normalized.match(
        /([^\s,]+(?:\s+बॅनक्वेट्स|\s+हॉल|\s+लॉन्स|\s+हॉटेल|\s+रिसॉर्ट|\s+गार्डन))/i
      );
      if (directVenueMatch) {
        venueName = directVenueMatch[1].trim();
      }
    }
  }

  // Check known venue keywords if still not found
  if (!venueName) {
    const knownVenues = [
      'Emerald Meadows Wedding Lawn & Banquets',
      'Emerald Meadows',
      'Sea Princess Heritage Ballroom',
      'Sahyadri Hillside Wedding Lawns',
      'Grand Hyatt',
      'JW Marriott',
      'Orchid Banquets',
      'Taj Lands End',
      'Four Seasons',
      'Balgandharva Lawns',
      'Royal Orchid',
    ];
    for (const v of knownVenues) {
      if (lower.includes(v.toLowerCase())) {
        venueName = v;
        break;
      }
    }
  }

  if (venueName) {
    venueAddress = `${venueName}${area ? `, ${area}` : ''}${city ? `, ${city}` : ''}`;
  }

  // 8. Event Name & Event Type
  let eventName: string | undefined;
  let eventType = 'Traditional Hindu Wedding & Reception';

  if (lower.includes('sangeet')) {
    eventType = 'Sangeet & Royal Wedding Gala';
  } else if (lower.includes('destination')) {
    eventType = 'Destination Wedding & Reception';
  } else if (lower.includes('reception')) {
    eventType = 'Wedding Reception & Banquet';
  }

  if (clientName) {
    eventName =
      lang === 'mr'
        ? `${clientName} यांचा विवाह सोहळा`
        : lang === 'hi'
        ? `${clientName} का विवाह समारोह`
        : `${clientName}'s Wedding Celebration`;
  }

  // 9. Mandatory Fields Check
  const missingFields: ('clientName' | 'eventDate' | 'venueName' | 'location')[] = [];
  if (!clientName) missingFields.push('clientName');
  if (!eventDate) missingFields.push('eventDate');
  if (!venueName) missingFields.push('venueName');
  if (!city && !area) missingFields.push('location');

  const isValid = missingFields.length === 0;

  // 10. Generate Speech Responses
  let assistantSpeechResponse = '';
  if (!isValid) {
    const missingEn: string[] = [];
    const missingHi: string[] = [];
    const missingMr: string[] = [];

    if (missingFields.includes('clientName')) {
      missingEn.push('client or couple name');
      missingHi.push('क्लाइंट/जोड़े का नाम');
      missingMr.push('ग्राहकाचे किंवा जोडप्याचे नाव');
    }
    if (missingFields.includes('eventDate')) {
      missingEn.push('confirmed event date');
      missingHi.push('पुष्टीकृत तारीख');
      missingMr.push('कार्यक्रमाची तारीख');
    }
    if (missingFields.includes('venueName')) {
      missingEn.push('venue name & address');
      missingHi.push('वेन्यू और पता');
      missingMr.push('स्थळ (वेन्यू)');
    }
    if (missingFields.includes('location')) {
      missingEn.push('city or locality');
      missingHi.push('शहर या इलाका');
      missingMr.push('शहर किंवा परिसर');
    }

    if (lang === 'mr') {
      assistantSpeechResponse = `कृपया पुढील आवश्यक माहिती द्या: ${missingMr.join(', ')}. आम्ही तारीख किंवा वेन्यू स्वतःहून ठरवू शकत नाही.`;
    } else if (lang === 'hi') {
      assistantSpeechResponse = `कृपया निम्नलिखित आवश्यक जानकारी बताएं: ${missingHi.join(', ')}। हम अपनी तरफ से तारीख या वेन्यू का अनुमान नहीं लगा सकते।`;
    } else {
      assistantSpeechResponse = `Please provide the following required details: ${missingEn.join(', ')}. I cannot invent or assume a date or venue.`;
    }
  } else {
    if (lang === 'mr') {
      assistantSpeechResponse = `${clientName} यांच्यासाठी ${eventDate} रोजी ${venueName}, ${area || city} येथे कार्यक्रम तपशील तयार केले आहेत. कृपया सारांश तपासा आणि पुष्टी करा.`;
    } else if (lang === 'hi') {
      assistantSpeechResponse = `${clientName} के लिए ${eventDate} को ${venueName}, ${area || city} में कार्यक्रम विवरण तैयार हैं। कृपया सारांश की जांच करें और पुष्टि करें।`;
    } else {
      assistantSpeechResponse = `Extracted wedding celebration details for ${clientName} on ${eventDate} at ${venueName}, ${area || city}. Please review the summary and confirm to create the event.`;
    }
  }

  return {
    rawText: rawInput,
    detectedLang: lang,
    isValid,
    missingFields,
    eventName,
    eventType,
    eventDate,
    venueName,
    venueAddress,
    city,
    area,
    guestCount,
    estimatedBudget,
    clientName,
    clientPhone,
    clientEmail,
    assistantSpeechResponse,
  };
}
