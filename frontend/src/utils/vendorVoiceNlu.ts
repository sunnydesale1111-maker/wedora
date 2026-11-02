import { VendorSlotType } from '@/types/vendorSlot';

export type VoiceLanguage = 'en' | 'hi' | 'mr';

export type VoiceIntentType =
  | 'CHECK_AVAILABILITY'
  | 'BOOK_SLOT'
  | 'CREATE_QUOTE'
  | 'REVIEW_QUOTE'
  | 'NAVIGATE_CALENDAR'
  | 'NAVIGATE_INQUIRIES'
  | 'NAVIGATE_BOOKINGS'
  | 'NEED_CLARIFICATION'
  | 'HELP'
  | 'UNKNOWN';

export interface ParsedVoiceCommand {
  intent: VoiceIntentType;
  rawText: string;
  detectedLang: VoiceLanguage;
  date?: string; // YYYY-MM-DD
  slot?: VendorSlotType;
  clientName?: string;
  guestCount?: number;
  pricePerPlate?: number;
  subtotal?: number;
  quotedAmount?: number;
  additionalCharges?: number;
  hasPerPlateCalculation?: boolean;
  serviceCategory?: string;
  targetTab?: 'calendar' | 'inquiries' | 'bookings' | 'overview';
  needsClarification?: boolean;
  missingField?: 'date' | 'guestCount' | 'pricePerPlate' | 'slot' | 'quoteReference';
  clarificationPrompt?: string;
}

/**
 * Structured Conversation Context State
 * Retains supplied dates, slots, parameters, and intent across conversation turns and language switches.
 */
export interface VendorConversationContext {
  role?: 'VENDOR';
  detectedLang?: VoiceLanguage;
  intent?: VoiceIntentType;
  date?: string; // YYYY-MM-DD
  time?: string;
  slot?: VendorSlotType;
  clientName?: string;
  guestCount?: number;
  pricePerPlate?: number;
  quotedAmount?: number;
  additionalCharges?: number;
  lastCheckedAvailability?: {
    date: string;
    firstHalfBooked: boolean;
    secondHalfBooked: boolean;
  };
  missingField?: 'date' | 'guestCount' | 'pricePerPlate' | 'slot' | 'quoteReference';
  history?: Array<{
    sender: 'user' | 'assistant';
    text: string;
    lang: VoiceLanguage;
    timestamp: string;
  }>;
}

/**
 * Deterministic Quotation Calculation
 * Formula: Subtotal = Guest Count × Price Per Plate
 * Total Amount = Subtotal + Additional Charges + Taxes - Discounts
 */
export interface QuotationCalculationResult {
  guestCount: number;
  pricePerPlate: number;
  subtotal: number;
  additionalCharges: number;
  taxRatePercent: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  formula: string;
}

export function calculateQuotation(params: {
  guestCount: number;
  pricePerPlate: number;
  additionalCharges?: number;
  taxRatePercent?: number;
  discountAmount?: number;
}): QuotationCalculationResult {
  const { guestCount, pricePerPlate } = params;
  if (!guestCount || guestCount <= 0 || !pricePerPlate || pricePerPlate <= 0) {
    throw new Error('Valid guest count and price per plate are required for calculation.');
  }

  // Formula: Subtotal = Guest Count × Price Per Plate
  const subtotal = Math.round(guestCount * pricePerPlate);
  const additionalCharges = Math.max(0, Math.round(params.additionalCharges || 0));
  const taxRatePercent = Math.max(0, params.taxRatePercent || 0);
  const taxAmount = taxRatePercent > 0 ? Math.round((subtotal * taxRatePercent) / 100) : 0;
  const discountAmount = Math.max(0, Math.round(params.discountAmount || 0));
  const totalAmount = Math.max(0, subtotal + additionalCharges + taxAmount - discountAmount);

  return {
    guestCount,
    pricePerPlate,
    subtotal,
    additionalCharges,
    taxRatePercent,
    taxAmount,
    discountAmount,
    totalAmount,
    formula: `Subtotal = ${guestCount} × ₹${pricePerPlate.toLocaleString('en-IN')} = ₹${subtotal.toLocaleString('en-IN')}`,
  };
}

/**
 * Converts Devanagari numerals (०-९) to ASCII numerals (0-9)
 */
export function normalizeDevanagariNumerals(text: string): string {
  const devanagariMap: Record<string, string> = {
    '०': '0',
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9',
  };
  return text.replace(/[०-९]/g, (match) => devanagariMap[match] || match);
}

/**
 * Converts spoken number words in Marathi, Hindi, and English into digits
 */
export function convertSpokenNumberWords(text: string): string {
  let res = text;

  const replacements: [string, string][] = [
    // Marathi
    ['दोन हजार', '2000'],
    ['दीड हजार', '1500'],
    ['एक हजार', '1000'],
    ['हजार', '1000'],
    ['बाराशे', '1200'],
    ['पंधराशे', '1500'],
    ['शंभर', '100'],
    ['एकशे', '100'],
    ['दोनशे', '200'],
    ['तीनशे', '300'],
    ['चारशे', '400'],
    ['पाचशे', '500'],
    ['सहाशे', '600'],
    ['सातशे', '700'],
    ['आठशे', '800'],
    ['नऊशे', '900'],
    // Transliterated Marathi & Hindi spoken numbers
    ['pandrah sau', '1500'],
    ['barah sau', '1200'],
    ['barashe', '1200'],
    ['nau sau', '900'],
    ['naushe', '900'],
    ['aath sau', '800'],
    ['aathshe', '800'],
    ['saat sau', '700'],
    ['saatshe', '700'],
    ['sat sau', '700'],
    ['satshe', '700'],
    ['chhah sau', '600'],
    ['chhe sau', '600'],
    ['sahashe', '600'],
    ['paanch sau', '500'],
    ['panch sau', '500'],
    ['pachshe', '500'],
    ['chaar sau', '400'],
    ['charshe', '400'],
    ['teen sau', '300'],
    ['teenshe', '300'],
    ['tin sau', '300'],
    ['tinshe', '300'],
    ['do sau', '200'],
    ['donshe', '200'],
    ['ek sau', '100'],
    ['shambhar', '100'],
    ['ek hazar', '1000'],
    ['do hazar', '2000'],
    ['dedh hazar', '1500'],
    ['don hazar', '2000'],
    ['dono hazar', '2000'],
    // Hindi
    ['दो हज़ार', '2000'],
    ['दो हजार', '2000'],
    ['डेढ़ हज़ार', '1500'],
    ['डेढ़ हजार', '1500'],
    ['एक हज़ार', '1000'],
    ['एक हजार', '1000'],
    ['हज़ार', '1000'],
    ['हजार', '1000'],
    ['बारह सौ', '1200'],
    ['पंद्रह सौ', '1500'],
    ['एक सौ', '100'],
    ['दो सौ', '200'],
    ['तीन सौ', '300'],
    ['चार सौ', '400'],
    ['पाँच सौ', '500'],
    ['पांच सौ', '500'],
    ['छह सौ', '600'],
    ['सात सौ', '700'],
    ['आठ सौ', '800'],
    ['नौ सौ', '900'],
    // English
    ['two thousand', '2000'],
    ['fifteen hundred', '1500'],
    ['twelve hundred', '1200'],
    ['one thousand', '1000'],
    ['nine hundred', '900'],
    ['eight hundred', '800'],
    ['seven hundred', '700'],
    ['six hundred', '600'],
    ['five hundred', '500'],
    ['four hundred', '400'],
    ['three hundred', '300'],
    ['two hundred', '200'],
    ['one hundred', '100'],
  ];

  for (const [phrase, num] of replacements) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    const regex = new RegExp(`(^|[^\\w\\u0900-\\u097F])${escaped}(?=[^\\w\\u0900-\\u097F]|$)`, 'gi');
    res = res.replace(regex, `$1${num}`);
  }

  return res;
}

