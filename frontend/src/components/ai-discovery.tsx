import { useState, useEffect, useMemo, useRef } from 'react';
import {
  CalendarDays,
  MapPin,
  Send,
  Sparkles,
  Users,
  Utensils,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  Clock,
  Briefcase,
  X,
  Edit2,
  Search,
  Check,
  SlidersHorizontal,
  Bookmark,
  DollarSign,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoSession } from '@/hooks/useDemoSession';
import { DEMO_VENDORS } from '@/data/demoVendors';
import { Vendor, VendorCategory, City, AvailabilityStatus, VendorSortOption } from '@/types/vendor';
import {
  parseSearchIntent,
  MUMBAI_LOCALITIES,
  PUNE_LOCALITIES,
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
  SUGGESTIONS_COMPLETED,
  isRequirementsComplete,
} from '@/utils/searchIntentParser';
import { filterVendors, getEffectiveAvailability } from '@/utils/vendorFilters';
import { isOrganizerCategory } from '@/types/shortlist';
import { VendorCard } from '@/components/vendors/VendorCard';
import { VendorProfileModal } from '@/components/vendors/VendorProfileModal';
import { VendorComparisonModal } from '@/components/vendors/VendorComparisonModal';
import { RequestQuotationModal } from '@/components/bookings/RequestQuotationModal';

