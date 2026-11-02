/**
 * aiEventCreationEngine.ts
 *
 * Intelligent Conversational Event Creation Engine for Wedora Professional Event Organizers.
 * Supports:
 * - Event category detection: Wedding, Engagement, Reception, Griha Pravesh / Housewarming,
 *   Baby Shower / Dohale Jevan, Ganpati Festival, Birthday, Anniversary, Corporate, Religious, Custom.
 * - Dynamic event-specific questioning (Griha Pravesh never asks for bride/groom, Ganpati never asks wedding questions, etc.).
 * - Intelligent conversation memory (multi-detail extraction in a single turn).
 * - Real-time corrections without restarting the conversation.
 * - Smart progress stages: 1. Event Details (15%), 2. Client Details (30%), 3. Date & Venue (55%),
 *   4. Guests & Budget (75%), 5. Requirements (90%), 6. Review & Create (100%).
 * - Multilingual support: English, Hindi, and Marathi at 0.85x voice speed.
 */

import { VoiceLanguage } from './vendorVoiceNlu';
import { resolveLocality, ALL_LOCALITIES } from './localityRegistry';
import { City } from '@/types/vendor';

export type EventCategory =
  | 'wedding'
  | 'engagement'
  | 'reception'
  | 'griha_pravesh'
  | 'baby_shower'
  | 'ganpati_festival'
  | 'birthday'
  | 'anniversary'
  | 'corporate'
  | 'religious'
  | 'custom';

export type EventCreationStage =
  | 'event_details'
  | 'client_details'
  | 'date_and_venue'
  | 'guests_and_budget'
  | 'requirements'
  | 'review_and_create';

export interface EventCreationDraft {
  category?: EventCategory;
  eventType: string;
  eventName: string;

  // Specific to Weddings
  brideName?: string;
  groomName?: string;
  weddingFunctions?: string[];

  // Specific to Baby Shower / Birthday
  celebrantName?: string;

  // Specific to Griha Pravesh / Religious
  propertyAddress?: string;
  pujaArrangements?: boolean;

  // Specific to Ganpati Festival
  mandalOrClientName?: string;
  installationDate?: string;
  visarjanDate?: string;
  festivalDurationDays?: number;
  mandapDecorRequired?: boolean;
  soundLightingRequired?: boolean;
  prasadCateringRequired?: boolean;

  // Common Core Fields
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;
  isClientDifferentFromCelebrant?: boolean;

  eventDate?: string;
  isDateTentative?: boolean;

  city: City;
  area: string;
  venueStatus?: 'FINALIZED' | 'NOT_FINALIZED' | 'UNDECIDED';
  venueName?: string;
  venueAddress?: string;

  guestCount?: number;
  estimatedBudget?: number;

  cateringRequired?: boolean;
  decorationRequired?: boolean;
  photographyRequired?: boolean;
  specialRequirements?: string;

  status: 'IN_CONVERSATION' | 'READY_FOR_REVIEW' | 'CONFIRMED';
  currentStage: EventCreationStage;
  progressPercent: number;
  missingFields: string[];
}

export interface ConversationTurn {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  detectedLang?: VoiceLanguage;
}

export const OPENING_AI_MESSAGE =
  "Welcome to Wedora Event Creation! I'll help you set up your event. Tell me, what kind of event are you planning?";

export const REVIEW_READY_MESSAGE =
  "I've prepared your event details. Would you like to review anything before I create the event?";

/**
 * Detect language from text
 */
export function detectLanguage(text: string): VoiceLanguage {
  const devanagariRegex = /[\u0900-\u097F]/;
  if (!devanagariRegex.test(text)) {
    return 'en';
  }
  const marathiMarkers = /\b(आहे|नाही|आणि|करा|हवे|पाहिजे|केले|होते|लग्न|वाढदिवस|गृहप्रवेश|डोहाळे|बाप्पा|गणपती|तारीख|पाहुणे|बजेट|स्थळ|नक्की|ठरले|पुण्यात|मुंबईत)\b/i;
  const hindiMarkers = /\b(है|नहीं|और|करना|चाहिए|किया|था|शादी|विवाह|जन्मदिन|गृहप्रवेश|गोद|मेहमान|तारीख|स्थान|बजट|पुणे|मुंबई|नमस्ते)\b/i;

  if (marathiMarkers.test(text)) return 'mr';
  if (hindiMarkers.test(text)) return 'hi';
  return 'mr'; // default devanagari to mr in MH context
}

/**
 * Detect event category from natural text
 */
export function detectEventCategory(text: string): {
  category: EventCategory;
  eventTypeLabel: string;
} {
  const lower = text.toLowerCase();

  // Griha Pravesh / Housewarming
  if (
    /griha\s*pravesh|grihapravesh|house\s*warming|housewarming|vastu|vaastu|गृहप्रवेश|वास्तू|वास्तुशांती|गृह\s*प्रवेश/i.test(
      lower
    )
  ) {
    return { category: 'griha_pravesh', eventTypeLabel: 'Griha Pravesh / Housewarming' };
  }

  // Baby Shower / Dohale Jevan
  if (
    /baby\s*shower|dohale\s*jevan|dohale|godh\s*bharai|godhbharai|seemantham|डोहाळे\s*जेवण|डोहाळे|गोद\s*भराई|सीमंतोन्नयन/i.test(
      lower
    )
  ) {
    return { category: 'baby_shower', eventTypeLabel: 'Baby Shower / Dohale Jevan' };
  }

  // Ganpati Festival
  if (
    /ganpati|ganesh|ganeshotsav|ganesh\s*utsav|chaturthi|bappa|गणपती|गणेशोत्सव|गणेश\s*उत्सव|बाप्पा/i.test(
      lower
    )
  ) {
    return { category: 'ganpati_festival', eventTypeLabel: 'Ganpati Festival Celebration' };
  }

  // Birthday
  if (/birthday|bday|janmadin|vaadhdiwas|वाढदिवस|जन्मदिन/i.test(lower)) {
    return { category: 'birthday', eventTypeLabel: 'Birthday Celebration' };
  }

  // Anniversary
  if (/anniversary|सालगिरह|लग्नाचा\s*वाढदिवस/i.test(lower)) {
    return { category: 'anniversary', eventTypeLabel: 'Anniversary Celebration' };
  }

  // Engagement
  if (/engagement|sakharpuda|roka|sagayi|साखरपुडा|सगाई|वाग्दान/i.test(lower)) {
    return { category: 'engagement', eventTypeLabel: 'Engagement Ceremony' };
  }

  // Reception
  if (/reception|स्वागत\s*समारंभ|रिसेप्शन/i.test(lower)) {
    return { category: 'reception', eventTypeLabel: 'Wedding Reception' };
  }

  // Corporate
  if (/corporate|conference|summit|seminar|annual\s*meet|कंपनी|कॉर्पोरेट/i.test(lower)) {
    return { category: 'corporate', eventTypeLabel: 'Corporate Event' };
  }

  // Religious
  if (/satyanarayan|puja|pooja|havan|homa|कथा|सत्यनारायण|पूजा|हवन/i.test(lower)) {
    return { category: 'religious', eventTypeLabel: 'Religious Ceremony' };
  }

  // Wedding (check last so specific religious / baby shower aren't shadowed)
  if (/wedding|marriage|shaadi|shadi|vivah|लग्न|शादी|विवाह|लग्नसमारंभ/i.test(lower)) {
    return { category: 'wedding', eventTypeLabel: 'Traditional Wedding Celebration' };
  }

  return { category: 'custom', eventTypeLabel: 'Special Celebration' };
}