/**
 * Automatic Language Detection:
 * Identifies whether the vendor is speaking/typing in English, Hindi, or Marathi,
 * including mixed-language / code-switching conversations (Hinglish, Marathiglish).
 */
export function detectLanguage(text: string, currentLang: VoiceLanguage = 'en'): VoiceLanguage {
  const normalized = normalizeDevanagariNumerals(text.toLowerCase());

  // 1. Devanagari Script Analysis
  if (/[\u0900-\u097F]/.test(text)) {
    // Distinct Marathi keywords, affixes, and verbal forms
    const marathiKeywords = [
      'करा', 'करावे', 'तपासा', 'तपास', 'डिसेंबर', 'माझी', 'माझे', 'माझ्या', 'पाहुणे', 'पाहुण्यांसाठी', 'पाहुण्यांचे', 'पाहुण्यांना',
      'चौकशा', 'कॅलेंडर', 'आहे', 'नाही', 'सांगा', 'सांग', 'साठी', 'बनवा', 'दाखवा', 'पहा', 'बघा',
      'पुनरावलोकन', 'दिवस', 'सकाळ', 'दुपार', 'संध्याकाळ', 'दोन्ही',
      'प्रमाणे', 'दर थाळी', 'थाळी', 'नक्की', 'रोजी'
    ];

    // Distinct Hindi keywords and verbal forms
    const hindiKeywords = [
      'करो', 'कीजिए', 'कीजिये', 'बताओ', 'बताइए', 'बताइये', 'दिसंबर', 'दिसम्बर', 'मेरी', 'मेरा', 'मेरे', 'मेहमान', 'मेहमानों',
      'पूछताछ', 'है', 'नहीं', 'दिखाओ', 'दिखाइए', 'बनाओ', 'बनाइए', 'जांच', 'ज़रूर', 'जरूर',
      'के लिए'
    ];

    let mrScore = 0;
    for (const kw of marathiKeywords) {
      if (normalized.includes(kw)) mrScore++;
    }

    let hiScore = 0;
    for (const kw of hindiKeywords) {
      if (normalized.includes(kw)) hiScore++;
    }

    // Standalone postpositions (strictly bounded to avoid matching substrings like "कोटेशन" for "को")
    if (/(?:^|[^\u0900-\u097F])(को|का|की|के|में)(?:[^\u0900-\u097F]|$)/.test(normalized)) {
      hiScore++;
    }
    if (/(?:^|[^\u0900-\u097F])(ला|च्या|च्यासाठी)(?:[^\u0900-\u097F]|$)/.test(normalized)) {
      mrScore++;
    }

    if (mrScore > hiScore) return 'mr';
    if (hiScore > mrScore) return 'hi';
    if (currentLang === 'mr' || currentLang === 'hi') return currentLang;
    return 'hi';
  }

  // 2. Transliterated Latin script (Code-switching / Hinglish / Marathiglish)
  const marathiTranslit = /\b(sathi|tapaasa|tapas|ahe|kara|banva|dakhva|pahune|divas|madat|dusra|pahila|donhi|pramane|mazhi|majhi|mazhya|krupaya|shakyata)\b/i;
  if (marathiTranslit.test(normalized)) {
    return 'mr';
  }

  const hindiTranslit = /\b(karo|batao|bataiye|ke\s*liye|mehmaan|hai|kya|banao|dikhaye|dekho|chahiye|pehle|dusre|dono|madad|meri|mera|mere)\b/i;
  if (hindiTranslit.test(normalized)) {
    return 'hi';
  }

  // 3. English
  return 'en';
}

function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatDateHuman(isoDate: string, lang: VoiceLanguage = 'en'): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthsHi = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
  ];
  const monthsMr = [
    'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
    'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर',
  ];

  if (lang === 'mr') {
    return `${day} ${monthsMr[monthIdx] || parts[1]} ${year}`;
  }
  if (lang === 'hi') {
    return `${day} ${monthsHi[monthIdx] || parts[1]} ${year}`;
  }
  return `${day} ${monthsEn[monthIdx] || parts[1]} ${year}`;
}

/**
 * Parses dates in English, Hindi, and Marathi with relative date and inflection support.
 * Resolves relative dates against the current Asia/Kolkata date.
 */
