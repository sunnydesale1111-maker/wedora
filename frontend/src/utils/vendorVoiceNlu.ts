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
      'करा', 'तपासा', 'डिसेंबर', 'पाहुणे', 'पाहुण्यांसाठी', 'पाहुण्यांचे', 'पाहुण्यांना',
      'चौकशा', 'कॅलेंडर', 'आहे', 'नाही', 'सांगा', 'साठी', 'बनवा', 'दाखवा', 'पहा',
      'पुनरावलोकन', 'दिवस', 'सकाळ', 'दुपार', 'संध्याकाळ', 'पहिला', 'दुसरा', 'दोन्ही',
      'प्रमाणे', 'दर थाळी', 'थाळी', 'दर प्लेट', 'लाख'
    ];
    for (const kw of marathiKeywords) {
      if (normalized.includes(kw)) return 'mr';
    }

    // Distinct Hindi keywords
    const hindiKeywords = [
      'करो', 'बताओ', 'बताइए', 'दिसंबर', 'मेहमान', 'मेहमानों', 'पूछताछ', 'कैलेंडर',
      'है', 'नहीं', 'दिखाओ', 'बनाओ', 'जांच', 'दिन', 'सुबह', 'शाम', 'पहला', 'दूसरा',
      'दोनों', 'के लिए', 'प्रति प्लेट', 'पर प्लेट'
    ];
    for (const kw of hindiKeywords) {
      if (normalized.includes(kw)) return 'hi';
    }

    // Default Devanagari
    return 'hi';
  }

  // 2. Transliterated Latin script (Code-switching / Hinglish / Marathiglish)
  const marathiTranslit = /\b(sathi|tapaasa|tapas|ahe|kara|banva|dakhva|pahune|divas|madat|dusra|pahila|donhi|pramane)\b/i;
  if (marathiTranslit.test(normalized)) {
    return 'mr';
  }

  const hindiTranslit = /\b(karo|batao|bataiye|ke\s*liye|mehmaan|hai|kya|banao|dikhaye|dekho|chahiye|pehle|dusre|dono|madad)\b/i;
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
 * Parses dates in English, Hindi, and Marathi with relative date support
 * Resolves relative dates against the current Asia/Kolkata date
 */
