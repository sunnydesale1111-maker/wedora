import { describe, it, expect, beforeEach } from 'vitest';
import {
  parseSearchIntent,
  OPENING_MESSAGE,
  QUESTION_1_EVENT,
  QUESTION_2_LOCATION,
  QUESTION_3_CATEGORY,
  QUESTION_4_BUDGET,
  QUESTION_5_DATE,
  FINAL_MESSAGE_MATCHES,
  FINAL_MESSAGE_NO_MATCHES,
  FRIENDLY_EMPTY_STATE,
  SUGGESTIONS_Q1,
  SUGGESTIONS_Q2,
  SUGGESTIONS_Q3,
  SUGGESTIONS_Q4,
  SUGGESTIONS_Q5,
  SUGGESTIONS_COMPLETED,
  isRequirementsComplete,
} from '../utils/searchIntentParser';
import { filterVendors, getEffectiveAvailability } from '../utils/vendorFilters';
import { DEMO_VENDORS } from '../data/demoVendors';

describe('Wedora Chatbot Version 5.1 — Opening Message & Results Timing Tests', () => {
  // Scenario 1: The exact Wedora opening message appears
  it('Scenario 1: Displays the exact Wedora opening message on greeting or initialization', () => {
    expect(OPENING_MESSAGE).toBe(
      "Namaste! 🙏 Welcome to Wedora. I'm here to help you plan your special occasion. What event are you planning?"
    );
    expect(QUESTION_1_EVENT).toBe('What event are you planning?');
    expect(QUESTION_2_LOCATION).toBe('Which city and area will your event take place in?');
    expect(QUESTION_3_CATEGORY).toBe('Which type of vendor would you like to find first?');
    expect(QUESTION_4_BUDGET).toBe('What is your approximate budget for this service?');
    expect(QUESTION_5_DATE).toBe('And finally, what date is your event planned for?');
    expect(FRIENDLY_EMPTY_STATE).toBe(
      "Your vendor recommendations will appear here once we've understood your event requirements."
    );

    const greeting = parseSearchIntent('Namaste');
    expect(greeting.isGreeting).toBe(true);
    expect(greeting.assistantReply).toBe(OPENING_MESSAGE);
    expect(greeting.nextQuestion).toBe(1);
    expect(greeting.suggestedOptions).toEqual(SUGGESTIONS_Q1);
    expect(greeting.flowCompleted).toBe(false);
  });

  // Scenario 2: After Question 1, no vendors are displayed
  it('Scenario 2: After Question 1, no vendors are displayed (results hidden)', () => {
    const q1Answer = parseSearchIntent('Wedding', {});
    expect(q1Answer.detectedOccasion).toBe('Wedding');
    expect(q1Answer.nextQuestion).toBe(2);
    expect(q1Answer.assistantReply).toBe(QUESTION_2_LOCATION);
    expect(q1Answer.suggestedOptions).toEqual(SUGGESTIONS_Q2);
    expect(q1Answer.flowCompleted).toBe(false);

    // Completion helper verifies requirements incomplete
    expect(
      isRequirementsComplete({
        occasion: q1Answer.detectedOccasion,
      })
    ).toBe(false);
  });

  // Scenario 3: After Question 2, no vendors are displayed
  it('Scenario 3: After Question 2, no vendors are displayed (results hidden)', () => {
    const q2Answer = parseSearchIntent('Pune', {
      currentOccasion: 'Wedding',
    });
    expect(q2Answer.detectedCity).toBe('Pune');
    expect(q2Answer.nextQuestion).toBe(3);
    expect(q2Answer.assistantReply).toBe(QUESTION_3_CATEGORY);
    expect(q2Answer.suggestedOptions).toEqual(SUGGESTIONS_Q3);
    expect(q2Answer.flowCompleted).toBe(false);

    expect(
      isRequirementsComplete({
        occasion: 'Wedding',
        city: q2Answer.detectedCity,
      })
    ).toBe(false);
  });

  // Scenario 4: After Question 3, no vendors are displayed
  it('Scenario 4: After Question 3, no vendors are displayed (results hidden)', () => {
    const q3Answer = parseSearchIntent('Catering', {
      currentOccasion: 'Wedding',
      currentCity: 'Pune',
    });
    expect(q3Answer.detectedCategory).toBe('Catering and Food Services');
    expect(q3Answer.nextQuestion).toBe(4);
    expect(q3Answer.assistantReply).toBe(QUESTION_4_BUDGET);
    expect(q3Answer.suggestedOptions).toEqual(SUGGESTIONS_Q4);
    expect(q3Answer.flowCompleted).toBe(false);

    expect(
      isRequirementsComplete({
        occasion: 'Wedding',
        city: 'Pune',
        category: q3Answer.detectedCategory,
      })
    ).toBe(false);
  });

  // Scenario 5: After Question 4, no vendors are displayed
  it('Scenario 5: After Question 4, no vendors are displayed (results hidden), accepts "No fixed budget"', () => {
    // 5a. Numerical budget
    const q4Num = parseSearchIntent('₹2,00,000', {
      currentOccasion: 'Wedding',
      currentCity: 'Pune',
      currentCategory: 'Catering and Food Services',
    });
    expect(q4Num.isBudgetAnswer).toBe(true);
    expect(q4Num.detectedMaxBudget).toBe(200000);
    expect(q4Num.nextQuestion).toBe(5);
    expect(q4Num.assistantReply).toBe(QUESTION_5_DATE);
    expect(q4Num.suggestedOptions).toEqual(SUGGESTIONS_Q5);
    expect(q4Num.flowCompleted).toBe(false);

    // 5b. "No fixed budget" counts as completed answer for Question 4
    const q4Flex = parseSearchIntent('No fixed budget', {
      currentOccasion: 'Wedding',
      currentCity: 'Pune',
      currentCategory: 'Catering and Food Services',
    });
    expect(q4Flex.isBudgetAnswer).toBe(true);
    expect(q4Flex.detectedMaxBudget).toBeUndefined();
    expect(q4Flex.nextQuestion).toBe(5);
    expect(q4Flex.assistantReply).toBe(QUESTION_5_DATE);
    expect(q4Flex.flowCompleted).toBe(false);

    expect(
      isRequirementsComplete({
        occasion: 'Wedding',
        city: 'Pune',
        category: 'Catering and Food Services',
        hasAnsweredBudget: true,
      })
    ).toBe(false);
  });

  // Scenario 6: After Question 5, matching vendors appear automatically
  it('Scenario 6: After Question 5, matching vendors appear automatically, supports "Not finalized yet"', () => {
    // 6a. Explicit Date
    const q5Answer = parseSearchIntent('15 December 2026', {
      currentOccasion: 'Wedding',
      currentCity: 'Pune',
      currentAreas: ['Baner'],
      currentCategory: 'Catering and Food Services',
      hasAnsweredBudget: true,
      currentBudget: 200000,
    });
    expect(q5Answer.detectedDate).toBe('2026-12-15');
    expect(q5Answer.flowCompleted).toBe(true);
    expect(q5Answer.nextQuestion).toBeUndefined();
    expect(q5Answer.assistantReply).toBe(FINAL_MESSAGE_MATCHES);
    expect(q5Answer.suggestedOptions).toEqual(SUGGESTIONS_COMPLETED);

    // 6b. "Not finalized yet" counts as completed date answer, with unverified availability
    const q5Unfinalized = parseSearchIntent('Not finalized yet', {
      currentOccasion: 'Wedding',
      currentCity: 'Pune',
      currentCategory: 'Catering and Food Services',
      hasAnsweredBudget: true,
      currentBudget: 200000,
    });
    expect(q5Unfinalized.isDateAnswer).toBe(true);
    expect(q5Unfinalized.isDateNotFinalized).toBe(true);
    expect(q5Unfinalized.detectedDate).toBeUndefined();
    expect(q5Unfinalized.flowCompleted).toBe(true);
    expect(q5Unfinalized.assistantReply).toBe(FINAL_MESSAGE_MATCHES);

    // Verify availability status when date is not finalized
    const unverifiedStatus = getEffectiveAvailability(DEMO_VENDORS[0], undefined);
    expect(unverifiedStatus).toBe('Unverified Availability');
  });

  // Scenario 7: If all five answers arrive in one message, results appear immediately
  it('Scenario 7: If all five answers arrive in one message, results appear immediately after validation', () => {
    const allInOne = parseSearchIntent(
      'I am planning a Wedding in Pune looking for Catering with budget of 2 lakh on 15 December 2026',
      {}
    );
    expect(allInOne.detectedOccasion).toBe('Wedding');
    expect(allInOne.detectedCity).toBe('Pune');
    expect(allInOne.detectedCategory).toBe('Catering and Food Services');
    expect(allInOne.isBudgetAnswer).toBe(true);
    expect(allInOne.detectedMaxBudget).toBe(200000);
    expect(allInOne.detectedDate).toBe('2026-12-15');
    expect(allInOne.flowCompleted).toBe(true);
    expect(allInOne.assistantReply).toBe(FINAL_MESSAGE_MATCHES);

    const isDone = isRequirementsComplete({
      occasion: allInOne.detectedOccasion,
      city: allInOne.detectedCity,
      category: allInOne.detectedCategory,
      hasAnsweredBudget: allInOne.isBudgetAnswer,
      budget: allInOne.detectedMaxBudget,
      hasAnsweredDate: true,
      date: allInOne.detectedDate,
    });
    expect(isDone).toBe(true);
  });

  // Scenario 8: If one answer is missing, results remain hidden
  it('Scenario 8: If one answer is missing, results remain hidden and asks only for missing field', () => {
    // 4 out of 5 answers (Date missing)
    const missingDate = parseSearchIntent(
      'I am planning a Wedding in Mumbai looking for Photography with a 1 lakh budget',
      {}
    );
    expect(missingDate.detectedOccasion).toBe('Wedding');
    expect(missingDate.detectedCity).toBe('Mumbai');
    expect(missingDate.detectedCategory).toBe('Photography and Videography');
    expect(missingDate.isBudgetAnswer).toBe(true);
    expect(missingDate.detectedMaxBudget).toBe(100000);
    expect(missingDate.detectedDate).toBeUndefined();
    expect(missingDate.flowCompleted).toBe(false);
    expect(missingDate.nextQuestion).toBe(5);
    expect(missingDate.assistantReply).toBe(QUESTION_5_DATE);

    // 4 out of 5 answers (Budget missing)
    const missingBudget = parseSearchIntent(
      'Wedding in Pune, Catering on 15 December 2026',
      {}
    );
    expect(missingBudget.detectedOccasion).toBe('Wedding');
    expect(missingBudget.detectedCity).toBe('Pune');
    expect(missingBudget.detectedCategory).toBe('Catering and Food Services');
    expect(missingBudget.detectedDate).toBe('2026-12-15');
    expect(missingBudget.isBudgetAnswer).toBe(false);
    expect(missingBudget.flowCompleted).toBe(false);
    expect(missingBudget.nextQuestion).toBe(4);
    expect(missingBudget.assistantReply).toBe(QUESTION_4_BUDGET);
  });

  // Scenario 9: Returning users with completed saved event details can view recommendations without repeating questions
  it('Scenario 9: Returning users with completed saved event details restore recommendations immediately', () => {
    const savedEventContext = {
      occasion: 'Wedding',
      city: 'Pune' as const,
      category: 'Catering and Food Services' as const,
      hasAnsweredBudget: true,
      budget: 200000,
      hasAnsweredDate: true,
      date: '2026-12-15',
    };

    expect(isRequirementsComplete(savedEventContext)).toBe(true);

    // Incomplete event missing date does not pass
    const incompleteEventContext = {
      ...savedEventContext,
      hasAnsweredDate: false,
      date: undefined,
    };
    expect(isRequirementsComplete(incompleteEventContext)).toBe(false);
  });

  // Scenario 10: Changing an existing answer refreshes results without restarting conversation
  it('Scenario 10: Changing an existing answer refreshes results and retains other fields without restarting', () => {
    const postFlowContext = {
      currentOccasion: 'Wedding',
      currentCity: 'Pune' as const,
      currentAreas: ['Baner'],
      currentDate: '2026-12-15',
      currentCategory: 'Catering and Food Services' as const,
      currentBudget: 200000,
      hasAnsweredBudget: true,
      hasAnsweredDate: true,
      flowCompleted: true,
    };

    // User changes category post-flow
    const changeCategory = parseSearchIntent('Now show me decorators.', postFlowContext);
    expect(changeCategory.detectedCategory).toBe('Decoration Services');
    expect(changeCategory.flowCompleted).toBe(true);
    expect(changeCategory.assistantReply).toContain('Decoration Services');
    expect(changeCategory.assistantReply).toContain('retained');

    // User changes city post-flow
    const changeCity = parseSearchIntent('Change location to Mumbai.', postFlowContext);
    expect(changeCity.detectedCity).toBe('Mumbai');
    expect(changeCity.flowCompleted).toBe(true);
    expect(changeCity.assistantReply).toContain('Updated location to Mumbai');
  });

  // Scenario 11 & 12: Zero matches response text check
  it('Scenario 11: Correct message when 0 vendors match all requirements', () => {
    expect(FINAL_MESSAGE_NO_MATCHES).toBe(
      "I couldn't find vendors matching all your requirements. We can try a different date, location, or budget."
    );

    const zeroMatchIntent = parseSearchIntent('15 December 2026', {
      currentOccasion: 'Wedding',
      currentCity: 'Pune',
      currentCategory: 'Catering and Food Services',
      hasAnsweredBudget: true,
      currentBudget: 1000,
      matchedCount: 0,
    });
    expect(zeroMatchIntent.flowCompleted).toBe(true);
    expect(zeroMatchIntent.assistantReply).toBe(FINAL_MESSAGE_NO_MATCHES);
  });
});