export function extractDateFromText(text: string, referenceDate?: Date): string | undefined {
  if (!text) return undefined;
  const normalized = normalizeDevanagariNumerals(text.toLowerCase());
  const ref = referenceDate || new Date('2026-11-01T21:48:55+05:30'); // Configured vendor Asia/Kolkata timezone

  // 1. Relative dates:
  // "today" / "आज"
  if (/\b(today|आज)\b/i.test(normalized)) {
    return formatDateISO(ref);
  }

  // "tomorrow" / "उद्या" / "कल"
  if (/\b(tomorrow|उद्या|कल)\b/i.test(normalized)) {
    const d = new Date(ref);
    d.setDate(d.getDate() + 1);
    return formatDateISO(d);
  }

  // "day after tomorrow" / "परवा" / "परसों"
  if (/\b(day after tomorrow|परवा|परसों)\b/i.test(normalized)) {
    const d = new Date(ref);
    d.setDate(d.getDate() + 2);
    return formatDateISO(d);
  }

  // "this weekend" / "weekend" / "या वीकेंडला" / "इस वीकेंड"
  if (/\b(this\s+weekend|weekend|या\s*वीकेंड(?:ला)?|इस\s*वीकेंड)\b/i.test(normalized)) {
    const d = new Date(ref);
    const day = d.getDay(); // 0 is Sun, 6 is Sat
    const diff = day === 6 ? 0 : day === 0 ? 0 : (6 - day);
    d.setDate(d.getDate() + diff);
    return formatDateISO(d);
  }

  // Days of the week in English, Hindi, and Marathi
  const dayNameMapping: Record<string, number> = {
    sunday: 0, रविवार: 0, रविवारी: 0, इतवार: 0,
    monday: 1, सोमवार: 1, सोमवारी: 1,
    tuesday: 2, मंगळवार: 2, मंगळवारी: 2, मंगलवार: 2,
    wednesday: 3, बुधवार: 3, बुधवारी: 3,
    thursday: 4, गुरुवार: 4, गुरुवारी: 4, गुरूवार: 4,
    friday: 5, शुक्रवार: 5, शुक्रवारी: 5,
    saturday: 6, शनिवार: 6, शनिवारी: 6,
  };

  const nextDayRegex = /\b(?:next|पुढील|पुढच्या|अगले)\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday|रविवार|रविवारी|इतवार|सोमवार|सोमवारी|मंगळवार|मंगळवारी|मंगलवार|बुधवार|बुधवारी|गुरूवार|गुरुवार|गुरुवारी|शुक्रवार|शुक्रवारी|शनिवार|शनिवारी)\b/i;
  const nextMatch = normalized.match(nextDayRegex);
  if (nextMatch) {
    const dayKey = nextMatch[1].toLowerCase();
    const targetDay = dayNameMapping[dayKey];
    if (targetDay !== undefined) {
      const d = new Date(ref);
      const currentDay = d.getDay();
      let diff = (targetDay - currentDay + 7) % 7;
      if (diff <= 0) diff += 7;
      d.setDate(d.getDate() + diff);
      return formatDateISO(d);
    }
  }

  // 2. ISO format: 2026-12-15
  const isoMatch = normalized.match(/\b(202[5-9])-(\d{1,2})-(\d{1,2})\b/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // 3. DD/MM/YYYY or DD-MM-YYYY
  const slashMatch = normalized.match(/(?:^|[^\d])(\d{1,2})[\/\-](\d{1,2})[\/\-](202[5-9])\b/);
  if (slashMatch) {
    const d = slashMatch[1].padStart(2, '0');
    const m = slashMatch[2].padStart(2, '0');
    const y = slashMatch[3];
    return `${y}-${m}-${d}`;
  }

  // Month dictionary across 3 languages including inflections
  const MONTH_MAP: Record<string, string> = {
    // English
    january: '01', jan: '01',
    february: '02', feb: '02',
    march: '03', mar: '03',
    april: '04', apr: '04',
    may: '05',
    june: '06', jun: '06',
    july: '07', jul: '07',
    august: '08', aug: '08',
    september: '09', sep: '09', sept: '09',
    october: '10', oct: '10',
    november: '11', nov: '11',
    december: '12', dec: '12',
    // Hindi (with optional suffixes handled)
    जनवरी: '01', फरवरी: '02', मार्च: '03', अप्रैल: '04', मई: '05', जून: '06',
    जुलाई: '07', अगस्त: '08', सितंबर: '09', सितम्बर: '09', अक्टूबर: '10', नवंबर: '11', नवम्बर: '11', दिसंबर: '12', दिसम्बर: '12',
    दिसंबरको: '12', दिसंबरकी: '12', दिसंबरमें: '12',
    // Marathi (with inflected forms directly mapped)
    जानेवारी: '01', फेब्रुवारी: '02', चैत्र: '03', वैशाख: '04', ज्येष्ठ: '05', आषाढ: '06',
    श्रावण: '07', भाद्रपद: '08', अश्विन: '09', कार्तिक: '10', मार्गशीर्ष: '11', पौष: '12',
    एप्रिल: '04', मे: '05', जुलै: '07', ऑगस्ट: '08', सप्टेंबर: '09', ऑक्टोबर: '10', नोव्हेंबर: '11', डिसेंबर: '12',
    डिसेंबरला: '12', डिसेंबरच्या: '12', डिसेंबरचा: '12', डिसेंबरमध्ये: '12', डिसेंबरपर्यंत: '12', डिसेंबरत: '12',
    जानेवारीला: '01', फेब्रुवारीला: '02', मार्चला: '03', एप्रिलला: '04', ऑक्टोबरला: '10', नोव्हेंबरला: '11',
  };

  const monthNamesPattern = Object.keys(MONTH_MAP).join('|');

  // 4. Day + Month + Optional Year
  // Matches: "18th December", "18th of December", "18 दिसंबर", "18 दिसंबर को", "18 डिसेंबर", "18 डिसेंबरला", "18 December ला"
  const dayMonthRegex = new RegExp(
    `(?:^|[^\\d])(\\d{1,2})(?:st|nd|rd|th)?\\s*(?:of\\s+|च्या\\s+|चा\\s+|की\\s+|का\\s+)?(${monthNamesPattern})(?:ला|च्या|चा|मध्ये|पर्यंत|त|को|की|में|का|के)?(?:\\s+(?:ला|को|रोजी))?(?:\\s+(202[5-9]))?(?:[^\\w\\u0900-\\u097F]|$)`,
    'i'
  );
  const dmMatch = normalized.match(dayMonthRegex);
  if (dmMatch) {
    const day = parseInt(dmMatch[1], 10);
    const mKey = dmMatch[2].toLowerCase();
    const month = MONTH_MAP[mKey];
    let year = dmMatch[3] || String(ref.getFullYear());

    if (day >= 1 && day <= 31 && month) {
      return `${year}-${month}-${String(day).padStart(2, '0')}`;
    }
  }

  // 5. Month + Day + Optional Year
  // Matches: "December 18", "December 18th", "December the 18th", "दिसंबर 18"
  const monthDayRegex = new RegExp(
    `(?:^|[^\\w\\u0900-\\u097F])(${monthNamesPattern})(?:ला|च्या|चा|मध्ये|पर्यंत|त|को|की|में|का|के)?\\s+(?:the\\s+)?(\\d{1,2})(?:st|nd|rd|th)?(?:\\s+(202[5-9]))?(?:[^\\w\\u0900-\\u097F]|$)`,
    'i'
  );
  const mdMatch = normalized.match(monthDayRegex);
  if (mdMatch) {
    const mKey = mdMatch[1].toLowerCase();
    const day = parseInt(mdMatch[2], 10);
    const month = MONTH_MAP[mKey];
    let year = mdMatch[3] || String(ref.getFullYear());

    if (day >= 1 && day <= 31 && month) {
      return `${year}-${month}-${String(day).padStart(2, '0')}`;
    }
  }

  return undefined;
}

/**
 * Extracts slot type (FIRST_HALF, SECOND_HALF, FULL_DAY)
 */