export function extractDateFromText(text: string, referenceDate?: Date): string | undefined {
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

  // "next Friday", "next Saturday", etc.
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const nextDayMatch = normalized.match(
    /\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i
  );
  if (nextDayMatch) {
    const targetDay = daysOfWeek.indexOf(nextDayMatch[1].toLowerCase());
    if (targetDay !== -1) {
      const d = new Date(ref);
      const currentDay = d.getDay();
      let diff = targetDay - currentDay;
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

  // Month dictionary across 3 languages
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
    // Hindi
    जनवरी: '01', फरवरी: '02', मार्च: '03', अप्रैल: '04', मई: '05', जून: '06',
    जुलाई: '07', अगस्त: '08', सितंबर: '09', सितम्बर: '09', अक्टूबर: '10', नवंबर: '11', नवम्बर: '11', दिसंबर: '12', दिसम्बर: '12',
    // Marathi
    जानेवारी: '01', फेब्रुवारी: '02', एप्रिल: '04', मे: '05', जुलै: '07',
    ऑगस्ट: '08', सप्टेंबर: '09', ऑक्टोबर: '10', नोव्हेंबर: '11', डिसेंबर: '12',
  };

  const monthNamesPattern = Object.keys(MONTH_MAP).join('|');

  // 4. Day + Month + Optional Year (e.g. "15 December 2026", "15 दिसंबर", "15 डिसेंबर 2026")
  const dayMonthRegex = new RegExp(
    `(?:^|[^\\d])(\\d{1,2})(?:st|nd|rd|th)?\\s+(${monthNamesPattern})(?:\\s+(202[5-9]))?(?:[^\\w\\u0900-\\u097F]|$)`,
    'i'
  );
  const dmMatch = normalized.match(dayMonthRegex);
  if (dmMatch) {
    const day = parseInt(dmMatch[1], 10);
    const mKey = dmMatch[2].toLowerCase();
    const month = MONTH_MAP[mKey];
    let year = dmMatch[3] || '2026';

    if (day >= 1 && day <= 31 && month) {
      return `${year}-${month}-${String(day).padStart(2, '0')}`;
    }
  }

  // 5. Month + Day + Optional Year (e.g. "December 15 2026", "दिसंबर 15")
  const monthDayRegex = new RegExp(
    `(?:^|[^\\w\\u0900-\\u097F])(${monthNamesPattern})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:\\s+(202[5-9]))?(?:[^\\w\\u0900-\\u097F]|$)`,
    'i'
  );
  const mdMatch = normalized.match(monthDayRegex);
  if (mdMatch) {
    const mKey = mdMatch[1].toLowerCase();
    const day = parseInt(mdMatch[2], 10);
    const month = MONTH_MAP[mKey];
    let year = mdMatch[3] || '2026';

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

  // Explicit patterns: "500 guests", "500 पाहुणे", "500 मेहमान", "500 pax", "500 people"
  const match = normalized.match(
    /(?:^|[^\d])(\d{2,5})\s*(?:guests?|people|persons?|pax|मेहमान(?:ों)?|पाहुणे|पाहुण्यांचे|पाहुण्यांसाठी|पाहुण्यांना|लोक)(?:[^\w\u0900-\u097F]|$)/i
  );
  if (match) return parseInt(match[1], 10);

  // If text says "for 500 at 500 per plate"
  const forMatch = normalized.match(/(?:for|साठी|के लिए)\s+(\d{2,5})\s+(?:guests?|at|@|दर|भाव|रेट)?/i);
  if (forMatch) {
    const val = parseInt(forMatch[1], 10);
    if (val >= 20 && val <= 10000) return val;
  }

  return undefined;
}

/**
 * Extracts price per plate / per head / per person rate
 * Matches: "at ₹500 per plate", "500 per plate", "₹1,200/plate", "1200 प्रति प्लेट", "500 प्लेट प्रमाणे"
 */
export function extractPricePerPlate(text: string): number | undefined {
  const normalized = convertSpokenNumberWords(normalizeDevanagariNumerals(text.toLowerCase()));

  const perPlateMatch = normalized.match(
    /(?:at|@|दर|भाव|रेट)?\s*(?:₹|rs\.?|inr|रुपये)?\s*(\d{1,2}(?:,\d{2})*,\d{3}|\d{1,3}(?:,\d{3})+|\d{2,6})\s*(?:₹|rs\.?|rupees|रुपये)?\s*(?:per\s*(?:plate|head|pax|person|thali|guest)|प्रति\s*(?:प्लेट|थाळी|व्यक्ती)|दर\s*(?:प्लेट|थाळी|व्यक्ती)|पर\s*(?:प्लेट|थाळी|व्यक्ती)|\/\s*(?:plate|head|pax|person|thali)|प्लेट\s*प्रमाणे)/i
  );

  if (perPlateMatch) {
    const cleanNum = perPlateMatch[1].replace(/,/g, '');
    const val = parseInt(cleanNum, 10);
    if (val > 0) return val;
  }

  // Reversed format: "per plate ₹500", "प्रति प्लेट 500", "/ plate 1200"
  const reversedMatch = normalized.match(
    /(?:per\s*(?:plate|head|pax|person|thali|guest)|प्रति\s*(?:प्लेट|थाळी|व्यक्ती)|दर\s*(?:प्लेट|थाळी|व्यक्ती)|पर\s*(?:प्लेट|थाळी|व्यक्ती)|\/\s*(?:plate|head|pax|person|thali)|प्लेट\s*प्रमाणे)\s*(?:at|@|दर|भाव|रेट)?\s*(?:₹|rs\.?|inr|रुपये)?\s*(\d{1,2}(?:,\d{2})*,\d{3}|\d{1,3}(?:,\d{3})+|\d{2,6})/i
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
 * Main Multilingual NLU Parser with Strict Parameter Extraction & Clarification Prompts
 */
export function parseVendorVoiceCommand(
  input: string,
  preferredLang: VoiceLanguage = 'en',
  referenceDate?: Date
): ParsedVoiceCommand {
  const text = input.trim();
  const lower = text.toLowerCase();

  // 1. Automatic Language Detection
  const detectedLang = detectLanguage(text, preferredLang);

  const date = extractDateFromText(text, referenceDate);
  const slot = extractSlotFromText(text);
  const guestCount = extractGuests(text);
  const pricePerPlate = extractPricePerPlate(text);
  const rawAmount = extractAmount(text);
  const additionalCharges = extractAdditionalCharges(text);

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
  if (
    lower.includes('quotation') ||
    lower.includes('quote') ||
    lower.includes('calculate') ||
    lower.includes('कोटेशन') ||
    lower.includes('प्रपोजल') ||
    lower.includes('दरपत्रक') ||
    lower.includes('हिसाब') ||
    lower.includes('गणना') ||
    pricePerPlate !== undefined ||
    (guestCount !== undefined && (lower.includes('plate') || lower.includes('प्लेट')))
  ) {
    // Check if client name is explicitly mentioned
    let clientName: string | undefined;
    const forMatch = text.match(/(?:for|लागी|साठी|के लिए)\s+([A-Za-z\u0900-\u097F\s]{2,25})/i);
    if (forMatch) {
      const candidate = forMatch[1].trim();
      // Only set if not matching guest/number words
      if (!candidate.match(/^\d+/) && !candidate.toLowerCase().includes('guest')) {
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
      clientName: clientName || 'Client Quotation',
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
  if (
    lower.includes('availab') ||
    lower.includes('free') ||
    lower.includes('status') ||
    lower.includes('उपलब्ध') ||
    lower.includes('खाली') ||
    lower.includes('तपासा') ||
    lower.includes('चेक')
  ) {
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

      if (lang === 'mr') {
        if (fBooked && sBooked) {
          const msg = `${dateFormatted} रोजी दोन्ही स्लॉट (फर्स्ट हाफ आणि सेकंड हाफ) पूर्णपणे बुक आहेत.`;
          return { message: msg, speechText: msg };
        }
        if (fBooked) {
          const msg = `${dateFormatted} रोजी फर्स्ट हाफ बुक आहे, परंतु सेकंड हाफ उपलब्ध आहे.`;
          return { message: msg, speechText: msg };
        }
        if (sBooked) {
          const msg = `${dateFormatted} रोजी सेकंड हाफ बुक आहे, परंतु फर्स्ट हाफ उपलब्ध आहे.`;
          return { message: msg, speechText: msg };
        }
        const msg = `${dateFormatted} रोजी तुमचे दोन्ही स्लॉट (फर्स्ट हाफ व सेकंड हाफ) उपलब्ध आहेत.`;
        return { message: msg, speechText: msg };
      }

      if (lang === 'hi') {
        if (fBooked && sBooked) {
          const msg = `${dateFormatted} के लिए दोनों स्लॉट्स (फर्स्ट हाफ और सेकंड हाफ) पूरी तरह से बुक हैं।`;
          return { message: msg, speechText: msg };
        }
        if (fBooked) {
          const msg = `${dateFormatted} को फर्स्ट हाफ बुक है, लेकिन सेकंड हाफ उपलब्ध है।`;
          return { message: msg, speechText: msg };
        }
        if (sBooked) {
          const msg = `${dateFormatted} को सेकंड हाफ बुक है, लेकिन फर्स्ट हाफ उपलब्ध है।`;
          return { message: msg, speechText: msg };
        }
        const msg = `${dateFormatted} के लिए आपके दोनों स्लॉट्स (फर्स्ट हाफ और सेकंड हाफ) उपलब्ध हैं।`;
        return { message: msg, speechText: msg };
      }

      // English
      if (fBooked && sBooked) {
        const msg = `On ${dateFormatted}, both First Half and Second Half slots are fully booked.`;
        return { message: msg, speechText: msg };
      }
      if (fBooked) {
        const msg = `On ${dateFormatted}, First Half is booked, but Second Half is available.`;
        return { message: msg, speechText: msg };
      }
      if (sBooked) {
        const msg = `On ${dateFormatted}, Second Half is booked, but First Half is available.`;
        return { message: msg, speechText: msg };
      }
      const msg = `On ${dateFormatted}, both First Half and Second Half slots are available.`;
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
        const msg = `${guests} पाहुण्यांसाठी ₹${rate?.toLocaleString('en-IN')} प्रति प्लेट प्रमाणे तुमचे तात्पुरते कोटेशन ${amtStr} आहे. आपण याची तपासणी करू इच्छिता का?`;
        return { message: msg, speechText: msg };
      }

      if (lang === 'hi') {
        const msg = `${guests} मेहमानों का ₹${rate?.toLocaleString('en-IN')} प्रति प्लेट के हिसाब से आपका प्रोविज़नल कोटेशन ${amtStr} है। क्या आप इसकी समीक्षा करना चाहते हैं?`;
        return { message: msg, speechText: msg };
      }

      // English - Exact requested response style:
      // "Your provisional quotation for 500 guests at ₹500 per plate is ₹2,50,000. Would you like to review it?"
      const msg = `Your provisional quotation for ${guests} guests at ₹${rate?.toLocaleString('en-IN')} per plate is ${amtStr}. Would you like to review it?`;
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