/**
 * Parse budget expressions
 */
export function parseBudgetExpression(text: string): number | undefined {
  const croreMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|crores|कोटी|करोड़)/i);
  if (croreMatch) {
    return Math.round(parseFloat(croreMatch[1]) * 10000000);
  }

  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|l|लाख)/i);
  if (lakhMatch) {
    return Math.round(parseFloat(lakhMatch[1]) * 100000);
  }

  const kMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand|हजार|हज़ार)/i);
  if (kMatch) {
    return Math.round(parseFloat(kMatch[1]) * 1000);
  }

  const inrMatch = text.match(/(?:₹|rs\.?|inr)\s*(\d[\d,]*)/i);
  if (inrMatch) {
    const num = parseInt(inrMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(num) && num > 1000) return num;
  }

  const plainNumMatch = text.match(/\b(\d{5,8})\b/);
  if (plainNumMatch) {
    const num = parseInt(plainNumMatch[1], 10);
    if (!isNaN(num)) return num;
  }

  return undefined;
}

/**
 * Parse guest count expression
 */
export function parseGuestCountExpression(text: string): number | undefined {
  const guestMatch = text.match(
    /(\d+)\s*(?:guests|people|persons|attendees|visitors|members|पाहुणे|लोक|मेहमान|भाविक)/i
  );
  if (guestMatch) {
    return parseInt(guestMatch[1], 10);
  }
  const rangeMatch = text.match(/(\d+)\s*[-–to]+\s*(\d+)\s*(?:guests|people|पाहुणे|मेहमान)?/i);
  if (rangeMatch) {
    return parseInt(rangeMatch[2], 10);
  }
  return undefined;
}

/**
 * Parse phone number expression
 */
export function parsePhoneNumber(text: string): string | undefined {
  const phoneMatch = text.match(/(?:\+91[\-\s]?)?[6-9]\d{9}\b/);
  if (phoneMatch) {
    let clean = phoneMatch[0].replace(/[\-\s]/g, '');
    if (!clean.startsWith('+91')) {
      clean = `+91 ${clean}`;
    } else {
      clean = `+91 ${clean.slice(3)}`;
    }
    return clean;
  }
  return undefined;
}

/**
 * Parse date expression
 */
export function parseDateExpression(text: string): { dateStr?: string; isTentative?: boolean } {
  const isTentative = /tentative|around|tentatively|अंदाजे|जवळपास|लगभग/i.test(text);

  // ISO date YYYY-MM-DD
  const isoMatch = text.match(/\b(202[6-9])-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) {
    return { dateStr: isoMatch[0], isTentative };
  }

  // DD Month YYYY or DD Month
  const monthNames: Record<string, string> = {
    january: '01', jan: '01', जाने: '01', जानेवारी: '01', जनवरी: '01',
    february: '02', feb: '02', फेब्रु: '02', फेब्रुवारी: '02', फरवरी: '02',
    march: '03', mar: '03', मार्च: '03',
    april: '04', apr: '04', एप्रि: '04', एप्रिल: '04', अप्रैल: '04',
    may: '05', मे: '05', मई: '05',
    june: '06', jun: '06', जून: '06',
    july: '07', jul: '07', जुलै: '07', जुलाई: '07',
    august: '08', aug: '08', ऑग: '08', ऑगस्ट: '08', अगस्त: '08',
    september: '09', sep: '09', sept: '09', सप्टें: '09', सप्टेंबर: '09', सितंबर: '09',
    october: '10', oct: '10', ऑक्टो: '10', ऑक्टोबर: '10', अक्टूबर: '10',
    november: '11', nov: '11', नोव्हें: '11', नोव्हेंबर: '11', नवंबर: '11',
    december: '12', dec: '12', डिसें: '12', डिसेंबर: '12', दिसंबर: '12',
  };

  const pattern = new RegExp(
    `(\\b\\d{1,2})(?:st|nd|rd|th)?\\s+(${Object.keys(monthNames).join('|')})(?:\\s+(\\d{4}))?`,
    'i'
  );
  const match = text.match(pattern);
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = monthNames[match[2].toLowerCase()] || '12';
    const year = match[3] || '2026';
    return { dateStr: `${year}-${month}-${day}`, isTentative };
  }

  // Marathi / Hindi order: Month Day (डिसेंबर 18)
  const patternRev = new RegExp(
    `(${Object.keys(monthNames).join('|')})\\s+(\\b\\d{1,2})(?:st|nd|rd|th)?(?:\\s+(\\d{4}))?`,
    'i'
  );
  const matchRev = text.match(patternRev);
  if (matchRev) {
    const month = monthNames[matchRev[1].toLowerCase()] || '12';
    const day = matchRev[2].padStart(2, '0');
    const year = matchRev[3] || '2026';
    return { dateStr: `${year}-${month}-${day}`, isTentative };
  }

  return { isTentative };
}