export function extractSlotFromText(text: string): VendorSlotType | undefined {
  const lower = text.toLowerCase();

  // Full day keywords
  if (
    lower.includes('full day') ||
    lower.includes('full-day') ||
    lower.includes('whole day') ||
    lower.includes('both slot') ||
    lower.includes('दोनों स्लॉट') ||
    lower.includes('दोन्ही स्लॉट') ||
    lower.includes('पूरा दिन') ||
    lower.includes('पूर्ण दिवस') ||
    lower.includes('फुल डे')
  ) {
    return 'FULL_DAY';
  }

  // First half keywords
  if (
    lower.includes('first half') ||
    lower.includes('1st half') ||
    lower.includes('morning') ||
    lower.includes('सकाळ') ||
    lower.includes('सुबह') ||
    lower.includes('पहला स्लॉट') ||
    lower.includes('पहिला स्लॉट') ||
    lower.includes('फर्स्ट हाफ')
  ) {
    return 'FIRST_HALF';
  }

  // Second half keywords
  if (
    lower.includes('second half') ||
    lower.includes('2nd half') ||
    lower.includes('evening') ||
    lower.includes('afternoon') ||
    lower.includes('night') ||
    lower.includes('संध्याकाळ') ||
    lower.includes('दुपार') ||
    lower.includes('शाम') ||
    lower.includes('दूसरा स्लॉट') ||
    lower.includes('दुसरा स्लॉट') ||
    lower.includes('सेकंड हाफ')
  ) {
    return 'SECOND_HALF';
  }

  return undefined;
}

/**
 * Extracts guest count strictly from vendor's explicit instruction
 * Never invents or assumes a number
 */
export function extractGuests(text: string): number | undefined {
  const normalized = convertSpokenNumberWords(normalizeDevanagariNumerals(text.toLowerCase()));

  // 1. Prefix pattern: "guest count is 600", "guest count: 600", "guests are 600", "actually the guest count is 600"
  const prefixMatch = normalized.match(
    /(?:guest\s*count(?:\s*is|\s*to)?|guests?(?:\s*are|\s*is|\s*:)?|पाहुण्यांची\s*संख्या(?:\s*आहे)?|मेहमानों?\s*की\s*संख्या(?:\s*है)?|logon\s*ki\s*sankhya)\s*[:=\-]?\s*(\d{2,5})/i
  );
  if (prefixMatch) return parseInt(prefixMatch[1], 10);

  // 2. Explicit patterns: "500 guests", "500 पाहुणे", "500 मेहमान", "500 pax", "500 people", "500 log", "500 lok"
  const match = normalized.match(
    /(?:^|[^\d])(\d{2,5})\s*(?:guests?|people|persons?|pax|log|लोग|lok|लोक|मेहमान(?:ों)?|पाहुणे|पाहुण्यांचे|पाहुण्यांसाठी|पाहुण्यांना)(?:[^\w\u0900-\u097F]|$)/i
  );
  if (match) return parseInt(match[1], 10);

  // 3. If text says "for 500 at 500 per plate" or "for 500 people"
  const forMatch = normalized.match(/(?:for|साठी|के लिए)\s+(\d{2,5})\s+(?:guests?|people|log|lok|पाहुणे|मेहमान|at|@|दर|भाव|रेट)?/i);
  if (forMatch) {
    const val = parseInt(forMatch[1], 10);
    if (val >= 20 && val <= 10000) return val;
  }

  return undefined;
}

/**
 * Extracts price per plate / per head / per person rate
 * Matches: "at ₹500 per plate", "500 per plate", "₹1,200/plate", "1200 प्रति प्लेट", "500 प्लेट प्रमाणे", "pratyek plate 700 rupaye"
 */
export function extractPricePerPlate(text: string): number | undefined {
  const normalized = convertSpokenNumberWords(normalizeDevanagariNumerals(text.toLowerCase()));

  // 1. Direct rate assignment: "price per plate is 800", "rate per plate is 1200", "plate rate 700"
  const directMatch = normalized.match(
    /(?:price\s*per\s*plate|rate\s*per\s*plate|per\s*plate\s*rate|plate\s*rate|दर\s*प्रति\s*प्लेट|प्रति\s*प्लेट\s*दर)\s*(?:is|to|:|as)?\s*(?:₹|rs\.?|inr|रुपये)?\s*(\d{1,2}(?:,\d{2})*,\d{3}|\d{1,3}(?:,\d{3})+|\d{2,6})/i
  );
  if (directMatch) {
    const cleanNum = directMatch[1].replace(/,/g, '');
    const val = parseInt(cleanNum, 10);
    if (val > 0) return val;
  }

  // 2. Standard format: "₹1,200 per plate", "500 rupees per plate", "1200 प्रति प्लेट", "500 प्लेट प्रमाणे"
  const perPlateMatch = normalized.match(
    /(?:at|@|दर|भाव|रेट)?\s*(?:₹|rs\.?|inr|रुपये)?\s*(\d{1,2}(?:,\d{2})*,\d{3}|\d{1,3}(?:,\d{3})+|\d{2,6})\s*(?:₹|rs\.?|rupees|रुपये)?\s*(?:per\s*(?:plate|head|pax|person|thali|guest)|प्रति\s*(?:प्लेट|थाळी|व्यक्ती)|दर\s*(?:प्लेट|थाळी|व्यक्ती)|पर\s*(?:प्लेट|थाळी|व्यक्ती)|प्रत्येक\s*(?:प्लेट|थाळी|व्यक्ती)|pratyek\s*(?:plate|head|pax|person|thali|guest)|\/\s*(?:plate|head|pax|person|thali)|प्लेट\s*प्रमाणे)/i
  );

  if (perPlateMatch) {
    const cleanNum = perPlateMatch[1].replace(/,/g, '');
    const val = parseInt(cleanNum, 10);
    if (val > 0) return val;
  }

  // 3. Reversed format: "per plate ₹500", "per plate 800", "pratyek plate 700", "प्रति प्लेट 500", "/ plate 1200"
  const reversedMatch = normalized.match(
    /(?:per\s*(?:plate|head|pax|person|thali|guest)|प्रति\s*(?:प्लेट|थाळी|व्यक्ती)|दर\s*(?:प्लेट|थाळी|व्यक्ती)|पर\s*(?:प्लेट|थाळी|व्यक्ती)|प्रत्येक\s*(?:प्लेट|थाळी|व्यक्ती)|pratyek\s*(?:plate|head|pax|person|thali|guest)|\/\s*(?:plate|head|pax|person|thali)|प्लेट\s*प्रमाणे)\s*(?:at|@|दर|भाव|रेट|is|to|as)?\s*(?:₹|rs\.?|inr|रुपये)?\s*(\d{1,2}(?:,\d{2})*,\d{3}|\d{1,3}(?:,\d{3})+|\d{2,6})/i
  );

  if (reversedMatch) {
    const cleanNum = reversedMatch[1].replace(/,/g, '');
    const val = parseInt(cleanNum, 10);
    if (val > 0) return val;
  }

  return undefined;
}

/**
 * Extracts currency amount (supports numbers, lakh/लाख)
 */
