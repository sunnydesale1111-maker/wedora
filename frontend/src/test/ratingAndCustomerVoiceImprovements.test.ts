import { describe, it, expect } from 'vitest';
import { formatRating } from '../utils/formatters';
import { parsePlannerVoiceCommand } from '../utils/plannerVoiceNlu';

describe('Wedora – Vendor Rating Display & Customer AI Voice Assistant Improvements', () => {
  describe('1. Vendor Rating Display Formatting', () => {
    it('formats ratings with excessive decimal places to exactly one decimal place', () => {
      expect(formatRating(4.899999999)).toBe('4.9');
      expect(formatRating(4.856)).toBe('4.9');
      expect(formatRating(4.823)).toBe('4.8');
    });

    it('formats integer ratings to have exactly one decimal place (.0)', () => {
      expect(formatRating(5)).toBe('5.0');
      expect(formatRating(4)).toBe('4.0');
    });

    it('handles standard single decimal and edge cases gracefully', () => {
      expect(formatRating(4.8)).toBe('4.8');
      expect(formatRating(4.9)).toBe('4.9');
      expect(formatRating(undefined)).toBe('4.8');
      expect(formatRating(null)).toBe('4.8');
      expect(formatRating(NaN)).toBe('4.8');
    });
  });

  describe('2. Individual Customer AI Assistant Response Tone', () => {
    const customerContext = {
      activeCity: 'Pune' as const,
      activeArea: 'Baner',
      activeEventDate: '2026-12-15',
      activeEventName: "Rohan & Priya's Wedding",
      role: 'CUSTOMER' as const,
    };

    it('never uses "worked with" or previous collaboration language in Customer mode', () => {
      const queries = [
        'Show me caterers in Baner',
        'Find photographers in Pune',
        'Top decorators in Wakad',
        'Are caterers available on 15 Dec?',
        'Show alternative options',
      ];

      queries.forEach((q) => {
        const parsed = parsePlannerVoiceCommand(q, customerContext);
        expect(parsed.assistantSpeechResponse.toLowerCase()).not.toContain('worked with');
        expect(parsed.assistantSpeechResponse.toLowerCase()).not.toContain('previously worked');
        expect(parsed.assistantSpeechResponse.toLowerCase()).not.toContain('पूर्व सहयोग');
        expect(parsed.assistantSpeechResponse.toLowerCase()).not.toContain('पूर्वी काम केलेले');
      });
    });

    it('uses friendly, customer-support tone when showing photographer recommendations', () => {
      const parsed = parsePlannerVoiceCommand('Show me photographers in Baner', customerContext);
      expect(parsed.assistantSpeechResponse).toBe(
        'I found these photographers for your event. You can explore their profiles below.'
      );
    });

    it('uses friendly, customer-support tone when showing catering recommendations', () => {
      const parsed = parsePlannerVoiceCommand('Show me caterers in Baner', customerContext);
      expect(parsed.assistantSpeechResponse).toBe(
        'I found these caterers for your event. You can explore their profiles below.'
      );
    });

    it('uses friendly, customer-support tone when showing general vendor recommendations', () => {
      const parsed = parsePlannerVoiceCommand('Find vendors in Baner', customerContext);
      expect(parsed.assistantSpeechResponse).toBe(
        'Here are some vendors that match your requirements.'
      );
    });

    it('uses friendly, direct tone when checking availability', () => {
      const parsed = parsePlannerVoiceCommand('Check available vendors on 15 Dec 2026', customerContext);
      expect(parsed.assistantSpeechResponse).toBe(
        'Here are the vendors available for your selected date.'
      );
    });

    it('uses friendly, customer-support tone for alternative options', () => {
      const parsed = parsePlannerVoiceCommand('Show alternative vendors', customerContext);
      expect(parsed.assistantSpeechResponse).toBe(
        'Here are some alternative vendor options matching your requirements.'
      );
    });

    it('supports concise and respectful Marathi customer responses without collaboration claims', () => {
      const parsed = parsePlannerVoiceCommand('बाणेरमधील फोटोग्राफर दाखवा', customerContext);
      expect(parsed.assistantSpeechResponse).toContain('फोटोग्राफर्स खाली उपलब्ध आहेत');
      expect(parsed.assistantSpeechResponse).not.toContain('पूर्वी काम केलेले');
    });

    it('supports concise and respectful Hindi customer responses without collaboration claims', () => {
      const parsed = parsePlannerVoiceCommand('बानेर में फोटोग्राफर दिखाइए', customerContext);
      expect(parsed.assistantSpeechResponse).toContain('फोटोग्राफर्स नीचे उपलब्ध हैं');
      expect(parsed.assistantSpeechResponse).not.toContain('पूर्व सहयोग');
    });
  });

  describe('3. Professional Event Planner AI Assistant Unchanged Behaviour', () => {
    const plannerContext = {
      activeCity: 'Pune' as const,
      activeArea: 'Baner',
      activeEventDate: '2026-12-15',
      activeEventName: "Rohan & Priya's Wedding",
      role: 'PLANNER' as const,
    };

    it('retains historical collaboration language for Professional Event Planners', () => {
      const parsed = parsePlannerVoiceCommand('Show me vendors in Baner', plannerContext);
      expect(parsed.assistantSpeechResponse).toContain(
        'Here are the vendors we have previously worked with in Baner, Pune, along with recommended alternatives.'
      );
    });

    it('defaults to planner behavior when role is omitted for backward compatibility', () => {
      const parsed = parsePlannerVoiceCommand('Show me vendors in Baner', {
        activeCity: 'Pune',
        activeArea: 'Baner',
      });
      expect(parsed.assistantSpeechResponse).toContain('previously worked with');
    });
  });
});