/**
 * Parse venue status
 */
export function parseVenueStatus(
  text: string
): 'FINALIZED' | 'NOT_FINALIZED' | 'UNDECIDED' | undefined {
  const lower = text.toLowerCase();
  if (
    /venue\s+is\s+finalized|already\s+finalized|venue\s+booked|booked\s+venue|हॉल\s*बुक|वेन्यू\s*नक्की|हॉल\s*नक्की|फाइनल/i.test(
      lower
    )
  ) {
    return 'FINALIZED';
  }
  if (
    /not\s+yet|not\s+finalized|not\s+decided|searching|no\s+venue|अजून\s*नाही|अजून\s*ठरवले\s*नाही|नाही|नहीं|ढूंढ\s*रहे/i.test(
      lower
    )
  ) {
    return 'NOT_FINALIZED';
  }
  if (/undecided|not\s+sure|decision\s+pending/i.test(lower)) {
    return 'UNDECIDED';
  }
  return undefined;
}

/**
 * Check if the text is an explicit correction
 */
export function detectCorrection(
  text: string
): { isCorrection: boolean; field?: string } {
  const lower = text.toLowerCase();
  const correctionMarkers =
    /actually|instead|correction|change\s+to|make\s+it|update\s+to|not\s+\w+,\s*(?:it's|its)|बदला|बदलून|सुधारणा|की\s*जगह|नहीं\s*,/i;
  if (!correctionMarkers.test(lower)) {
    return { isCorrection: false };
  }

  if (/date|तारीख|तारीख/i.test(lower)) return { isCorrection: true, field: 'date' };
  if (/budget|बजेट|बजट/i.test(lower)) return { isCorrection: true, field: 'budget' };
  if (/guest|पाहुणे|मेहमान/i.test(lower)) return { isCorrection: true, field: 'guests' };
  if (/venue|place|हॉल|वेन्यू|स्थान/i.test(lower)) return { isCorrection: true, field: 'venue' };
  if (/bride|नवरी|दुल्हन/i.test(lower)) return { isCorrection: true, field: 'bride' };
  if (/groom|नवरदेव|दूल्हा/i.test(lower)) return { isCorrection: true, field: 'groom' };
  if (/name|नाव|नाम/i.test(lower)) return { isCorrection: true, field: 'clientName' };

  return { isCorrection: true };
}

/**
 * Extract couple names for a wedding: "wedding for Rohan and Priya", "Rohan weds Priya", etc.
 */
export function extractCoupleNames(
  text: string
): { groomName?: string; brideName?: string } {
  // Pattern: [Groom] and [Bride] or [Bride] and [Groom]
  const coupleMatch = text.match(
    /(?:for|of|विवाह|लग्न|शादी)\s+([A-Z\u0900-\u097F][a-z\u0900-\u097F]+)\s+(?:and|weds|&|आणि|और|संग)\s+([A-Z\u0900-\u097F][a-z\u0900-\u097F]+)/i
  );
  if (coupleMatch) {
    const first = coupleMatch[1].trim();
    const second = coupleMatch[2].trim();

    // Determine likely bride vs groom based on common Indian naming or assign 1st as groom / 2nd as bride
    const femaleNames = /^(priya|ananya|sneha|pooja|neha|aditi|aishwarya|tanvi|riya|simran|shreya|anushka|divya|प्रिया|नेहा|स्नेहा|पूजा|तन्वी|रिया)/i;
    if (femaleNames.test(first)) {
      return { brideName: first, groomName: second };
    } else {
      return { groomName: first, brideName: second };
    }
  }

  // Explicit Groom / Bride markers
  const brideMatch = text.match(/(?:bride|bride's\s*name|नवरी|दुल्हन)(?:\s*is)?\s*[:\-]?\s*([A-Za-z\u0900-\u097F\s]{2,25})/i);
  const groomMatch = text.match(/(?:groom|groom's\s*name|नवरदेव|दूल्हा)(?:\s*is)?\s*[:\-]?\s*([A-Za-z\u0900-\u097F\s]{2,25})/i);

  return {
    brideName: brideMatch ? brideMatch[1].trim() : undefined,
    groomName: groomMatch ? groomMatch[1].trim() : undefined,
  };
}

/**
 * Create initial empty draft
 */
export function createInitialDraft(): EventCreationDraft {
  return {
    eventType: 'Event Creation',
    eventName: '',
    city: 'Pune',
    area: '',
    venueStatus: undefined,
    status: 'IN_CONVERSATION',
    currentStage: 'event_details',
    progressPercent: 15,
    missingFields: ['event_type'],
  };
}

/**
 * Compute progress percentage and stage based on filled fields
 */
export function evaluateStageAndProgress(draft: EventCreationDraft): {
  stage: EventCreationStage;
  progress: number;
  missing: string[];
} {
  const missing: string[] = [];

  if (!draft.category) {
    missing.push('event_type');
    return { stage: 'event_details', progress: 15, missing };
  }

  // Event category specific requirements
  if (draft.category === 'wedding') {
    if (!draft.brideName) missing.push("bride's name");
    if (!draft.groomName) missing.push("groom's name");
  } else if (draft.category === 'griha_pravesh') {
    if (!draft.clientName) missing.push('client name');
    if (!draft.propertyAddress && !draft.area) missing.push('property address/locality');
  } else if (draft.category === 'baby_shower') {
    if (!draft.celebrantName && !draft.clientName) missing.push('celebrant / client name');
  } else if (draft.category === 'ganpati_festival') {
    if (!draft.mandalOrClientName && !draft.clientName) missing.push('organizer / mandal name');
    if (!draft.installationDate && !draft.eventDate) missing.push('installation date');
  } else {
    if (!draft.clientName) missing.push('client name');
  }

  // Core mandatory checkpoints
  if (!draft.clientName && !draft.brideName && !draft.groomName && !draft.mandalOrClientName) {
    missing.push('client contact name');
  }
  if (!draft.clientPhone) {
    missing.push('client phone number');
  }
  if (!draft.eventDate && !draft.installationDate) {
    missing.push('event date');
  }
  if (!draft.area) {
    missing.push('preferred area / locality');
  }
  if (!draft.guestCount) {
    missing.push('estimated guest count');
  }
  if (!draft.estimatedBudget) {
    missing.push('estimated budget');
  }

  // Determine stage & percentage
  if (missing.includes('event_type') || (draft.category === 'wedding' && (!draft.brideName || !draft.groomName))) {
    return { stage: 'event_details', progress: 15, missing };
  }

  if (missing.includes('client contact name') || missing.includes('client phone number')) {
    return { stage: 'client_details', progress: 30, missing };
  }

  if (missing.includes('event date') || missing.includes('preferred area / locality')) {
    return { stage: 'date_and_venue', progress: 55, missing };
  }

  if (missing.includes('estimated guest count') || missing.includes('estimated budget')) {
    return { stage: 'guests_and_budget', progress: 75, missing };
  }

  // If requirements still to be checked
  if (draft.category === 'wedding' && !draft.specialRequirements && !draft.weddingFunctions) {
    return { stage: 'requirements', progress: 90, missing };
  }

  if (draft.category === 'ganpati_festival' && draft.mandapDecorRequired === undefined && draft.soundLightingRequired === undefined) {
    return { stage: 'requirements', progress: 90, missing };
  }

  if (draft.category === 'griha_pravesh' && draft.pujaArrangements === undefined && draft.cateringRequired === undefined) {
    return { stage: 'requirements', progress: 90, missing };
  }

  return { stage: 'review_and_create', progress: 100, missing: [] };
}

/**
 * Generate next question based on current draft state and event category
 */
export function getNextAiQuestion(
  draft: EventCreationDraft,
  lang: VoiceLanguage = 'en'
): string {
  // 1. Event Type not known
  if (!draft.category) {
    if (lang === 'mr') {
      return 'वेडोरा इव्हेंट क्रिएशनमध्ये आपले स्वागत आहे! मी तुमचा इव्हेंट तयार करण्यास मदत करेन. सांगा, तुम्ही कोणत्या प्रकारच्या कार्यक्रमाचे नियोजन करत आहात?';
    }
    if (lang === 'hi') {
      return 'वेडोरा इवेंट क्रिएशन में आपका स्वागत है! मैं आपका इवेंट सेटअप करने में मदद करूंगा। बताइए, आप किस तरह के इवेंट की योजना बना रहे हैं?';
    }
    return OPENING_AI_MESSAGE;
  }

  // 2. WEDDING FLOW
  if (draft.category === 'wedding') {
    if (!draft.brideName) {
      if (lang === 'mr') return 'छान! नवरीचे नाव काय आहे?';
      if (lang === 'hi') return 'बहुत बढ़िया! दुल्हन का नाम क्या है?';
      return "Wonderful! What is the bride's name?";
    }
    if (!draft.groomName) {
      if (lang === 'mr') return 'आणि नवरदेवाचे नाव काय आहे?';
      if (lang === 'hi') return 'और दूल्हे का नाम क्या है?';
      return "What is the groom's name?";
    }
    if (!draft.eventDate) {
      if (lang === 'mr') return 'लग्नाची तारीख किंवा अंदाजे महिना कोणता आहे?';
      if (lang === 'hi') return 'शादी की तारीख या संभावित महीना कौन सा है?';
      return 'What is the planned wedding date?';
    }
    if (draft.venueStatus === undefined || draft.venueStatus === 'UNDECIDED') {
      if (lang === 'mr') return 'तुम्ही लग्नाचे स्थळ किंवा हॉल आधीच नक्की केले आहे का?';
      if (lang === 'hi') return 'क्या आपने वेन्यू पहले से फाइनल कर लिया है?';
      return 'Have you already finalized the venue?';
    }
    if (draft.venueStatus === 'FINALIZED' && !draft.venueName) {
      if (lang === 'mr') return 'नक्की केलेल्या वेन्यूचे नाव आणि पत्ता काय आहे?';
      if (lang === 'hi') return 'फाइनल किए गए वेन्यू का नाम और पता क्या है?';
      return 'What is the name and address of the finalized venue?';
    }
    if ((draft.venueStatus === 'NOT_FINALIZED' || draft.venueStatus === 'UNDECIDED') && !draft.area) {
      if (lang === 'mr') return 'काही हरकत नाही. लग्नासाठी तुम्ही पुणे किंवा मुंबईतील कोणता परिसर पसंत कराल?';
      if (lang === 'hi') return 'कोई बात नहीं। शादी के लिए आप किस शहर या इलाके को प्राथमिकता देंगे?';
      return 'No problem. Which city or area would you prefer for the wedding?';
    }
    if (!draft.clientName) {
      if (lang === 'mr') return 'या लग्नासाठी प्राथमिक क्लायंट संपर्क कोण असतील?';
      if (lang === 'hi') return 'इस शादी के लिए प्राइमरी क्लाइंट कांटेक्ट कौन होंगे?';
      return 'Who should be treated as the primary client contact for this wedding?';
    }
    if (!draft.clientPhone) {
      if (lang === 'mr') return 'क्लायंटचा संपर्क फोन नंबर काय आहे?';
      if (lang === 'hi') return 'क्लाइंट का संपर्क फोन नंबर क्या है?';
      return "What is the client's contact mobile number?";
    }
    if (!draft.guestCount) {
      if (lang === 'mr') return 'अंदाजे किती पाहुणे उपस्थित राहण्याची अपेक्षा आहे?';
      if (lang === 'hi') return 'लगभग कितने मेहमानों के आने की उम्मीद है?';
      return 'Approximately how many guests are you expecting?';
    }
    if (!draft.estimatedBudget) {
      if (lang === 'mr') return 'या विवाह सोहळ्यासाठी अंदाजे बजेट किती आहे?';
      if (lang === 'hi') return 'इस शादी समारोह के लिए अनुमानित बजट कितना है?';
      return 'What is the estimated event budget?';
    }
    if (!draft.specialRequirements && !draft.weddingFunctions) {
      if (lang === 'mr') return 'संगीत किंवा मेहंदी सारखे इतर समारंभ किंवा काही खास गरजा आहेत का?';
      if (lang === 'hi') return 'क्या संगीत, मेहंदी जैसे अन्य फंक्शन या कोई खास जरूरतें हैं?';
      return 'Are there any additional functions (like Sangeet, Mehendi) or special requirements?';
    }

    if (lang === 'mr') return 'मी तुमच्या लग्नाची सर्व माहिती तयार केली आहे. इव्हेंट तयार करण्यापूर्वी तुम्हाला काही तपासायचे आहे का?';
    if (lang === 'hi') return 'मैंने आपके इवेंट का विवरण तैयार कर लिया है। क्या आप फाइनल करने से पहले कुछ देखना चाहते हैं?';
    return REVIEW_READY_MESSAGE;
  }

  // 3. GRIHA PRAVESH FLOW (NEVER ASKS FOR BRIDE/GROOM)
  if (draft.category === 'griha_pravesh') {
    if (!draft.clientName) {
      if (lang === 'mr') return 'नवीन घरासाठी अभिनंदन! क्लायंट किंवा कुटुंबाचे नाव काय आहे?';
      if (lang === 'hi') return 'नए घर की बहुत-बहुत बधाई! क्लाइंट या परिवार का नाम क्या है?';
      return "Congratulations on the new home! What is the client's or family name?";
    }
    if (!draft.eventDate) {
      if (lang === 'mr') return 'गृहप्रवेश पूजेची तारीख कोणती आहे?';
      if (lang === 'hi') return 'गृहप्रवेश पूजा की तारीख क्या है?';
      return 'What is the planned date for the Griha Pravesh ceremony?';
    }
    if (!draft.propertyAddress && !draft.area) {
      if (lang === 'mr') return 'सोहळ्यासाठी घराचा पत्ता, शहर आणि परिसर कोणता आहे?';
      if (lang === 'hi') return 'समारोह के लिए संपत्ति का पता, शहर और इलाका क्या है?';
      return 'What is the property or event address, city, and locality?';
    }
    if (!draft.clientPhone) {
      if (lang === 'mr') return 'क्लायंटचा संपर्क मोबाईल नंबर काय आहे?';
      if (lang === 'hi') return 'क्लाइंट का संपर्क मोबाइल नंबर क्या है?';
      return "What is the client's contact mobile number?";
    }
    if (!draft.guestCount) {
      if (lang === 'mr') return 'गृहप्रवेशासाठी अंदाजे किती पाहुणे उपस्थित राहतील?';
      if (lang === 'hi') return 'गृहप्रवेश में लगभग कितने मेहमान शामिल होंगे?';
      return 'Approximate guest count for the housewarming?';
    }
    if (!draft.estimatedBudget) {
      if (lang === 'mr') return 'या सोहळ्यासाठी अंदाजे बजेट किती आहे?';
      if (lang === 'hi') return 'इस आयोजन के लिए अनुमानित बजट क्या है?';
      return 'What is the estimated budget for this ceremony?';
    }
    if (draft.cateringRequired === undefined && draft.pujaArrangements === undefined) {
      if (lang === 'mr') return 'तुम्हाला केटरिंग, फुलांचे डेकोरेशन किंवा गुरुजींची (पूजा) व्यवस्था हवी आहे का?';
      if (lang === 'hi') return 'क्या आपको कैटरिंग, डेकोरेशन या पंडित जी की व्यवस्था की आवश्यकता है?';
      return 'Do you require catering, decoration, or priest (puja) arrangements?';
    }

    if (lang === 'mr') return 'मी गृहप्रवेश सोहळ्याची सर्व माहिती तयार केली आहे. इव्हेंट तयार करण्यापूर्वी तुम्हाला काही तपासायचे आहे का?';
    if (lang === 'hi') return 'मैंने गृहप्रवेश विवरण तैयार कर लिया है। क्या आप सबमिट करने से पहले कुछ देखना चाहते हैं?';
    return REVIEW_READY_MESSAGE;
  }

  // 4. BABY SHOWER / DOHALE JEVAN FLOW (NEVER ASKS FOR BRIDE/GROOM)
  if (draft.category === 'baby_shower') {
    if (!draft.celebrantName && !draft.clientName) {
      if (lang === 'mr') return 'छान! भावी मातेचे (mother-to-be) आणि क्लायंटचे नाव काय आहे?';
      if (lang === 'hi') return 'बहुत खूब! होने वाली मां (mother-to-be) और क्लाइंट का नाम क्या है?';
      return "What is the name of the mother-to-be being celebrated, and the client's name?";
    }
    if (!draft.eventDate) {
      if (lang === 'mr') return 'डोहाळे जेवणाची नियोजित तारीख कोणती आहे?';
      if (lang === 'hi') return 'गोद भराई कार्यक्रम की तारीख क्या है?';
      return 'What is the planned date for the baby shower?';
    }
    if (draft.venueStatus === undefined || draft.venueStatus === 'UNDECIDED') {
      if (lang === 'mr') return 'कार्यक्रम कोठे होणार आहे? हॉल नक्की केला आहे की घरामध्ये/बागेत?';
      if (lang === 'hi') return 'कार्यक्रम कहां होगा? वेन्यू तय है या घर/हॉल में होगा?';
      return 'Where will the celebration take place? Have you finalized a venue or preferred location?';
    }
    if (!draft.clientPhone) {
      if (lang === 'mr') return 'क्लायंटचा संपर्क फोन नंबर काय आहे?';
      if (lang === 'hi') return 'क्लाइंट का संपर्क नंबर क्या है?';
      return "What is the client's contact phone number?";
    }
    if (!draft.guestCount) {
      if (lang === 'mr') return 'अंदाजे किती पाहुणे उपस्थित राहतील?';
      if (lang === 'hi') return 'कितने मेहमान आने की उम्मीद है?';
      return 'How many expected guests?';
    }
    if (!draft.estimatedBudget) {
      if (lang === 'mr') return 'या कार्यक्रमासाठी अंदाजे बजेट किती आहे?';
      if (lang === 'hi') return 'इस कार्यक्रम के लिए अनुमानित बजट क्या है?';
      return 'What is the estimated budget?';
    }
    if (draft.decorationRequired === undefined && draft.cateringRequired === undefined) {
      if (lang === 'mr') return 'डेकोरेशन, केटरिंग किंवा फोटोग्राफीसाठी काही खास पसंती आहे का?';
      if (lang === 'hi') return 'डेकोरेशन, कैटरिंग या फोटोग्राफी के लिए कोई खास जरूरतें?';
      return 'Do you have specific preferences for decoration, catering, or photography?';
    }

    if (lang === 'mr') return 'मी डोहाळे जेवणाची सर्व माहिती तयार केली आहे. इव्हेंट तयार करण्यापूर्वी तुम्हाला काही तपासायचे आहे का?';
    if (lang === 'hi') return 'मैंने कार्यक्रम का विवरण तैयार कर लिया है। क्या आप फाइनल करने से पहले कुछ देखना चाहते हैं?';
    return REVIEW_READY_MESSAGE;
  }

  // 5. GANPATI FESTIVAL FLOW (NEVER ASKS WEDDING QUESTIONS)
  if (draft.category === 'ganpati_festival') {
    if (!draft.mandalOrClientName && !draft.clientName) {
      if (lang === 'mr') return 'गणपती बाप्पा मोरया! गणेशोत्सवाचे आयोजन करणाऱ्या मंडळ किंवा कुटुंब/क्लायंटचे नाव काय आहे?';
      if (lang === 'hi') return 'गणपति बप्पा मोरया! गणेशोत्सव का आयोजन करने वाले मंडल या क्लाइंट का नाम क्या है?';
      return 'Wonderful! What is the name of the organizer, family, or mandal hosting the Ganpati celebration?';
    }
    if (!draft.installationDate && !draft.eventDate) {
      if (lang === 'mr') return 'श्रींची स्थापना (स्थापना तारीख) कधी आहे?';
      if (lang === 'hi') return 'गणेश स्थापना की तारीख क्या है?';
      return 'What is the installation (sthapana) date for Lord Ganesha?';
    }
    if (!draft.visarjanDate && !draft.festivalDurationDays) {
      if (lang === 'mr') return 'उत्सवाचा कालावधी किंवा विसर्जन तारीख कोणती आहे (उदा. ५ दिवस, १० दिवस)?';
      if (lang === 'hi') return 'उत्सव की अवधि या विसर्जन तारीख क्या है (जैसे 5 दिन, 10 दिन)?';
      return 'What is the celebration duration or visarjan date (e.g. 1.5-day, 5-day, 10-day)?';
    }
    if (!draft.area) {
      if (lang === 'mr') return 'उत्सवाचे ठिकाण किंवा परिसर कोणता आहे?';
      if (lang === 'hi') return 'आयोजन का स्थान या इलाका क्या है?';
      return 'What is the event location and address?';
    }
    if (!draft.clientPhone) {
      if (lang === 'mr') return 'आयोजकांचा संपर्क मोबाईल नंबर काय आहे?';
      if (lang === 'hi') return 'आयोजक का संपर्क मोबाइल नंबर क्या है?';
      return "What is the primary contact mobile number for the organizer?";
    }
    if (!draft.guestCount) {
      if (lang === 'mr') return 'दर्शनासाठी अंदाजे किती भाविक किंवा पाहुणे येण्याची अपेक्षा आहे?';
      if (lang === 'hi') return 'लगभग कितने भक्त या आगंतुक आने की उम्मीद है?';
      return 'Approximately how many visitors or devotees are expected?';
    }
    if (!draft.estimatedBudget) {
      if (lang === 'mr') return 'उत्सवासाठी नियोजित बजेट किती आहे?';
      if (lang === 'hi') return 'उत्सव के लिए निर्धारित बजट क्या है?';
      return 'What is the planned budget for the celebration?';
    }
    if (draft.mandapDecorRequired === undefined && draft.soundLightingRequired === undefined) {
      if (lang === 'mr') return 'मंडप डेकोरेशन, लाईटिंग, साऊंड किंवा प्रसादाची व्यवस्था हवी आहे का?';
      if (lang === 'hi') return 'क्या मंडप डेकोरेशन, लाइटिंग, साउंड या प्रसाद की व्यवस्था चाहिए?';
      return 'Do you need mandap decoration, sound/lighting, or catering/prasad arrangements?';
    }

    if (lang === 'mr') return 'मी गणेशोत्सवाची सर्व माहिती तयार केली आहे. इव्हेंट तयार करण्यापूर्वी तुम्हाला काही तपासायचे आहे का?';
    if (lang === 'hi') return 'मैंने गणेशोत्सव का सारा विवरण तैयार कर लिया है। क्या आप सबमिट करने से पहले देखना चाहते हैं?';
    return REVIEW_READY_MESSAGE;
  }

  // 6. OTHER / CUSTOM EVENT TYPES
  if (!draft.clientName) {
    if (lang === 'mr') return 'या कार्यक्रमासाठी क्लायंटचे नाव काय आहे?';
    if (lang === 'hi') return 'इस कार्यक्रम के लिए क्लाइंट का नाम क्या है?';
    return "What is the client or celebrant's name?";
  }
  if (!draft.eventDate) {
    if (lang === 'mr') return 'कार्यक्रमाची नियोजित तारीख कोणती आहे?';
    if (lang === 'hi') return 'कार्यक्रम की तारीख क्या है?';
    return 'What is the planned event date?';
  }
  if (!draft.clientPhone) {
    if (lang === 'mr') return 'क्लायंटचा संपर्क फोन नंबर काय आहे?';
    if (lang === 'hi') return 'क्लाइंट का संपर्क नंबर क्या है?';
    return "What is the client's contact phone number?";
  }
  if (!draft.guestCount) {
    if (lang === 'mr') return 'अंदाजे किती पाहुणे उपस्थित राहतील?';
    if (lang === 'hi') return 'कितने मेहमान आने की उम्मीद है?';
    return 'Approximately how many guests are you expecting?';
  }
  if (!draft.estimatedBudget) {
    if (lang === 'mr') return 'अंदाजे बजेट किती आहे?';
    if (lang === 'hi') return 'अनुमानित बजट कितना है?';
    return 'What is the estimated budget?';
  }

  if (lang === 'mr') return 'मी तुमच्या कार्यक्रमाची सर्व माहिती तयार केली आहे. इव्हेंट तयार करण्यापूर्वी तुम्हाला काही तपासायचे आहे का?';
  if (lang === 'hi') return 'मैंने कार्यक्रम का विवरण तैयार कर लिया है। क्या आप रिव्यू करना चाहते हैं?';
  return REVIEW_READY_MESSAGE;
}

/**
 * Process a conversational user turn against the current draft
 */
export function processEventCreationTurn(
  userInput: string,
  currentDraft: EventCreationDraft,
  preferredLang?: VoiceLanguage
): {
  updatedDraft: EventCreationDraft;
  aiSpeechResponse: string;
  detectedLang: VoiceLanguage;
} {
  const text = userInput.trim();
  const lang = preferredLang || detectLanguage(text);

  // Clone draft to mutate safely
  const draft: EventCreationDraft = {
    ...currentDraft,
    missingFields: [...(currentDraft.missingFields || [])],
  };

  // 1. Detect category if not already established
  if (!draft.category) {
    const detected = detectEventCategory(text);
    draft.category = detected.category;
    draft.eventType = detected.eventTypeLabel;
  }

  // 2. Check for explicit correction
  const correction = detectCorrection(text);

  // 3. Extract Locality / City
  const resolvedLoc = resolveLocality(text);
  if (resolvedLoc) {
    draft.city = resolvedLoc.city;
    draft.area = resolvedLoc.canonicalName;
  }

  // 4. Extract Budget
  const budget = parseBudgetExpression(text);
  if (budget) {
    draft.estimatedBudget = budget;
  }

  // 5. Extract Guest Count
  const guests = parseGuestCountExpression(text);
  if (guests) {
    draft.guestCount = guests;
  }

  // 6. Extract Phone
  const phone = parsePhoneNumber(text);
  if (phone) {
    draft.clientPhone = phone;
  }

  // 7. Extract Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    draft.clientEmail = emailMatch[0];
  }

  // 8. Extract Date
  const parsedDate = parseDateExpression(text);
  if (parsedDate.dateStr) {
    draft.eventDate = parsedDate.dateStr;
    if (draft.category === 'ganpati_festival') {
      draft.installationDate = parsedDate.dateStr;
    }
  }
  if (parsedDate.isTentative !== undefined) {
    draft.isDateTentative = parsedDate.isTentative;
  }

  // 9. Extract Venue Status
  const vStatus = parseVenueStatus(text);
  if (vStatus) {
    draft.venueStatus = vStatus;
  }

  // 10. Extract Venue Name if provided: "at Grand Hyatt Mumbai", "हॉल अमर बॅनक्वेट्स", etc.
  const venueMatch = text.match(/(?:at|venue|hotel|hall|हॉल|वेन्यू)\s+([A-Z\u0900-\u097F][A-Za-z\u0900-\u097F\s]{2,30}?)(?=(?:in|on|at|,|\.|\d|budget|guests|$))/i);
  if (venueMatch && !draft.venueName) {
    const candidate = venueMatch[1].trim();
    if (!ALL_LOCALITIES.includes(candidate)) {
      draft.venueName = candidate;
      draft.venueStatus = 'FINALIZED';
    }
  }

  // 11. Category Specific Extraction
  if (draft.category === 'wedding') {
    const couple = extractCoupleNames(text);
    if (couple.groomName) draft.groomName = couple.groomName;
    if (couple.brideName) draft.brideName = couple.brideName;

    // Check primary client contact distinction
    const clientContactMatch = text.match(/(?:client\s*(?:contact|primary\s*contact)?|contact\s*person|primary\s*contact|contact|क्लायंट|संपर्क)\s*(?:is|नाव)?\s*[:\-]?\s*([A-Za-z\u0900-\u097F\s]{2,30})/i);
    if (clientContactMatch) {
      const cleanName = clientContactMatch[1].replace(/^(?:contact\s*person|contact|is)\s+/i, '').trim();
      draft.clientName = cleanName;
      draft.isClientDifferentFromCelebrant = true;
    }
    // Per requirement 4: "Do not assume the client contact is automatically the bride or groom. Ask the organizer who should be treated as the primary client contact."

    // Wedding functions
    if (/sangeet|mehendi|haldi|reception/i.test(text)) {
      const funcs: string[] = draft.weddingFunctions || [];
      if (/sangeet/i.test(text) && !funcs.includes('Sangeet')) funcs.push('Sangeet');
      if (/mehendi/i.test(text) && !funcs.includes('Mehendi')) funcs.push('Mehendi');
      if (/haldi/i.test(text) && !funcs.includes('Haldi')) funcs.push('Haldi');
      if (/reception/i.test(text) && !funcs.includes('Reception')) funcs.push('Reception');
      draft.weddingFunctions = funcs;
    }

    // Generate dynamic event name
    if (draft.groomName && draft.brideName) {
      draft.eventName = `${draft.groomName} & ${draft.brideName}'s Wedding Celebration`;
    }
  } else if (draft.category === 'griha_pravesh') {
    // Client name for Griha Pravesh
    const isIntro = /planning|organizing|want to|गृहप्रवेश|housewarming/i.test(text) && !/for|family|कुटुंब|नाव|नाम/i.test(text);

    const familyMatch = text.match(/([A-Z\u0900-\u097F][A-Za-z\u0900-\u097F\s]{1,25}?\s+(?:Family|कुटुंब|परिवार))/i);
    const nameMatch = text.match(/(?:for|client|name\s*is|नाव|क्लायंट)\s*([A-Z\u0900-\u097F][A-Za-z\u0900-\u097F\s]{2,30})/i);

    if (familyMatch && !draft.clientName) {
      draft.clientName = familyMatch[1].trim();
    } else if (nameMatch && !draft.clientName) {
      const cand = nameMatch[1].trim();
      if (!/griha|pravesh|housewarming|vastu/i.test(cand)) {
        draft.clientName = cand;
      }
    } else if (!draft.clientName && !isIntro && text.length > 2 && text.length < 40 && !/pravesh|housewarming|vastu|गृहप्रवेश/i.test(text)) {
      if (!/^\d+$/.test(text)) draft.clientName = text.replace(/client|नाव|नाम/gi, '').trim();
    }

    // Property address
    const addressMatch = text.match(/(?:address|property|flat|plot|फ्लॅट|घर|पत्ता)\s*[:\-]?\s*([A-Za-z0-9\u0900-\u097F\s,.\-]{5,60})/i);
    if (addressMatch) {
      draft.propertyAddress = addressMatch[1].trim();
    }

    // Puja / Catering / Decor
    if (/catering|food|जेवण|केटरिंग/i.test(text)) {
      draft.cateringRequired = !/no\s*catering|नाही/i.test(text);
    }
    if (/decor|फुले|डेकोरेशन/i.test(text)) {
      draft.decorationRequired = !/no\s*decor|नाही/i.test(text);
    }
    if (/puja|priest|guruji|गुरुजी|पंडित|पूजा/i.test(text)) {
      draft.pujaArrangements = !/no\s*puja|नाही/i.test(text);
    }

    if (draft.clientName) {
      draft.eventName = `${draft.clientName}'s Griha Pravesh`;
    }
  } else if (draft.category === 'baby_shower') {
    const celebrantMatch = text.match(/(?:for|celebrating|mother|आई|नेहा|प्रिया)\s*([A-Z\u0900-\u097F][A-Za-z\u0900-\u097F]{2,25})/i);
    if (celebrantMatch && !draft.celebrantName) {
      const cand = celebrantMatch[1].trim();
      if (!/baby|shower|dohale/i.test(cand)) {
        draft.celebrantName = cand;
        draft.clientName = cand;
      }
    } else if (!draft.clientName && text.length > 2 && text.length < 30 && !/shower|dohale|baby/i.test(text) && !/^\d+$/.test(text)) {
      draft.celebrantName = text.trim();
      draft.clientName = text.trim();
    }

    if (/catering|food/i.test(text)) draft.cateringRequired = true;
    if (/decor/i.test(text)) draft.decorationRequired = true;
    if (/photo/i.test(text)) draft.photographyRequired = true;

    if (draft.celebrantName) {
      draft.eventName = `${draft.celebrantName}'s Baby Shower`;
    }
  } else if (draft.category === 'ganpati_festival') {
    const mandalPrefixMatch = text.match(/([A-Z\u0900-\u097F][A-Za-z\u0900-\u097F\s]{1,25}?\s+(?:Mandal|मंडळ|Trust|ट्रस्ट))/i);
    const mandalSuffixMatch = text.match(/(?:mandal|मंडळ|organizer|आयोजक)\s*[:\-]?\s*([A-Z\u0900-\u097F][A-Za-z\u0900-\u097F\s]{2,30})/i);

    if (mandalPrefixMatch && !draft.mandalOrClientName) {
      draft.mandalOrClientName = mandalPrefixMatch[1].trim();
      draft.clientName = draft.mandalOrClientName;
    } else if (mandalSuffixMatch && !draft.mandalOrClientName) {
      const cand = mandalSuffixMatch[1].trim();
      if (!/in\s+\w+|for\s+\w+/i.test(cand)) {
        draft.mandalOrClientName = cand;
        draft.clientName = cand;
      }
    } else if (!draft.clientName && !text.toLowerCase().includes('ganpati') && text.length > 2 && text.length < 40 && !/^\d+$/.test(text)) {
      draft.mandalOrClientName = text.trim();
      draft.clientName = text.trim();
    }

    // Duration: 1.5-day, 5-day, 10-day
    const daysMatch = text.match(/(\d+(?:\.\d+)?)\s*[-–]?\s*(?:days|day|दिवस|दिन)/i);
    if (daysMatch) {
      draft.festivalDurationDays = parseFloat(daysMatch[1]);
    }

    if (/mandap|decor/i.test(text)) draft.mandapDecorRequired = true;
    if (/sound|lighting|ध्वनी|लाईट/i.test(text)) draft.soundLightingRequired = true;
    if (/prasad|catering|प्रसाद/i.test(text)) draft.prasadCateringRequired = true;

    if (draft.mandalOrClientName) {
      draft.eventName = `${draft.mandalOrClientName} Ganpati Utsav`;
    }
  } else {
    // Custom / Other
    const nameMatch = text.match(/(?:for|client|name\s*is)\s*([A-Z\u0900-\u097F][A-Za-z\u0900-\u097F\s]{2,30})/i);
    if (nameMatch && !draft.clientName) {
      draft.clientName = nameMatch[1].trim();
    } else if (!draft.clientName && text.length > 2 && text.length < 35) {
      draft.clientName = text.trim();
    }
    if (draft.clientName) {
      draft.eventName = `${draft.clientName}'s ${draft.eventType}`;
    }
  }

  // Direct answers to specific single-field questions:
  if (!draft.brideName && currentDraft.category === 'wedding' && currentDraft.missingFields.includes("bride's name")) {
    draft.brideName = text.replace(/bride|name|नवरी|नाव/gi, '').trim();
  } else if (!draft.groomName && currentDraft.category === 'wedding' && currentDraft.missingFields.includes("groom's name")) {
    draft.groomName = text.replace(/groom|name|नवरदेव|नाव/gi, '').trim();
  }

  // Fallback default eventName if still empty
  if (!draft.eventName) {
    draft.eventName = draft.clientName
      ? `${draft.clientName}'s ${draft.eventType}`
      : `${draft.eventType} Event`;
  }

  // Update evaluation
  const evaluated = evaluateStageAndProgress(draft);
  draft.currentStage = evaluated.stage;
  draft.progressPercent = evaluated.progress;
  draft.missingFields = evaluated.missing;

  if (draft.progressPercent >= 100) {
    draft.status = 'READY_FOR_REVIEW';
  }

  // If correction was made, acknowledge explicitly
  let aiSpeechResponse = '';
  if (correction.isCorrection) {
    if (lang === 'mr') {
      aiSpeechResponse = `नक्की, मी माहिती अद्ययावत केली आहे. `;
    } else if (lang === 'hi') {
      aiSpeechResponse = `ठीक है, मैंने जानकारी अपडेट कर दी है। `;
    } else {
      aiSpeechResponse = `Understood, I've updated those details. `;
    }
  }

  aiSpeechResponse += getNextAiQuestion(draft, lang);

  return {
    updatedDraft: draft,
    aiSpeechResponse,
    detectedLang: lang,
  };
}