export function extractAmount(text: string): number | undefined {
  const normalized = convertSpokenNumberWords(normalizeDevanagariNumerals(text.toLowerCase()));

  // Check for lakh / lacs (e.g. "4.5 lakh", "4.5 लाख", "4 लाख")
  const lakhMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|लाख)/i);
  if (lakhMatch) {
    return Math.round(parseFloat(lakhMatch[1]) * 100000);
  }

  // Check for Indian currency format (e.g. 4,50,000) or standard format (e.g. 450,000) or plain digits
  const currencyMatch = normalized.match(
    /(?:₹|rs\.?|inr|रुपये)?\s*(\d{1,2}(?:,\d{2})*,\d{3}|\d{1,3}(?:,\d{3})+|\d{4,8})/i
  );
  if (currencyMatch) {
    const cleanNum = currencyMatch[1].replace(/,/g, '');
    const val = parseInt(cleanNum, 10);
    if (val >= 1000) return val;
  }

  return undefined;
}

/**
 * Extracts explicitly specified additional charges, taxes, or setup fees.
 * Never invents unspecified charges!
 */
export function extractAdditionalCharges(text: string): number {
  const normalized = convertSpokenNumberWords(normalizeDevanagariNumerals(text.toLowerCase()));

  const chargesMatch = normalized.match(
    /(?:plus|and|\+)?\s*(?:₹|rs\.?|inr|रुपये)?\s*(\d{1,2}(?:,\d{2})*|\d{3,6})\s*(?:setup|logistics|extra|charges|taxes|टॅक्स|खर्च)/i
  );
  if (chargesMatch) {
    const clean = chargesMatch[1].replace(/,/g, '');
    return parseInt(clean, 10) || 0;
  }

  return 0; // Strictly does not invent charges
}

/**
 * Main Multilingual NLU Parser with Strict Parameter Extraction, Context State Retention & Clarification Prompts
 */