interface Msg {
  id: string;
  from: 'ai' | 'me';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGE: Msg = {
  id: 'm-initial',
  from: 'ai',
  text: OPENING_MESSAGE,
  timestamp: 'Just now',
};

interface AIDiscoveryProps {
  eventId?: string;
  initialCategory?: string;
}

type ActiveEditModal = 'NONE' | 'DATE' | 'LOCATION' | 'GUESTS' | 'CATEGORY';

export function AIDiscovery({ eventId, initialCategory }: AIDiscoveryProps) {
  const {
    city,
    changeCity,
    activeEvent,
    calendarOverrides,
    createInquiry,
    shortlist,
    isShortlisted,
    toggleShortlist,
    removeFromShortlist,
  } = useDemoSession();

  // Mobile active tab (chat vs results)
  const [mobileTab, setMobileTab] = useState<'chat' | 'results'>('chat');

  const effectiveEventId = eventId || activeEvent?.id || 'evt-01';

  // Read saved event context for returning users (PRD Section 5)
  const savedContext = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`wedora_completed_discovery_${effectiveEventId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isRequirementsComplete(parsed)) {
          return parsed;
        }
      }
    } catch {}
    return null;
  }, [effectiveEventId]);

  // Shared Search & Event Context State
  const [activeOccasion, setActiveOccasion] = useState<string>(() => savedContext?.occasion || '');
  const [activeCategory, setActiveCategory] = useState<string>(
    () => savedContext?.category || initialCategory || ''
  );
  const [activeCategories, setActiveCategories] = useState<string[]>(
    () => savedContext?.categories || (initialCategory ? [initialCategory] : [])
  );
  const [activeCity, setActiveCity] = useState<City>(() => (savedContext?.city as City) || city || 'Pune');
  const [activeAreas, setActiveAreas] = useState<string[]>(() => savedContext?.areas || []);
  const [activeDate, setActiveDate] = useState<string>(() => savedContext?.date || '');
  const [isDateNotFinalized, setIsDateNotFinalized] = useState<boolean>(
    () => Boolean(savedContext?.isDateNotFinalized)
  );
  const [activeGuests, setActiveGuests] = useState<number>(() => savedContext?.guestCount || 500);
  const [minOrders, setMinOrders] = useState<number | undefined>(undefined);
  const [maxBudget, setMaxBudget] = useState<number | undefined>(() => savedContext?.budget);
  const [activeBudgetText, setActiveBudgetText] = useState<string>(() => savedContext?.budgetText || '');
  const [sortBy, setSortBy] = useState<VendorSortOption>('recommended');

  // Progressive 5-Question Tracking
  const [hasAnsweredOccasion, setHasAnsweredOccasion] = useState<boolean>(() => Boolean(savedContext));
  const [hasAnsweredLocation, setHasAnsweredLocation] = useState<boolean>(() => Boolean(savedContext));
  const [hasAnsweredCategory, setHasAnsweredCategory] = useState<boolean>(() => Boolean(savedContext));
  const [hasAnsweredBudget, setHasAnsweredBudget] = useState<boolean>(() => Boolean(savedContext));
  const [hasAnsweredDate, setHasAnsweredDate] = useState<boolean>(() => Boolean(savedContext));
  const [isFlowCompleted, setIsFlowCompleted] = useState<boolean>(() => Boolean(savedContext));
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(() =>
    savedContext ? SUGGESTIONS_COMPLETED : SUGGESTIONS_Q1
  );

  // Real LLM Status vs Deterministic Demo Fallback (PRD Version 4.0 Section 3.1)
  const [llmStatus, setLlmStatus] = useState<{
    isConfigured: boolean;
    provider: string;
    mode: string;
  }>({
    isConfigured: false,
    provider: 'Google Gemini (gemini-1.5-flash)',
    mode: 'DEMO_FALLBACK',
  });

  useEffect(() => {
    fetch('http://localhost:5001/api/ai/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLlmStatus({
            isConfigured: data.isConfigured,
            provider: data.provider,
            mode: data.mode,
          });
        }
      })
      .catch(() => {
        setLlmStatus({
          isConfigured: false,
          provider: 'Google Gemini (gemini-1.5-flash)',
          mode: 'DEMO_FALLBACK',
        });
      });
  }, []);

  // Modals state
  const [activeEditModal, setActiveEditModal] = useState<ActiveEditModal>('NONE');
  const [tempDate, setTempDate] = useState<string>(activeDate);
  const [tempCity, setTempCity] = useState<City>(activeCity);
  const [tempAreas, setTempAreas] = useState<string[]>(activeAreas);
  const [areaSearchTerm, setAreaSearchTerm] = useState<string>('');
  const [tempGuests, setTempGuests] = useState<number>(activeGuests);
  const [tempCategory, setTempCategory] = useState<string>(activeCategory);

  // Chat conversation state
  const [messages, setMessages] = useState<Msg[]>(() =>
    savedContext
      ? [{ id: 'm-restored', from: 'ai', text: FINAL_MESSAGE_MATCHES, timestamp: 'Just now' }]
      : [INITIAL_MESSAGE]
  );
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Modals for Vendor details & comparison
  const [profileVendor, setProfileVendor] = useState<Vendor | null>(null);
  const [quoteVendor, setQuoteVendor] = useState<Vendor | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Today's date boundary
  const todayStr = '2026-10-23';

  // Restore or reset context whenever effective event ID changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(`wedora_completed_discovery_${effectiveEventId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isRequirementsComplete(parsed)) {
          setActiveOccasion(parsed.occasion || '');
          setActiveCity((parsed.city as City) || 'Pune');
          setActiveAreas(parsed.areas || []);
          setActiveCategory(parsed.category || '');
          setActiveCategories(parsed.categories || (parsed.category ? [parsed.category] : []));
          setActiveDate(parsed.date || '');
          setIsDateNotFinalized(Boolean(parsed.isDateNotFinalized));
          setMaxBudget(parsed.budget);
          setActiveBudgetText(parsed.budgetText || '');
          setHasAnsweredOccasion(true);
          setHasAnsweredLocation(true);
          setHasAnsweredCategory(true);
          setHasAnsweredBudget(true);
          setHasAnsweredDate(true);
          setIsFlowCompleted(true);
          setCurrentSuggestions(SUGGESTIONS_COMPLETED);
          setMessages([
            { id: 'm-restored', from: 'ai', text: FINAL_MESSAGE_MATCHES, timestamp: 'Just now' },
          ]);
          return;
        }
      }
    } catch {}

    // Incomplete or new event: start fresh 5-question questionnaire
    setActiveOccasion('');
    setActiveAreas([]);
    setActiveCategory(initialCategory || '');
    setActiveCategories(initialCategory ? [initialCategory] : []);
    setActiveDate('');
    setIsDateNotFinalized(false);
    setMaxBudget(undefined);
    setActiveBudgetText('');
    setHasAnsweredOccasion(false);
    setHasAnsweredLocation(false);
    setHasAnsweredCategory(false);
    setHasAnsweredBudget(false);
    setHasAnsweredDate(false);
    setIsFlowCompleted(false);
    setCurrentSuggestions(SUGGESTIONS_Q1);
    setMessages([INITIAL_MESSAGE]);
  }, [effectiveEventId]);

  // Sync initialCategory when passed from outside
  useEffect(() => {
    if (initialCategory && !savedContext) {
      setActiveCategory(initialCategory);
      setActiveCategories([initialCategory]);
    }
  }, [initialCategory, savedContext]);

  // Sync with global city changes
  useEffect(() => {
    if (city && city !== activeCity && !savedContext) {
      setActiveCity(city);
      setActiveAreas([]);
    }
  }, [city, savedContext]);

  // CRITICAL RULE (Section 3): Vendor recommendations must appear ONLY after all five questions are answered.
  // When isFlowCompleted is false, searchResults returns 0 matches so no partial or loading cards are shown.
  const searchResults = useMemo(() => {
    if (!isFlowCompleted) {
      return { results: [], totalMatched: 0, criteriaApplied: [] };
    }
    return filterVendors(
      {
        category: activeCategory,
        categories: activeCategories,
        city: activeCity,
        areas: activeAreas.length > 0 ? activeAreas : undefined,
        date: isDateNotFinalized ? undefined : activeDate || undefined,
        guestCount: activeGuests,
        minOrders,
        maxBudget,
        sortBy,
      },
      calendarOverrides,
      DEMO_VENDORS
    );
  }, [
    isFlowCompleted,
    isDateNotFinalized,
    activeCategory,
    activeCategories,
    activeCity,
    activeAreas,
    activeDate,
    activeGuests,
    minOrders,
    maxBudget,
    sortBy,
    calendarOverrides,
  ]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Open modal helper
  const openEditModal = (modal: ActiveEditModal) => {
    if (modal === 'DATE') setTempDate(activeDate);
    if (modal === 'LOCATION') {
      setTempCity(activeCity);
      setTempAreas(activeAreas);
      setAreaSearchTerm('');
    }
    if (modal === 'GUESTS') setTempGuests(activeGuests);
    if (modal === 'CATEGORY') setTempCategory(activeCategory);
    setActiveEditModal(modal);
  };

  // Helper: process message from user (typed or clicked)
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    setInput('');
    const userMsg: Msg = {
      id: `m-${Date.now()}`,
      from: 'me',
      text,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      // 1. Check if Shortlist Remove Command
      const removeMatch = text.match(/remove\s+(?:the\s+)?(.*?)\s+(?:from|in)\s+(?:my\s+)?shortlist/i);
      if (removeMatch) {
        const queryName = removeMatch[1].trim().toLowerCase();
        const matchedItem = shortlist.find(
          (item) =>
            item.vendor.businessName.toLowerCase().includes(queryName) ||
            item.vendorId.toLowerCase().includes(queryName)
        );

        if (matchedItem) {
          removeFromShortlist(matchedItem.vendorId, activeEvent.id);
          const aiMsg: Msg = {
            id: `m-${Date.now() + 1}`,
            from: 'ai',
            text: `✓ Removed "${matchedItem.vendor.businessName}" from your shortlist for ${activeEvent.eventName}. Your shortlist has been updated immediately.`,
            timestamp: 'Just now',
          };
          setMessages((prev) => [...prev, aiMsg]);
        } else {
          const availableSaved = shortlist.map((i) => i.vendor.businessName).join(', ');
          const aiMsg: Msg = {
            id: `m-${Date.now() + 1}`,
            from: 'ai',
            text: `Could not find a vendor matching "${removeMatch[1]}" on your shortlist. Saved vendors currently include: ${availableSaved || 'None'}.`,
            timestamp: 'Just now',
          };
          setMessages((prev) => [...prev, aiMsg]);
        }
        setIsTyping(false);
        return;
      }

      // 2. Check if Shortlist Query Command
      if (
        text.toLowerCase().includes('shortlist') ||
        text.toLowerCase().includes('saved vendor') ||
        text.toLowerCase().includes('saved organizer')
      ) {
        let matchingItems = shortlist;
        const qLower = text.toLowerCase();
        let queryLabel = 'saved vendors and organizers';

        if (qLower.includes('cater') || qLower.includes('food')) {
          matchingItems = shortlist.filter(
            (i) => i.vendor.category === 'Catering and Food Services'
          );
          queryLabel = 'shortlisted caterers';
        } else if (qLower.includes('organizer') || qLower.includes('planner')) {
          matchingItems = shortlist.filter((i) => isOrganizerCategory(i.vendor.category));
          queryLabel = 'shortlisted event organizers';
        } else if (qLower.includes('pune')) {
          matchingItems = shortlist.filter((i) => i.vendor.primaryCity === 'Pune');
          queryLabel = 'shortlisted vendors in Pune';
        } else if (qLower.includes('mumbai')) {
          matchingItems = shortlist.filter((i) => i.vendor.primaryCity === 'Mumbai');
          queryLabel = 'shortlisted vendors in Mumbai';
        }

        let replyText = '';
        if (matchingItems.length === 0) {
          replyText = `You do not have any ${queryLabel} saved on your shortlist yet. You can click "Add to Shortlist" on any vendor card to save them.`;
        } else {
          const names = matchingItems
            .map((i) => `• ${i.vendor.businessName} (${i.vendor.category} in ${i.vendor.primaryCity})`)
            .join('\n');
          replyText = `Here are your ${queryLabel} (${matchingItems.length}):\n\n${names}\n\nYou can review complete quotes and budget details in the "My Shortlist" sidebar tab.`;
        }

        const aiMsg: Msg = {
          id: `m-${Date.now() + 1}`,
          from: 'ai',
          text: replyText,
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        return;
      }

      // 3. Regular Intent Parsing & Guided Journey
      const parsed = parseSearchIntent(text, {
        currentCity: hasAnsweredLocation ? activeCity : undefined,
        currentDate: hasAnsweredDate ? activeDate : undefined,
        isDateNotFinalized,
        hasAnsweredDate,
        currentAreas: hasAnsweredLocation ? activeAreas : [],
        currentGuestCount: activeGuests,
        currentCategory: hasAnsweredCategory ? (activeCategory as VendorCategory) : undefined,
        currentCategories: hasAnsweredCategory ? activeCategories : undefined,
        currentOccasion: hasAnsweredOccasion ? activeOccasion : undefined,
        currentBudget: maxBudget,
        hasAnsweredBudget,
        flowCompleted: isFlowCompleted,
        matchedCount: searchResults.totalMatched,
      });

      // Handle indexed shortlist command: e.g. "Shortlist the second vendor" (PRD Section 14 Scenario F)
      if (parsed.shortlistIndex !== undefined) {
        const targetVendor = searchResults.results[parsed.shortlistIndex];
        if (targetVendor) {
          toggleShortlist(targetVendor, eventId || activeEvent.id);
          const aiMsg: Msg = {
            id: `m-${Date.now() + 1}`,
            from: 'ai',
            text: `✓ Added "${targetVendor.businessName}" (${targetVendor.category} in ${targetVendor.primaryCity}) to your shortlist for ${activeEvent.eventName}.`,
            timestamp: 'Just now',
          };
          setMessages((prev) => [...prev, aiMsg]);
        } else {
          const aiMsg: Msg = {
            id: `m-${Date.now() + 1}`,
            from: 'ai',
            text: `Could not find vendor #${parsed.shortlistIndex + 1} in current search results (${searchResults.results.length} total matches).`,
            timestamp: 'Just now',
          };
          setMessages((prev) => [...prev, aiMsg]);
        }
        setIsTyping(false);
        return;
      }

      // Update state tracking
      let updatedOccasion = hasAnsweredOccasion ? activeOccasion : '';
      let updatedCity = hasAnsweredLocation ? activeCity : '';
      let updatedAreas = hasAnsweredLocation ? activeAreas : [];
      let updatedCategory = hasAnsweredCategory ? activeCategory : '';
      let updatedCategories = hasAnsweredCategory ? activeCategories : [];
      let updatedDate = hasAnsweredDate ? activeDate : '';
      let updatedBudget = maxBudget;
      let updatedHasBudget = hasAnsweredBudget;
      let updatedHasOccasion = hasAnsweredOccasion;
      let updatedHasLocation = hasAnsweredLocation;
      let updatedHasCategory = hasAnsweredCategory;
      let updatedHasDate = hasAnsweredDate;
      let effectiveDateNotFinalized = isDateNotFinalized;

      if (parsed.detectedOccasion) {
        setActiveOccasion(parsed.detectedOccasion);
        setHasAnsweredOccasion(true);
        updatedOccasion = parsed.detectedOccasion;
        updatedHasOccasion = true;
      }

      if (parsed.detectedCity) {
        setActiveCity(parsed.detectedCity);
        changeCity(parsed.detectedCity);
        setHasAnsweredLocation(true);
        updatedCity = parsed.detectedCity;
        updatedHasLocation = true;
      }

      if (parsed.detectedAreas && parsed.detectedAreas.length > 0) {
        setActiveAreas(parsed.detectedAreas);
        setHasAnsweredLocation(true);
        updatedAreas = parsed.detectedAreas;
        updatedHasLocation = true;
      } else if (parsed.detectedCity && parsed.detectedCity !== activeCity) {
        setActiveAreas([]);
        updatedAreas = [];
      }

      if (parsed.detectedCategory) {
        setActiveCategory(parsed.detectedCategory);
        setHasAnsweredCategory(true);
        updatedCategory = parsed.detectedCategory;
        updatedHasCategory = true;
      }

      if (parsed.detectedCategories && parsed.detectedCategories.length > 0) {
        setActiveCategories(parsed.detectedCategories);
        setHasAnsweredCategory(true);
        updatedCategories = parsed.detectedCategories;
        updatedHasCategory = true;
      }

      if (parsed.isBudgetAnswer || parsed.detectedMaxBudget !== undefined) {
        setMaxBudget(parsed.detectedMaxBudget);
        setHasAnsweredBudget(true);
        updatedBudget = parsed.detectedMaxBudget;
        updatedHasBudget = true;
        if (parsed.detectedMaxBudget) {
          setActiveBudgetText(`₹${parsed.detectedMaxBudget.toLocaleString('en-IN')}`);
        } else {
          setActiveBudgetText('Flexible / Quotations');
        }
      }

      if (parsed.isDateAnswer || parsed.detectedDate || parsed.isDateNotFinalized) {
        if (parsed.detectedDate) {
          setActiveDate(parsed.detectedDate);
          setIsDateNotFinalized(false);
          effectiveDateNotFinalized = false;
          updatedDate = parsed.detectedDate;
        } else if (parsed.isDateNotFinalized) {
          setActiveDate('');
          setIsDateNotFinalized(true);
          effectiveDateNotFinalized = true;
          updatedDate = '';
        }
        setHasAnsweredDate(true);
        updatedHasDate = true;
      }

      if (parsed.detectedGuestCount) setActiveGuests(parsed.detectedGuestCount);
      if (parsed.detectedSortBy) setSortBy(parsed.detectedSortBy);

      if (parsed.suggestedOptions) {
        setCurrentSuggestions(parsed.suggestedOptions);
      }

      // Check if all 5 questions have been answered or flow is completed
      const allFiveAnswered =
        isRequirementsComplete({
          occasion: updatedOccasion,
          city: (updatedCity || activeCity) as City,
          category: (updatedCategory || activeCategory) as VendorCategory,
          hasAnsweredBudget: updatedHasBudget,
          budget: updatedBudget,
          hasAnsweredDate: updatedHasDate,
          date: updatedDate,
          isDateNotFinalized: effectiveDateNotFinalized,
        }) || Boolean(parsed.flowCompleted);

      let replyText = parsed.assistantReply;

      if (allFiveAnswered) {
        setIsFlowCompleted(true);
        setCurrentSuggestions(SUGGESTIONS_COMPLETED);

        // Save completed event context into memory / localStorage (PRD Section 4 & 5)
        const completedDiscovery = {
          occasion: updatedOccasion,
          city: updatedCity || activeCity,
          areas: updatedAreas,
          category: updatedCategory || activeCategory,
          categories: updatedCategories.length > 0 ? updatedCategories : [updatedCategory || activeCategory],
          hasAnsweredBudget: true,
          budget: updatedBudget,
          budgetText: parsed.detectedMaxBudget
            ? `₹${parsed.detectedMaxBudget.toLocaleString('en-IN')}`
            : activeBudgetText || 'Flexible / Quotations',
          hasAnsweredDate: true,
          date: updatedDate,
          isDateNotFinalized: effectiveDateNotFinalized,
          isFlowCompleted: true,
        };
        try {
          localStorage.setItem(`wedora_completed_discovery_${effectiveEventId}`, JSON.stringify(completedDiscovery));
        } catch {}

        if (!isFlowCompleted) {
          const testResults = filterVendors(
            {
              category: updatedCategory || activeCategory,
              categories: updatedCategories.length > 0 ? updatedCategories : activeCategories,
              city: (updatedCity || activeCity) as City,
              areas: updatedAreas.length > 0 ? updatedAreas : undefined,
              date: effectiveDateNotFinalized ? undefined : (updatedDate || undefined),
              guestCount: activeGuests,
              maxBudget: updatedBudget,
            },
            calendarOverrides,
            DEMO_VENDORS
          );

          if (testResults.totalMatched > 0) {
            replyText = FINAL_MESSAGE_MATCHES;
          } else {
            replyText = FINAL_MESSAGE_NO_MATCHES;
          }
        }
      } else {
        setIsFlowCompleted(false);
      }

      const aiMsg: Msg = {
        id: `m-${Date.now() + 1}`,
        from: 'ai',
        text: replyText,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 380);
  };

  // Date selection handler
  const handleApplyDate = (newDate: string) => {
    if (!newDate || newDate < todayStr) {
      alert('Please select a valid upcoming event date.');
      return;
    }
    setActiveDate(newDate);
    setActiveEditModal('NONE');

    // Trigger next conversational step naturally
    handleSendMessage(`Date set to ${newDate}`);
  };

  // City & Area selection handler
  const handleApplyLocation = () => {
    setActiveCity(tempCity);
    changeCity(tempCity);
    setActiveAreas(tempAreas);
    setActiveEditModal('NONE');

    const areaDesc =
      tempAreas.length > 0 ? tempAreas.join(', ') : `Any Area in ${tempCity}`;
    handleSendMessage(`Location set to ${tempCity} (${areaDesc})`);
  };

  // Guest count selection handler
  const handleApplyGuests = (count: number) => {
    if (count <= 0) {
      alert('Please enter a positive whole number for guests.');
      return;
    }
    setActiveGuests(count);
    setActiveEditModal('NONE');
    handleSendMessage(`${count} guests`);
  };

  // Category selection handler
  const handleApplyCategory = (cat: string) => {
    setActiveCategory(cat);
    setActiveEditModal('NONE');
    handleSendMessage(cat);
  };

  // Refresh Results button
  const handleRefreshResults = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        from: 'ai',
        text: `Refreshed results against current vendor registry and live calendar availability. All search parameters remain intact. Showing ${searchResults.totalMatched} verified match(es).`,
        timestamp: 'Just now',
      },
    ]);
  };

  // Start New Conversation button
  const handleStartNewConversation = () => {
    try {
      localStorage.removeItem(`wedora_completed_discovery_${effectiveEventId}`);
    } catch {}
    setMessages([INITIAL_MESSAGE]);
    setActiveOccasion('');
    setHasAnsweredOccasion(false);
    setHasAnsweredLocation(false);
    setHasAnsweredCategory(false);
    setHasAnsweredBudget(false);
    setHasAnsweredDate(false);
    setIsFlowCompleted(false);
    setIsDateNotFinalized(false);
    setActiveBudgetText('');
    setMaxBudget(undefined);
    setActiveAreas([]);
    setCurrentSuggestions(SUGGESTIONS_Q1);
  };

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const comparedVendors = useMemo(() => {
    return DEMO_VENDORS.filter((v) => compareIds.includes(v.id));
  }, [compareIds]);

  // Filter localities for active temp city in modal
  const availableLocalities = tempCity === 'Mumbai' ? MUMBAI_LOCALITIES : PUNE_LOCALITIES;
  const filteredLocalities = availableLocalities.filter((loc) =>
    loc.toLowerCase().includes(areaSearchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)] min-h-[640px] flex flex-col overflow-hidden space-y-3">
      {/* Mobile Tab Toggle */}
      <div className="flex rounded-2xl bg-secondary p-1 lg:hidden shrink-0">
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-2 text-xs font-medium rounded-xl transition ${
            mobileTab === 'chat'
              ? 'bg-card text-plum shadow-soft font-semibold'
              : 'text-muted-foreground'
          }`}
        >
          <Sparkles className="size-3.5 inline mr-1 text-gold" /> AI Assistant Chat
        </button>
        <button
          onClick={() => setMobileTab('results')}
          className={`flex-1 py-2 text-xs font-medium rounded-xl transition ${
            mobileTab === 'results'
              ? 'bg-card text-plum shadow-soft font-semibold'
              : 'text-muted-foreground'
          }`}
        >
          <Utensils className="size-3.5 inline mr-1 text-gold" />{' '}
          {isFlowCompleted
            ? `Vendor Results (${searchResults.totalMatched})`
            : 'Vendor Recommendations'}
        </button>
      </div>

      {/* Main Grid: Left Panel (38% Chatbot), Right Panel (62% Vendor Results) */}
      <div className="flex-1 min-h-0 grid lg:grid-cols-[38fr_62fr] gap-6 overflow-hidden">
        {/* ================= LEFT COLUMN: FIXED CHATBOT PANEL (38%) ================= */}
        <div
          className={`h-full flex flex-col rounded-3xl border bg-card shadow-soft overflow-hidden ${
            mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* 1. Chat Header (shrink-0) */}
          <div className="flex items-center justify-between border-b p-3.5 bg-secondary/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-gradient-plum text-gold shrink-0">
                <Sparkles className="size-4.5" />
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-base text-plum font-semibold leading-tight">
                  Wedora AI Coordinator
                </h3>
                {llmStatus.isConfigured ? (
                  <span className="text-[10px] text-success flex items-center gap-1 font-medium bg-success-soft/60 px-2 py-0.5 rounded-full border border-success/30">
                    <span className="size-1.5 rounded-full bg-success inline-block"></span>
                    Live LLM Active ({llmStatus.provider})
                  </span>
                ) : (
                  <span
                    className="text-[10px] text-amber-700 dark:text-amber-400 flex items-center gap-1 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30"
                    title="GEMINI_API_KEY is unconfigured in server/.env. Running deterministic demo fallback against verified database."
                  >
                    <span className="size-1.5 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                    AI Mode: Deterministic Demo Fallback
                  </span>
                )}
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleRefreshResults}
                title="Refresh Results"
                className="p-1.5 text-muted-foreground hover:text-plum hover:bg-gold-soft rounded-full transition"
              >
                <RefreshCw className="size-3.5" />
              </button>
              <button
                onClick={handleStartNewConversation}
                title="Start New Conversation"
                className="p-1.5 text-muted-foreground hover:text-plum hover:bg-gold-soft rounded-full transition flex items-center gap-1 text-[11px] font-semibold"
              >
                <RotateCcw className="size-3.5" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            </div>
          </div>

          {/* 2. Messages Stream (flex-1 overflow-y-auto min-h-0) */}
          <div ref={chatScrollRef} className="flex-1 space-y-3.5 overflow-y-auto px-3.5 py-3 text-xs">
            {messages.map((m) => (
              <div key={m.id} className="space-y-2">
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-line ${
                    m.from === 'me'
                      ? 'ml-auto bg-plum text-primary-foreground rounded-br-sm'
                      : 'bg-secondary text-secondary-foreground rounded-bl-sm border'
                  }`}
                >
                  <div>{m.text}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary p-3 text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="size-3.5 animate-spin text-gold" />
                Wedora AI is coordinating with verified vendor registries...
              </div>
            )}
          </div>

          {/* Optional Suggested Answer Chips (Section 2 & 6) */}
          {currentSuggestions && currentSuggestions.length > 0 && !isTyping && (
            <div className="px-3.5 py-2 border-t bg-secondary/30 shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Sparkles className="size-3 text-gold" /> Suggestions:
              </span>
              {currentSuggestions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSendMessage(opt)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-card hover:bg-gold-soft text-navy border hover:border-gold transition shrink-0 font-medium shadow-2xs"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* 3. Input Bar (shrink-0 border-t bg-card) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2 p-3 border-t bg-card shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message or answer here (e.g. Wedding, Pune, Catering)..."
              className="flex-1 rounded-full border bg-background px-4 py-2 text-xs outline-none focus:border-gold font-medium"
            />
            <Button
              type="submit"
              variant="hero"
              size="icon"
              disabled={isTyping || !input.trim()}
              aria-label="Send message"
            >
              <Send className="size-3.5" />
            </Button>
          </form>
        </div>

        {/* ================= RIGHT COLUMN: INDEPENDENTLY SCROLLING VENDORS (62%) ================= */}
        <div
          className={`h-full flex flex-col min-h-0 overflow-hidden ${
            mobileTab === 'results' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {!isFlowCompleted ? (
            /* ================= FRIENDLY EMPTY STATE (MANDATORY 5-QUESTION PROGRESS) ================= */
            <div className="h-full flex flex-col min-h-0">
              <div className="shrink-0 mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-3.5 sm:p-4 border shadow-soft">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-display text-plum font-semibold">
                      Wedora Vendor Recommendations
                    </h2>
                    <span className="rounded-full bg-gold-soft text-navy px-2.5 py-0.5 text-xs font-bold border border-gold/40">
                      Step {(!hasAnsweredOccasion ? 1 : !hasAnsweredLocation ? 2 : !hasAnsweredCategory ? 3 : !hasAnsweredBudget ? 4 : 5)} of 5
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {FRIENDLY_EMPTY_STATE}
                  </p>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1.5 space-y-3">
                <div className="rounded-3xl border bg-card p-6 sm:p-8 shadow-soft space-y-6">
                  <div className="flex items-start gap-3.5 pb-4 border-b">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-plum text-gold shrink-0 mt-0.5">
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base sm:text-lg text-plum font-semibold leading-tight">
                        {FRIENDLY_EMPTY_STATE}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Wedora tailors vendor recommendations strictly to your specific event requirements. Complete the 5 questions on the left, and verified vendor listings with live calendar availability will appear here automatically.
                      </p>
                    </div>
                  </div>

                  {/* 5-Step Progressive Checklist */}
                  <div className="space-y-3 text-xs">
                    {/* Step 1 */}
                    <div className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                      hasAnsweredOccasion ? 'bg-success-soft/30 border-success/30' : 'bg-secondary/40 border-border'
                    }`}>
                      <div className="flex items-center gap-3">
                        {hasAnsweredOccasion ? (
                          <CheckCircle2 className="size-4.5 text-success shrink-0" />
                        ) : (
                          <span className="flex size-4.5 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-navy">1</span>
                        )}
                        <div>
                          <div className="font-semibold text-navy">Question 1 — Event</div>
                          <div className={hasAnsweredOccasion ? 'font-medium text-plum mt-0.5' : 'text-muted-foreground italic mt-0.5'}>
                            {hasAnsweredOccasion ? activeOccasion : QUESTION_1_EVENT}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasAnsweredOccasion ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {hasAnsweredOccasion ? 'Completed' : 'Awaiting'}
                      </span>
                    </div>

                    {/* Step 2 */}
                    <div className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                      hasAnsweredLocation ? 'bg-success-soft/30 border-success/30' : 'bg-secondary/40 border-border'
                    }`}>
                      <div className="flex items-center gap-3">
                        {hasAnsweredLocation ? (
                          <CheckCircle2 className="size-4.5 text-success shrink-0" />
                        ) : (
                          <span className="flex size-4.5 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-navy">2</span>
                        )}
                        <div>
                          <div className="font-semibold text-navy">Question 2 — Location</div>
                          <div className={hasAnsweredLocation ? 'font-medium text-plum mt-0.5' : 'text-muted-foreground italic mt-0.5'}>
                            {hasAnsweredLocation
                              ? `${activeCity}${activeAreas.length > 0 ? ` (${activeAreas.join(', ')})` : ' (City-wide)'}`
                              : QUESTION_2_LOCATION}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasAnsweredLocation ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {hasAnsweredLocation ? 'Completed' : 'Awaiting'}
                      </span>
                    </div>

                    {/* Step 3 */}
                    <div className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                      hasAnsweredCategory ? 'bg-success-soft/30 border-success/30' : 'bg-secondary/40 border-border'
                    }`}>
                      <div className="flex items-center gap-3">
                        {hasAnsweredCategory ? (
                          <CheckCircle2 className="size-4.5 text-success shrink-0" />
                        ) : (
                          <span className="flex size-4.5 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-navy">3</span>
                        )}
                        <div>
                          <div className="font-semibold text-navy">Question 3 — Vendor Category</div>
                          <div className={hasAnsweredCategory ? 'font-medium text-plum mt-0.5' : 'text-muted-foreground italic mt-0.5'}>
                            {hasAnsweredCategory ? activeCategory : QUESTION_3_CATEGORY}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasAnsweredCategory ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {hasAnsweredCategory ? 'Completed' : 'Awaiting'}
                      </span>
                    </div>

                    {/* Step 4 */}
                    <div className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                      hasAnsweredBudget ? 'bg-success-soft/30 border-success/30' : 'bg-secondary/40 border-border'
                    }`}>
                      <div className="flex items-center gap-3">
                        {hasAnsweredBudget ? (
                          <CheckCircle2 className="size-4.5 text-success shrink-0" />
                        ) : (
                          <span className="flex size-4.5 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-navy">4</span>
                        )}
                        <div>
                          <div className="font-semibold text-navy">Question 4 — Budget</div>
                          <div className={hasAnsweredBudget ? 'font-medium text-plum mt-0.5' : 'text-muted-foreground italic mt-0.5'}>
                            {hasAnsweredBudget
                              ? (activeBudgetText || (maxBudget ? `₹${maxBudget.toLocaleString('en-IN')}` : 'Flexible / Quotations'))
                              : QUESTION_4_BUDGET}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasAnsweredBudget ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {hasAnsweredBudget ? 'Completed' : 'Awaiting'}
                      </span>
                    </div>

                    {/* Step 5 */}
                    <div className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                      hasAnsweredDate ? 'bg-success-soft/30 border-success/30' : 'bg-secondary/40 border-border'
                    }`}>
                      <div className="flex items-center gap-3">
                        {hasAnsweredDate ? (
                          <CheckCircle2 className="size-4.5 text-success shrink-0" />
                        ) : (
                          <span className="flex size-4.5 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-navy">5</span>
                        )}
                        <div>
                          <div className="font-semibold text-navy">Question 5 — Date</div>
                          <div className={hasAnsweredDate ? 'font-medium text-plum mt-0.5' : 'text-muted-foreground italic mt-0.5'}>
                            {hasAnsweredDate
                              ? (isDateNotFinalized ? 'Not finalized yet (Availability unverified)' : activeDate)
                              : QUESTION_5_DATE}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasAnsweredDate ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {hasAnsweredDate ? 'Completed' : 'Awaiting'}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gold-soft/40 p-4 border border-gold/30 flex items-start gap-3">
                    <Clock className="size-4 text-gold shrink-0 mt-0.5" />
                    <p className="text-xs text-navy leading-relaxed">
                      <strong>Automatic Vendor Display:</strong> Verified vendor listings will appear automatically right here once Question 5 has been answered or explicitly marked as not finalized yet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= FULL VENDOR RESULTS CONTAINER ================= */
            <>
              {/* Header Bar inside Right Panel (shrink-0) */}
              <div className="shrink-0 mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-3.5 sm:p-4 border shadow-soft">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-display text-plum font-semibold">
                      {activeCategory}
                    </h2>
                    <span className="rounded-full bg-gold-soft text-navy px-2.5 py-0.5 text-xs font-bold border border-gold/40">
                      {searchResults.totalMatched} Verified Matches
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeCity} {activeAreas.length > 0 ? `(${activeAreas.join(', ')})` : '(Any Area)'} · {isDateNotFinalized ? 'Date: Not finalized yet' : activeDate} {maxBudget ? `· Budget: ≤ ₹${maxBudget.toLocaleString('en-IN')}` : '· Flexible Budget'}
                  </p>
                </div>

                {/* Sort Controls */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-medium flex items-center gap-1">
                    <SlidersHorizontal className="size-3 text-gold" />
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as VendorSortOption)}
                    className="rounded-full border bg-background px-3 py-1.5 text-xs font-semibold text-navy outline-none focus:border-gold cursor-pointer"
                  >
                    <option value="recommended">Recommended (Performance & Trust)</option>
                    <option value="completed_orders">Most Completed Orders</option>
                    <option value="referrals">Most Successful Referrals</option>
                    <option value="on_time_delivery">Highest On-Time Delivery</option>
                    <option value="repeat_orders">Most Repeat Bookings</option>
                    <option value="price_asc">Starting Price: Low to High</option>
                    <option value="price_desc">Starting Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Independently Scrolling Vendor Cards Container */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1.5 space-y-4">
                {searchResults.results.map((vendor) => {
                  const effectiveStatus = isDateNotFinalized
                    ? 'Unverified Availability'
                    : getEffectiveAvailability(vendor, activeDate, calendarOverrides);
                  const saved = isShortlisted(vendor.id, eventId || activeEvent.id);

                  return (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      targetDate={isDateNotFinalized ? 'Not finalized yet' : activeDate}
                      effectiveAvailability={effectiveStatus}
                      isComparing={compareIds.includes(vendor.id)}
                      isShortlisted={saved}
                      selectedAreas={activeAreas}
                      selectedCity={activeCity}
                      onToggleCompare={handleToggleCompare}
                      onViewProfile={(v) => setProfileVendor(v)}
                      onRequestQuote={(v) => setQuoteVendor(v)}
                      onShortlist={() => toggleShortlist(vendor, eventId || activeEvent.id)}
                    />
                  );
                })}

                {/* Empty State */}
                {searchResults.results.length === 0 && (
                  <div className="rounded-3xl border bg-card p-12 text-center shadow-soft">
                    <Clock className="size-12 mx-auto text-gold mb-3 animate-pulse" />
                    <h3 className="text-xl font-display text-plum font-semibold">
                      No Matching Vendors Found
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
                      No verified vendors in <strong className="text-navy">{activeCity}</strong> match your exact criteria for {activeCategory} on {activeDate}.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      <Button
                        variant="soft"
                        size="sm"
                        onClick={() => setActiveAreas([])}
                      >
                        Expand to Any Area in {activeCity}
                      </Button>
                      <Button
                        variant="soft"
                        size="sm"
                        onClick={() => {
                          const otherCity = activeCity === 'Pune' ? 'Mumbai' : 'Pune';
                          setActiveCity(otherCity);
                          changeCity(otherCity);
                          setActiveAreas([]);
                        }}
                      >
                        Switch to {activeCity === 'Pune' ? 'Mumbai' : 'Pune'}
                      </Button>
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={handleStartNewConversation}
                      >
                        Start New Conversation
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Compare Bar */}
              {compareIds.length > 0 && (
                <div className="shrink-0 mt-3 rounded-2xl bg-gradient-plum p-3.5 text-primary-foreground shadow-float flex flex-wrap items-center justify-between gap-3 animate-rise">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="size-4 text-gold shrink-0" />
                    <span>
                      <strong>{compareIds.length} vendor(s)</strong> selected for verified transaction comparison
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-primary-foreground hover:bg-white/10"
                      onClick={() => setCompareIds([])}
                    >
                      Clear Selection
                    </Button>
                    <Button
                      size="sm"
                      variant="gold"
                      onClick={() => setIsCompareOpen(true)}
                    >
                      Compare Metrics Now
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ================= FUNCTIONAL INTERACTIVE SELECTION MODALS (FROM CONTEXT CARD [EDIT]) ================= */}

      {/* 1. Date Selection Modal */}
      {activeEditModal === 'DATE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-float border border-gold/40 relative animate-rise my-8 text-xs">
            <button
              onClick={() => setActiveEditModal('NONE')}
              className="absolute right-5 top-5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-plum text-gold">
                <CalendarDays className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-display text-plum font-semibold">
                  Select Event Date
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Filter factual vendor availability by date
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block font-semibold text-navy mb-1.5">
                  Interactive Calendar Date Picker:
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-gold font-semibold text-navy"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  * Past dates are not selectable for upcoming events.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-navy mb-1.5">
                  Popular Wedding Date Presets:
                </label>
                <div className="space-y-1.5">
                  {KEY_DATES.map((kd) => (
                    <button
                      key={kd.date}
                      type="button"
                      onClick={() => setTempDate(kd.date)}
                      className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition ${
                        tempDate === kd.date
                          ? 'border-gold bg-gold-soft font-semibold text-plum'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      <span>{kd.label}</span>
                      {tempDate === kd.date && <Check className="size-4 text-gold" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setActiveEditModal('NONE')}>
                  Cancel
                </Button>
                <Button variant="hero" onClick={() => handleApplyDate(tempDate)}>
                  Apply Date
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. City & Local Area Selection Modal */}
      {activeEditModal === 'LOCATION' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-float border border-gold/40 relative animate-rise my-8 text-xs">
            <button
              onClick={() => setActiveEditModal('NONE')}
              className="absolute right-5 top-5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-plum text-gold">
                <MapPin className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-display text-plum font-semibold">
                  Select City & Local Areas
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Filter vendors serving your preferred locations
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block font-semibold text-navy mb-1.5">Primary City:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Pune', 'Mumbai'] as City[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setTempCity(c);
                        setTempAreas([]);
                        setAreaSearchTerm('');
                      }}
                      className={`p-3 rounded-xl border text-center transition ${
                        tempCity === c
                          ? 'border-gold bg-gold-soft font-bold text-plum ring-2 ring-gold/40'
                          : 'bg-secondary hover:border-gold/50'
                      }`}
                    >
                      <span className="text-sm block">{c}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {c === 'Pune' ? '12 Localities · 50 Vendors' : '13 Localities · 50 Vendors'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-navy">
                    Preferred Localities in {tempCity}:
                  </label>
                  <button
                    type="button"
                    onClick={() => setTempAreas([])}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition ${
                      tempAreas.length === 0
                        ? 'bg-plum text-primary-foreground border-plum'
                        : 'text-muted-foreground hover:text-plum'
                    }`}
                  >
                    Any Area in {tempCity}
                  </button>
                </div>

                <div className="relative mb-2">
                  <Search className="size-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={areaSearchTerm}
                    onChange={(e) => setAreaSearchTerm(e.target.value)}
                    placeholder={`Search localities in ${tempCity}...`}
                    className="w-full rounded-xl border bg-background pl-8 pr-3 py-1.5 text-xs outline-none focus:border-gold"
                  />
                </div>

                <div className="max-h-44 overflow-y-auto rounded-xl border p-2 bg-secondary/30 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {filteredLocalities.map((loc) => {
                    const isSelected = tempAreas.includes(loc);
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setTempAreas((prev) =>
                            prev.includes(loc) ? prev.filter((a) => a !== loc) : [...prev, loc]
                          );
                        }}
                        className={`p-2 rounded-lg text-left text-[11px] border flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-plum text-primary-foreground border-plum font-semibold'
                            : 'bg-card text-navy hover:bg-gold-soft hover:border-gold'
                        }`}
                      >
                        <span className="truncate">{loc}</span>
                        {isSelected && <Check className="size-3 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Selected: {tempAreas.length > 0 ? tempAreas.join(', ') : `Any Area in ${tempCity}`}
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setActiveEditModal('NONE')}>
                  Cancel
                </Button>
                <Button variant="hero" onClick={handleApplyLocation}>
                  Apply Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Guest Count Selection Modal */}
      {activeEditModal === 'GUESTS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-float border border-gold/40 relative animate-rise my-8 text-xs">
            <button
              onClick={() => setActiveEditModal('NONE')}
              className="absolute right-5 top-5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-plum text-gold">
                <Users className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-display text-plum font-semibold">
                  Select Guest Count
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Capacity filtering applies to catering, venues, accommodation, and planners
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block font-semibold text-navy mb-1.5">
                  Quick Guest Count Ranges:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GUEST_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setTempGuests(preset.val)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                        tempGuests === preset.val
                          ? 'border-gold bg-gold-soft font-semibold text-plum ring-2 ring-gold/40'
                          : 'bg-secondary hover:bg-card'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {tempGuests === preset.val && <Check className="size-3.5 text-gold" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-navy mb-1.5">
                  Exact Guest Count (Positive whole number):
                </label>
                <input
                  type="number"
                  min={1}
                  value={tempGuests}
                  onChange={(e) => setTempGuests(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-gold font-semibold text-navy"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setActiveEditModal('NONE')}>
                  Cancel
                </Button>
                <Button variant="hero" onClick={() => handleApplyGuests(tempGuests)}>
                  Apply Guest Count
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Category Selection Modal */}
      {activeEditModal === 'CATEGORY' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-float border border-gold/40 relative animate-rise my-8 text-xs">
            <button
              onClick={() => setActiveEditModal('NONE')}
              className="absolute right-5 top-5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-plum text-gold">
                <Utensils className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-display text-plum font-semibold">
                  Select Vendor Service Category
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Browse any of the 12 verified wedding vendor categories
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTempCategory(cat)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                      tempCategory === cat
                        ? 'border-gold bg-gold-soft font-semibold text-plum ring-2 ring-gold/40'
                        : 'bg-secondary hover:bg-card'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {tempCategory === cat && <Check className="size-3.5 text-gold shrink-0 ml-1" />}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setActiveEditModal('NONE')}>
                  Cancel
                </Button>
                <Button variant="hero" onClick={() => handleApplyCategory(tempCategory)}>
                  Apply Category
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileVendor && (
        <VendorProfileModal
          vendor={profileVendor}
          onClose={() => setProfileVendor(null)}
          onRequestQuote={(v) => {
            setProfileVendor(null);
            setQuoteVendor(v);
          }}
          isShortlisted={isShortlisted(profileVendor.id, eventId || activeEvent.id)}
          onShortlist={(v) => toggleShortlist(v, eventId || activeEvent.id)}
          targetDate={activeDate}
          selectedAreas={activeAreas}
          selectedCity={activeCity}
          availabilityStatus={getEffectiveAvailability(
            profileVendor,
            activeDate,
            calendarOverrides
          )}
        />
      )}

      {/* Comparison Modal */}
      {isCompareOpen && (
        <VendorComparisonModal
          vendors={comparedVendors}
          onClose={() => setIsCompareOpen(false)}
          onRequestQuote={(v) => {
            setIsCompareOpen(false);
            setQuoteVendor(v);
          }}
        />
      )}

      {/* Request Quotation Modal */}
      {quoteVendor && (
        <RequestQuotationModal
          vendor={quoteVendor}
          targetDate={activeDate}
          guestCount={activeGuests}
          onClose={() => setQuoteVendor(null)}
          onSubmit={({ requirements, guestCount }) => {
            createInquiry({
              eventId: activeEvent.id,
              vendorId: quoteVendor.id,
              vendorBusinessName: quoteVendor.businessName,
              serviceCategory: quoteVendor.category,
              requirements,
              guestCount,
            });
            alert(`Quotation request sent to ${quoteVendor.businessName}!`);
          }}
        />
      )}
    </div>
  );
}

export default AIDiscovery;
