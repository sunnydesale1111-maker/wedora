import prisma from '../config/prisma.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env.js';
import { VendorSearchService, MatchedVendorResult } from './vendor-search.service.js';

export interface ChatSessionState {
  eventType?: string;
  eventDate?: string; // YYYY-MM-DD
  city?: string;
  areas?: string[];
  serviceCategory?: string;
  guestCount?: number;
  budget?: number;
  lastSearchExecuted?: boolean;
}

export interface ChatResponse {
  conversationId: string;
  assistantMessage: string;
  sessionState: ChatSessionState;
  missingParameters: string[];
  extractedParams: Partial<ChatSessionState>;
  matchingVendors?: MatchedVendorResult[];
  totalMatched?: number;
}

export class AIService {
  private static geminiClient: GoogleGenerativeAI | null = ENV.GEMINI_API_KEY
    ? new GoogleGenerativeAI(ENV.GEMINI_API_KEY)
    : null;

  /**
   * Primary conversation handler with multi-turn session memory
   */
  public static async processMessage(params: {
    userId: string;
    conversationId?: string;
    eventId?: string;
    message: string;
  }): Promise<ChatResponse> {
    const { userId, eventId, message } = params;

    // 1. Retrieve or create conversation record
    let conversation: any;
    if (params.conversationId) {
      conversation = await prisma.aIConversation.findUnique({
        where: { id: params.conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
      });
    }

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId,
          eventId: eventId || null,
          title: 'Wedding Vendor Discovery',
          conversationState: {},
        },
        include: { messages: true },
      });
    }

    // Existing session state
    const currentState: ChatSessionState = (conversation.conversationState as ChatSessionState) || {};

    // 2. Extract structured parameters from message using Hybrid (Gemini LLM + Rule Engine)
    const newlyExtracted = await this.extractParameters(message, currentState);

    // 3. Merge state (Session Memory Rule: retain previous context, update only what changed)
    const updatedState: ChatSessionState = {
      ...currentState,
      ...newlyExtracted,
    };

    // If category changed explicitly (e.g. "now find decorators for the same wedding"), preserve date, city, guests
    if (newlyExtracted.serviceCategory) {
      updatedState.serviceCategory = newlyExtracted.serviceCategory;
    }

    // Determine missing essential parameters
    const missing: string[] = [];
    if (!updatedState.city) missing.push('city');
    if (!updatedState.eventDate) missing.push('event_date');
    if (!updatedState.serviceCategory) missing.push('service_category');
    if (!updatedState.guestCount && (!updatedState.serviceCategory || updatedState.serviceCategory.toLowerCase() === 'catering')) {
      missing.push('guest_count');
    }

    let assistantResponseText = '';
    let searchResults: MatchedVendorResult[] | undefined;
    let totalMatched: number | undefined;

    // 4. Decide response strategy based on completeness
    if (missing.length > 0) {
      // Formulate a helpful question for the first missing parameter
      assistantResponseText = this.generateClarificationQuestion(missing[0], updatedState);
    } else {
      // All essential parameters are present -> execute factual database search
      const searchRes = await VendorSearchService.searchVendors({
        category: updatedState.serviceCategory,
        city: updatedState.city,
        areas: updatedState.areas,
        date: updatedState.eventDate,
        guestCount: updatedState.guestCount,
        maxBudget: updatedState.budget,
      });

      searchResults = searchRes.results;
      totalMatched = searchRes.totalMatched;
      updatedState.lastSearchExecuted = true;

      const areaText = updatedState.areas && updatedState.areas.length > 0
        ? ` serving ${updatedState.areas.join(' or ')}`
        : '';
      const guestText = updatedState.guestCount ? ` for ${updatedState.guestCount} guests` : '';
      const dateText = updatedState.eventDate
        ? ` on ${new Date(updatedState.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
        : '';

      if (totalMatched > 0) {
        assistantResponseText = `I have found ${totalMatched} verified ${updatedState.serviceCategory} vendor(s) in ${updatedState.city}${areaText}${guestText}${dateText} with confirmed calendar availability. You can review their verified 90-day transaction history below and request a quotation.`;
      } else {
        // Section 7.6 No-Match Handling
        assistantResponseText = `No exact match was found for ${updatedState.serviceCategory} in ${updatedState.city}${areaText} with calendar availability on ${dateText} for ${guestText || 'your requirements'}.\n\nSuggestions:\n• Try expanding the search to nearby areas in ${updatedState.city}\n• Check alternative dates\n• Contact verified vendors directly for custom availability confirmation.`;
      }
    }

    // 5. Save user message and assistant message to database
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
        extractedParams: newlyExtracted as any,
      },
    });

    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: assistantResponseText,
        extractedParams: updatedState as any,
      },
    });

    // 6. Update conversation state
    await prisma.aIConversation.update({
      where: { id: conversation.id },
      data: {
        conversationState: updatedState as any,
        updatedAt: new Date(),
      },
    });

    return {
      conversationId: conversation.id,
      assistantMessage: assistantResponseText,
      sessionState: updatedState,
      missingParameters: missing,
      extractedParams: newlyExtracted,
      matchingVendors: searchResults,
      totalMatched,
    };
  }

  /**
   * Rule-based & LLM extraction engine
   */
  private static async extractParameters(
    message: string,
    existingState: ChatSessionState
  ): Promise<Partial<ChatSessionState>> {
    const text = message.toLowerCase();
    const extracted: Partial<ChatSessionState> = {};

    // 1. Try Gemini LLM if key is configured
    if (this.geminiClient) {
      try {
        const model = this.geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `You are an event planning parameter extraction engine.
Extract event planning search parameters from the following user message. Return ONLY a JSON object.
Existing Context:
${JSON.stringify(existingState)}

User Message: "${message}"

Output schema:
{
  "eventType": string or null,
  "eventDate": "YYYY-MM-DD" or null,
  "city": string or null,
  "areas": string[] or null,
  "serviceCategory": string or null,
  "guestCount": number or null,
  "budget": number or null
}`;

        const result = await model.generateContent(prompt);
        const respText = result.response.text();
        const jsonMatch = respText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          for (const key of Object.keys(parsed)) {
            if (parsed[key] !== null && parsed[key] !== undefined) {
              (extracted as any)[key] = parsed[key];
            }
          }
          return extracted;
        }
      } catch (err) {
        console.warn('Gemini extraction failed, falling back to rule-based parser:', err);
      }
    }

    // 2. Deterministic Rule-Based Parser (Robust & Testable)

    // Event Type
    if (text.includes('wedding')) extracted.eventType = 'Wedding';
    else if (text.includes('reception')) extracted.eventType = 'Reception';
    else if (text.includes('sangeet')) extracted.eventType = 'Sangeet';
    else if (text.includes('engagement')) extracted.eventType = 'Engagement';
    else if (text.includes('corporate')) extracted.eventType = 'Corporate Event';

    // Guest Count (e.g. "500 guests", "for 500 people", "500 pax")
    const guestMatch = text.match(/(\d+)\s*(guests?|people|pax|members|attendees)?/i);
    if (guestMatch) {
      const num = parseInt(guestMatch[1], 10);
      // Ensure it's not a year like 2026 or a day like 15
      if (num >= 20 && num !== 2024 && num !== 2025 && num !== 2026 && num !== 2027) {
        extracted.guestCount = num;
      }
    }

    // Specific check for guest count explicitly mentioned
    const explicitGuests = text.match(/(?:for|with|of)?\s*(\d{2,5})\s*(?:guests?|people|pax)/i);
    if (explicitGuests) {
      extracted.guestCount = parseInt(explicitGuests[1], 10);
    }

    // Date extraction:
    // e.g. "15 December 2026", "15th Dec 2026", "2026-12-15", "15/12/2026"
    const isoDateMatch = text.match(/\b(202[4-9])-(\d{1,2})-(\d{1,2})\b/);
    if (isoDateMatch) {
      const y = isoDateMatch[1];
      const m = isoDateMatch[2].padStart(2, '0');
      const d = isoDateMatch[3].padStart(2, '0');
      extracted.eventDate = `${y}-${m}-${d}`;
    } else {
      const namedDateMatch = text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{4})\b/i);
      if (namedDateMatch) {
        const day = namedDateMatch[1].padStart(2, '0');
        const monthNames: Record<string, string> = {
          jan: '01', january: '01',
          feb: '02', february: '02',
          mar: '03', march: '03',
          apr: '04', april: '04',
          may: '05',
          jun: '06', june: '06',
          jul: '07', july: '07',
          aug: '08', august: '08',
          sep: '09', sept: '09', september: '09',
          oct: '10', october: '10',
          nov: '11', november: '11',
          dec: '12', december: '12',
        };
        const mStr = monthNames[namedDateMatch[2].toLowerCase()];
        const year = namedDateMatch[3];
        if (mStr && year) {
          extracted.eventDate = `${year}-${mStr}-${day}`;
        }
      }
    }

    // Cities (Pune, Mumbai, Nashik, Bengaluru, Bangalore, Hyderabad)
    if (text.includes('pune')) extracted.city = 'Pune';
    else if (text.includes('mumbai')) extracted.city = 'Mumbai';
    else if (text.includes('nashik')) extracted.city = 'Nashik';
    else if (text.includes('bengaluru') || text.includes('bangalore')) extracted.city = 'Bengaluru';
    else if (text.includes('hyderabad')) extracted.city = 'Hyderabad';

    // Areas in Pune
    const knownAreas = ['Baner', 'Wakad', 'Hinjewadi', 'Aundh', 'Kothrud', 'Viman Nagar', 'Kalyani Nagar', 'Hadapsar', 'Bavdhan', 'Pimpri'];
    const matchedAreas: string[] = [];
    for (const area of knownAreas) {
      if (text.includes(area.toLowerCase())) {
        matchedAreas.push(area);
      }
    }
    if (matchedAreas.length > 0) {
      extracted.areas = matchedAreas;
      if (!extracted.city && !existingState.city) {
        extracted.city = 'Pune';
      }
    }

    // Service Categories
    if (text.includes('catering') || text.includes('caterer') || text.includes('food')) {
      extracted.serviceCategory = 'Catering';
    } else if (text.includes('decorat') || text.includes('decor') || text.includes('flower')) {
      extracted.serviceCategory = 'Decoration';
    } else if (text.includes('light')) {
      extracted.serviceCategory = 'Lighting';
    } else if (text.includes('photograph') || text.includes('videograph') || text.includes('photo')) {
      extracted.serviceCategory = 'Photography';
    } else if (text.includes('sound') || text.includes('dj') || text.includes('music')) {
      extracted.serviceCategory = 'Sound';
    } else if (text.includes('furniture') || text.includes('chair') || text.includes('table')) {
      extracted.serviceCategory = 'Furniture Rental';
    } else if (text.includes('equipment') || text.includes('generator') || text.includes('inventory')) {
      extracted.serviceCategory = 'Event Equipment';
    } else if (text.includes('logistic') || text.includes('transport') || text.includes('cab')) {
      extracted.serviceCategory = 'Logistics';
    }

    // Budget (e.g. "budget 500000", "5 lakhs", "₹50,000")
    const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|lacs|lakhs)/i);
    if (lakhMatch) {
      extracted.budget = parseFloat(lakhMatch[1]) * 100000;
    } else {
      const budgetMatch = text.match(/(?:budget|under|below|upto|up to|max)\s*(?:rs\.?|inr|₹)?\s*(\d[\d,]+)/i);
      if (budgetMatch) {
        const cleanVal = budgetMatch[1].replace(/,/g, '');
        extracted.budget = parseInt(cleanVal, 10);
      }
    }

    return extracted;
  }

  private static generateClarificationQuestion(missingField: string, state: ChatSessionState): string {
    switch (missingField) {
      case 'city':
        return 'Which city will the wedding or event take place in? (e.g. Pune, Mumbai, Nashik, Bengaluru, Hyderabad)';
      case 'service_category':
        return 'Which vendor service are you looking for? (e.g. Catering, Decoration, Lighting, Photography, Sound, Furniture Rental, Logistics)';
      case 'event_date':
        return 'What is the planned date for the event? (e.g. 15 December 2026)';
      case 'guest_count':
        return 'How many guests are you expecting for this event?';
      default:
        return 'Could you please specify your event location and preferred date so I can find available vendors?';
    }
  }
}