export function parseVendorVoiceCommand(
  input: string,
  preferredLang: VoiceLanguage = 'en',
  referenceDate?: Date,
  context?: VendorConversationContext
): ParsedVoiceCommand {
  const text = input.trim();
  const lower = text.toLowerCase();

  // 1. Automatic Language Detection
  const detectedLang = detectLanguage(text, preferredLang);

  const extractedDate = extractDateFromText(text, referenceDate);
  const extractedSlot = extractSlotFromText(text);
  let extractedGuests = extractGuests(text);
  let extractedPricePerPlate = extractPricePerPlate(text);
  const rawAmount = extractAmount(text);
  const extractedAdditionalCharges = extractAdditionalCharges(text);

  // If in missingField clarification state, extract simple numeric answer
  if (extractedGuests === undefined && context?.missingField === 'guestCount') {
    const numMatch = text.match(/\b(\d{2,5})\b/);
    if (numMatch) {
      extractedGuests = parseInt(numMatch[1], 10);
    }
  }

  if (extractedPricePerPlate === undefined && context?.missingField === 'pricePerPlate') {
    const numMatch = text.match(/\b(\d{2,6})\b/);
    if (numMatch) {
      extractedPricePerPlate = parseInt(numMatch[1], 10);
    }
  }

  // Context retention:
  // If an explicit date was extracted from the current utterance, it overrides previous context (e.g. date override).
  // If no date was extracted in this utterance, retain the date established in previous turns of the conversation context.
  const date = extractedDate || context?.date;
  const slot = extractedSlot || context?.slot;
  const guestCount = extractedGuests ?? context?.guestCount;
  const pricePerPlate = extractedPricePerPlate ?? context?.pricePerPlate;
  const additionalCharges = extractedAdditionalCharges || (context?.additionalCharges || 0);

  // Intent 1: Review Quotation
  if (
    lower.includes('review quote') ||
    lower.includes('review quotation') ||
    lower.includes('open quote') ||
    lower.includes('open quotation') ||
    lower.includes('कोटेशन रिव्यू') ||
    lower.includes('कोटेशन तपासा') ||
    lower.includes('कोटेशन पहा') ||
    lower.includes('कोटेशन दाखवा') ||
    lower.includes('कोटेशन जांच')
  ) {
    return {
      intent: 'REVIEW_QUOTE',
      rawText: text,
      detectedLang,
    };
  }

  // Intent 2: Create Provisional Quotation / Perform Calculation
  const isQuotationIntent =
    lower.includes('quotation') ||
    lower.includes('quote') ||
    lower.includes('calculate') ||
    lower.includes('कोटेशन') ||
    lower.includes('प्रपोजल') ||
    lower.includes('दरपत्रक') ||
    lower.includes('हिसाब') ||
    lower.includes('गणना') ||
    extractedPricePerPlate !== undefined ||
    (extractedGuests !== undefined && (lower.includes('plate') || lower.includes('प्लेट') || lower.includes('per') || lower.includes('दर') || lower.includes('भाव'))) ||
    // Continuation/correction in quote context:
    (context?.intent === 'CREATE_QUOTE' && (extractedGuests !== undefined || extractedPricePerPlate !== undefined || lower.includes('actually') || lower.includes('make it') || lower.includes('count is') || lower.includes('rate is'))) ||
    (context?.missingField === 'guestCount' && extractedGuests !== undefined) ||
    (context?.missingField === 'pricePerPlate' && (extractedPricePerPlate !== undefined || rawAmount !== undefined)) ||
    (context?.pricePerPlate !== undefined && extractedGuests !== undefined) ||
    (context?.guestCount !== undefined && extractedPricePerPlate !== undefined);

  if (isQuotationIntent) {
    // Check if client name is explicitly mentioned
    let clientName: string | undefined;
    const forMatch = text.match(/(?:for|लागी|साठी|के लिए)\s+([A-Za-z\u0900-\u097F\s]{2,25})/i);
    if (forMatch) {
      const candidate = forMatch[1].trim();
      // Only set if not matching guest/number words
      if (!candidate.match(/^\d+/) && !candidate.toLowerCase().includes('guest') && !candidate.toLowerCase().includes('people')) {
        clientName = candidate;
      }
    }

    // Validation & Clarification: Do not invent missing values!
    if (pricePerPlate !== undefined && guestCount === undefined) {
      return {
        intent: 'NEED_CLARIFICATION',
        rawText: text,
        detectedLang,
        missingField: 'guestCount',
        pricePerPlate,
        clarificationPrompt:
          detectedLang === 'mr'
            ? 'कृपया कोटेशनसाठी पाहुण्यांची अचूक संख्या सांगा.'
            : detectedLang === 'hi'
            ? 'कृपया कोटेशन के लिए सटीक मेहमान संख्या बताएं।'
            : 'Could you please confirm the exact guest count for the quotation?',
      };
    }

    if (guestCount !== undefined && pricePerPlate === undefined && rawAmount === undefined) {
      return {
        intent: 'NEED_CLARIFICATION',
        rawText: text,
        detectedLang,
        missingField: 'pricePerPlate',
        guestCount,
        clarificationPrompt:
          detectedLang === 'mr'
            ? `${guestCount} पाहुण्यांसाठी प्रति प्लेट काय दर ठेवायचा आहे?`
            : detectedLang === 'hi'
            ? `${guestCount} मेहमानों के लिए प्रति प्लेट दर क्या होगी?`
            : `What is the price per plate for the ${guestCount} guests?`,
      };
    }

    if (guestCount === undefined && pricePerPlate === undefined && rawAmount === undefined) {
      return {
        intent: 'NEED_CLARIFICATION',
        rawText: text,
        detectedLang,
        missingField: 'guestCount',
        clarificationPrompt:
          detectedLang === 'mr'
            ? 'कृपया कोटेशन तयार करण्यासाठी पाहुण्यांची संख्या आणि प्रति प्लेट दर सांगा.'
            : detectedLang === 'hi'
            ? 'कृपया कोटेशन बनाने के लिए मेहमान संख्या और प्रति प्लेट दर बताएं।'
            : 'Please provide the number of guests and price per plate to generate your quotation.',
      };
    }

    // Deterministic Calculation
    let subtotal = 0;
    let totalAmount = 0;
    let hasPerPlate = false;

    if (guestCount && pricePerPlate) {
      const calc = calculateQuotation({
        guestCount,
        pricePerPlate,
        additionalCharges,
      });
      subtotal = calc.subtotal;
      totalAmount = calc.totalAmount;
      hasPerPlate = true;
    } else if (rawAmount !== undefined) {
      subtotal = rawAmount;
      totalAmount = rawAmount + additionalCharges;
    }

    return {
      intent: 'CREATE_QUOTE',
      rawText: text,
      detectedLang,
      clientName: clientName || context?.clientName || 'Client Quotation',
      guestCount,
      pricePerPlate,
      subtotal,
      quotedAmount: totalAmount,
      additionalCharges,
      hasPerPlateCalculation: hasPerPlate,
      date: date || '2026-12-15',
    };
  }

  // Intent 3: Slot Booking (explicit slot or "book" action)
  if (
    lower.includes('book') ||
    lower.includes('reserve') ||
    lower.includes('बुक') ||
    lower.includes('राखीव') ||
    lower.includes('आरक्षित')
  ) {
    if (!date) {
      return {
        intent: 'NEED_CLARIFICATION',
        rawText: text,
        detectedLang,
        missingField: 'date',
        clarificationPrompt:
          detectedLang === 'mr'
            ? 'तुम्हाला कोणत्या तारखेसाठी स्लॉट बुक करायचा आहे?'
            : detectedLang === 'hi'
            ? 'आप किस तारीख के लिए स्लॉट बुक करना चाहते हैं?'
            : 'For which date would you like to book the slot?',
      };
    }

    return {
      intent: 'BOOK_SLOT',
      rawText: text,
      detectedLang,
      date,
      slot: slot || 'FIRST_HALF',
    };
  }

  // Intent 4: Check Availability
  // Matches "availability", "free", "status", "check", "उपलब्ध", "तपासा", "तपास", "बघा", "चेक", etc.
  // Also activates on follow-up slot inquiries or date overrides when prior context was CHECK_AVAILABILITY
  const isAvailabilityInquiry =
    lower.includes('availab') ||
    lower.includes('free') ||
    lower.includes('status') ||
    lower.includes('check') ||
    lower.includes('उपलब्ध') ||
    lower.includes('खाली') ||
    lower.includes('तपासा') ||
    lower.includes('तपास') ||
    lower.includes('बघा') ||
    lower.includes('बघ') ||
    lower.includes('सांगा') ||
    lower.includes('सांग') ||
    lower.includes('चेक') ||
    (context?.intent === 'CHECK_AVAILABILITY' && (extractedDate !== undefined || extractedSlot !== undefined)) ||
    (context?.intent === 'CHECK_AVAILABILITY' && (
      lower.includes('morning') ||
      lower.includes('afternoon') ||
      lower.includes('evening') ||
      lower.includes('सकाळ') ||
      lower.includes('दुपार') ||
      lower.includes('संध्याकाळ') ||
      lower.includes('सुबह') ||
      lower.includes('शाम')
    ));

  if (isAvailabilityInquiry) {
    if (!date) {
      return {
        intent: 'NEED_CLARIFICATION',
        rawText: text,
        detectedLang,
        missingField: 'date',
        clarificationPrompt:
          detectedLang === 'mr'
            ? 'कृपया ज्या तारखेची उपलब्धता तपासायची आहे ती तारीख सांगा.'
            : detectedLang === 'hi'
            ? 'कृपया वह तारीख बताएं जिसकी उपलब्धता आप देखना चाहते हैं।'
            : 'Please specify the date you would like to check availability for.',
      };
    }

    return {
      intent: 'CHECK_AVAILABILITY',
      rawText: text,
      detectedLang,
      date,
      slot,
    };
  }

  // Intent 5: Navigation
  if (lower.includes('calendar') || lower.includes('कैलेंडर') || lower.includes('कॅलेंडर')) {
    return { intent: 'NAVIGATE_CALENDAR', rawText: text, detectedLang, targetTab: 'calendar' };
  }
  if (lower.includes('inquir') || lower.includes('चौकशा') || lower.includes('इंक्वायरी')) {
    return { intent: 'NAVIGATE_INQUIRIES', rawText: text, detectedLang, targetTab: 'inquiries' };
  }
  if (lower.includes('booking') || lower.includes('बुकिंग')) {
    return { intent: 'NAVIGATE_BOOKINGS', rawText: text, detectedLang, targetTab: 'bookings' };
  }

  // Intent 6: Help
  if (
    lower.includes('help') ||
    lower.includes('what can you do') ||
    lower.includes('मदत') ||
    lower.includes('मदद')
  ) {
    return { intent: 'HELP', rawText: text, detectedLang };
  }

  return {
    intent: 'UNKNOWN',
    rawText: text,
    detectedLang,
  };
}

/**
 * Generates concise, professional, contextual response in English, Hindi, or Marathi
 */
export function generateVoiceResponse(
  parsed: ParsedVoiceCommand,
  context: {
    vendorBusinessName: string;
    vendorCategory: string;
    availabilityStatus?: string;
    firstHalfBooked?: boolean;
    secondHalfBooked?: boolean;
    conflictReason?: string;
  }
): { message: string; speechText: string } {
  const lang = parsed.detectedLang;

  // Clarification
  if (parsed.intent === 'NEED_CLARIFICATION' && parsed.clarificationPrompt) {
    return {
      message: parsed.clarificationPrompt,
      speechText: parsed.clarificationPrompt,
    };
  }

  switch (parsed.intent) {
    case 'CHECK_AVAILABILITY': {
      const d = parsed.date;
      if (!d) {
        const msg =
          lang === 'mr'
            ? 'कृपया ज्या तारखेची उपलब्धता तपासायची आहे ती तारीख सांगा.'
            : lang === 'hi'
            ? 'कृपया वह तारीख बताएं जिसकी उपलब्धता आप देखना चाहते हैं।'
            : 'Please specify the date you would like to check availability for.';
        return { message: msg, speechText: msg };
      }

      const fBooked = context.firstHalfBooked;
      const sBooked = context.secondHalfBooked;
      const dateFormatted = formatDateHuman(d, lang);

      // Specific Slot: FIRST_HALF
      if (parsed.slot === 'FIRST_HALF') {
        if (lang === 'mr') {
          const status = fBooked
            ? `तुमचा ${dateFormatted} रोजी फर्स्ट-हाफ स्लॉट आधीच बुक आहे.`
            : `तुमचा ${dateFormatted} रोजी फर्स्ट-हाफ स्लॉट उपलब्ध आहे.`;
          const msg = `नक्की, मी ${dateFormatted} ची उपलब्धता तपासतो. ${status}`;
          return { message: msg, speechText: status };
        }
        if (lang === 'hi') {
          const status = fBooked
            ? `आपका ${dateFormatted} को फर्स्ट-हाफ स्लॉट पहले से बुक है।`
            : `आपका ${dateFormatted} को फर्स्ट-हाफ स्लॉट उपलब्ध है।`;
          const msg = `ज़रूर, मैं ${dateFormatted} की उपलब्धता चेक करता हूँ। ${status}`;
          return { message: msg, speechText: status };
        }
        const status = fBooked
          ? `Your first-half slot on ${dateFormatted} is already booked.`
          : `Your first-half slot on ${dateFormatted} is available.`;
        const msg = `Sure, I'll check your availability for ${dateFormatted}. ${status}`;
        return { message: msg, speechText: status };
      }

      // Specific Slot: SECOND_HALF
      if (parsed.slot === 'SECOND_HALF') {
        if (lang === 'mr') {
          const status = sBooked
            ? `तुमचा ${dateFormatted} रोजी सेकंड-हाफ स्लॉट आधीच बुक आहे.`
            : `तुमचा ${dateFormatted} रोजी सेकंड-हाफ स्लॉट उपलब्ध आहे.`;
          const msg = `नक्की, मी ${dateFormatted} ची उपलब्धता तपासतो. ${status}`;
          return { message: msg, speechText: status };
        }
        if (lang === 'hi') {
          const status = sBooked
            ? `आपका ${dateFormatted} को सेकंड-हाफ स्लॉट पहले से बुक है।`
            : `आपका ${dateFormatted} को सेकंड-हाफ स्लॉट उपलब्ध है।`;
          const msg = `ज़रूर, मैं ${dateFormatted} की उपलब्धता चेक करता हूँ। ${status}`;
          return { message: msg, speechText: status };
        }
        const status = sBooked
          ? `Your second-half slot on ${dateFormatted} is already booked.`
          : `Your second-half slot on ${dateFormatted} is available.`;
        const msg = `Sure, I'll check your availability for ${dateFormatted}. ${status}`;
        return { message: msg, speechText: status };
      }

      // General / Full Day Slot Status
      if (lang === 'mr') {
        let statusMsg = '';
        if (fBooked && sBooked) {
          statusMsg = 'दोन्ही स्लॉट (फर्स्ट हाफ आणि सेकंड हाफ) पूर्णपणे बुक आहेत.';
        } else if (fBooked) {
          statusMsg = 'फर्स्ट हाफ बुक आहे, परंतु सेकंड हाफ उपलब्ध आहे.';
        } else if (sBooked) {
          statusMsg = 'सेकंड हाफ बुक आहे, परंतु फर्स्ट हाफ उपलब्ध आहे.';
        } else {
          statusMsg = 'तुमचे दोन्ही स्लॉट (फर्स्ट हाफ व सेकंड हाफ) उपलब्ध आहेत.';
        }
        const msg = `नक्की, मी ${dateFormatted} ची उपलब्धता तपासतो. ${dateFormatted} रोजी ${statusMsg}`;
        return { message: msg, speechText: msg };
      }

      if (lang === 'hi') {
        let statusMsg = '';
        if (fBooked && sBooked) {
          statusMsg = 'दोनों स्लॉट्स (फर्स्ट हाफ और सेकंड हाफ) पूरी तरह से बुक हैं।';
        } else if (fBooked) {
          statusMsg = 'फर्स्ट हाफ बुक है, लेकिन सेकंड हाफ उपलब्ध है।';
        } else if (sBooked) {
          statusMsg = 'सेकंड हाफ बुक है, लेकिन फर्स्ट हाफ उपलब्ध है।';
        } else {
          statusMsg = 'आपके दोनों स्लॉट्स (फर्स्ट हाफ और सेकंड हाफ) उपलब्ध हैं।';
        }
        const msg = `ज़रूर, मैं ${dateFormatted} की उपलब्धता चेक करता हूँ। ${dateFormatted} को ${statusMsg}`;
        return { message: msg, speechText: msg };
      }

      // English
      let statusMsg = '';
      if (fBooked && sBooked) {
        statusMsg = 'both First Half and Second Half slots are fully booked.';
      } else if (fBooked) {
        statusMsg = 'First Half is booked, but Second Half is available.';
      } else if (sBooked) {
        statusMsg = 'Second Half is booked, but First Half is available.';
      } else {
        statusMsg = 'both First Half and Second Half slots are available.';
      }
      const msg = `Sure, I'll check your availability for ${dateFormatted}. On ${dateFormatted}, ${statusMsg}`;
      return { message: msg, speechText: msg };
    }

    case 'BOOK_SLOT': {
      const d = parsed.date;
      if (!d) {
        const msg =
          lang === 'mr'
            ? 'तुम्हाला कोणत्या तारखेसाठी स्लॉट बुक करायचा आहे?'
            : lang === 'hi'
            ? 'आप किस तारीख के लिए स्लॉट बुक करना चाहते हैं?'
            : 'For which date would you like to book the slot?';
        return { message: msg, speechText: msg };
      }

      const slotLabel =
        parsed.slot === 'FIRST_HALF'
          ? 'First Half'
          : parsed.slot === 'SECOND_HALF'
          ? 'Second Half'
          : 'Full Day';
      const dateFormatted = formatDateHuman(d, lang);

      if (context.conflictReason) {
        if (lang === 'mr') {
          const msg = `शेड्यूलिंग अडथळा: ${context.conflictReason} कृपया दुसरा स्लॉट किंवा तारीख निवडा.`;
          return { message: msg, speechText: msg };
        }
        if (lang === 'hi') {
          const msg = `शेड्यूलिंग कॉन्फ्लिक्ट: ${context.conflictReason} कृपया दूसरा स्लॉट या तारीख चुनें।`;
          return { message: msg, speechText: msg };
        }
        const msg = `Scheduling conflict: ${context.conflictReason} Please select an alternate slot or date.`;
        return { message: msg, speechText: msg };
      }

      if (lang === 'mr') {
        const msg = `${dateFormatted} साठी ${slotLabel} स्लॉट उपलब्ध आहे. बुकिंग अंतिम करण्यासाठी खाली पुष्टी करा.`;
        return { message: msg, speechText: msg };
      }
      if (lang === 'hi') {
        const msg = `${dateFormatted} के लिए ${slotLabel} स्लॉट उपलब्ध है। बुकिंग पक्की करने के लिए कृपया नीचे कन्फर्म करें।`;
        return { message: msg, speechText: msg };
      }
      const msg = `${slotLabel} on ${dateFormatted} is available. Please confirm below to lock this booking.`;
      return { message: msg, speechText: msg };
    }

    case 'CREATE_QUOTE': {
      const guests = parsed.guestCount;
      const rate = parsed.pricePerPlate;
      const totalAmt = parsed.quotedAmount || (guests && rate ? guests * rate : 0);
      const amtStr = `₹${totalAmt.toLocaleString('en-IN')}`;

      if (lang === 'mr') {
        if (rate && guests) {
          const msg = `${guests} पाहुण्यांसाठी ₹${rate?.toLocaleString('en-IN')} प्रति प्लेट प्रमाणे तुमचे तात्पुरते कोटेशन ${amtStr} आहे. आपण याची तपासणी करू इच्छिता का?`;
          return { message: msg, speechText: msg };
        }
        const msg = `${parsed.serviceCategory || 'सेवे'}साठी तुमचे तात्पुरते कोटेशन ${amtStr} आहे. आपण याची तपासणी करू इच्छिता का?`;
        return { message: msg, speechText: msg };
      }

      if (lang === 'hi') {
        if (rate && guests) {
          const msg = `${guests} मेहमानों का ₹${rate?.toLocaleString('en-IN')} प्रति प्लेट के हिसाब से आपका प्रोविज़नल कोटेशन ${amtStr} है। क्या आप इसकी समीक्षा करना चाहते हैं?`;
          return { message: msg, speechText: msg };
        }
        const msg = `${parsed.serviceCategory || 'सेवा'} के लिए आपका प्रोविज़नल कोटेशन ${amtStr} है। क्या आप इसकी समीक्षा करना चाहते हैं?`;
        return { message: msg, speechText: msg };
      }

      // English - Exact requested response style:
      // "Your provisional quotation for 500 guests at ₹500 per plate is ₹2,50,000. Would you like to review it?"
      if (rate && guests) {
        const msg = `Your provisional quotation for ${guests} guests at ₹${rate?.toLocaleString('en-IN')} per plate is ${amtStr}. Would you like to review it?`;
        return { message: msg, speechText: msg };
      }
      const msg = `Your provisional quotation for ${parsed.serviceCategory || 'the requested services'} is ${amtStr}. Would you like to review it?`;
      return { message: msg, speechText: msg };
    }

    case 'REVIEW_QUOTE': {
      if (lang === 'mr') {
        const msg = `कोटेशन पुनरावलोकन स्क्रीन उघडली आहे. आपण दर व अटी तपासून मंजुरी देऊ शकता.`;
        return { message: msg, speechText: msg };
      }
      if (lang === 'hi') {
        const msg = `कोटेशन रिव्यू स्क्रीन खुल गई है। आप विवरण जांचकर इसे ग्राहक को भेज सकते हैं।`;
        return { message: msg, speechText: msg };
      }
      const msg = `Opening the Quotation Review view. You can verify scope, adjust pricing, and approve dispatch.`;
      return { message: msg, speechText: msg };
    }

    case 'NAVIGATE_CALENDAR': {
      if (lang === 'mr') return { message: 'तुमचे उपलब्धता कॅलेंडर उघडत आहे.', speechText: 'कॅलेंडर उघडले आहे.' };
      if (lang === 'hi') return { message: 'आपका उपलब्धता कैलेंडर खोला जा रहा है।', speechText: 'कैलेंडर खुल गया है।' };
      return { message: 'Navigating to your Interactive Availability Calendar.', speechText: 'Opening your calendar.' };
    }

    case 'NAVIGATE_INQUIRIES': {
      if (lang === 'mr') return { message: 'तुमच्या चौकशा सूचीकडे नेले जात आहे.', speechText: 'चौकशा उघडल्या आहेत.' };
      if (lang === 'hi') return { message: 'आपकी इन्क्वायरी सूची खोली जा रही है।', speechText: 'इन्क्वायरी खुल गई है।' };
      return { message: 'Navigating to your Inquiries List.', speechText: 'Opening inquiries.' };
    }

    case 'NAVIGATE_BOOKINGS': {
      if (lang === 'mr') return { message: 'तुमच्या बुकिंग व्यवस्थापनाकडे नेले जात आहे.', speechText: 'बुकिंग उघडले आहे.' };
      if (lang === 'hi') return { message: 'आपके बुकिंग प्रबंधन पर ले जाया जा रहा है।', speechText: 'बुकिंग खुल गई है।' };
      return { message: 'Navigating to your Bookings Manager.', speechText: 'Opening bookings.' };
    }

    case 'HELP': {
      if (lang === 'mr') {
        const msg =
          'मी उपलब्धता तपासणे, फर्स्ट/सेकंड हाफ स्लॉट बुक करणे आणि कोटेशनची गणना करण्यात मदत करू शकतो. आपण इंग्रजी, हिंदी किंवा मराठीत बोलू शकता.';
        return { message: msg, speechText: msg };
      }
      if (lang === 'hi') {
        const msg =
          'मैं उपलब्धता जांचने, फर्स्ट/सेकंड हाफ स्लॉट बुक करने और कोटेशन की गणना करने में मदद कर सकता हूँ। आप अंग्रेजी, हिंदी या मराठी में बोल सकते हैं।';
        return { message: msg, speechText: msg };
      }
      const msg =
        'I can help you check calendar availability, stage First/Second Half slot bookings, and calculate provisional quotations. Speak in English, Hindi, or Marathi.';
      return { message: msg, speechText: msg };
    }

    default: {
      if (lang === 'mr') {
        const msg =
          'मला तुमची आज्ञा स्पष्टपणे समजली नाही. कृपया उपलब्धता तारीख, स्लॉट बुकिंग किंवा कोटेशन (पाहुणे व दर) बद्दल सांगा.';
        return { message: msg, speechText: msg };
      }
      if (lang === 'hi') {
        const msg =
          'मुझे आपका निर्देश स्पष्ट रूप से समझ नहीं आया। कृपया तारीख की उपलब्धता, स्लॉट बुकिंग या कोटेशन (मेहमान और प्रति प्लेट दर) बताएं।';
        return { message: msg, speechText: msg };
      }
      const msg =
        'I could not fully understand your command. Please specify a date for availability, a slot to book, or guest count and price per plate for a quotation.';
      return { message: msg, speechText: msg };
    }
  }
}
