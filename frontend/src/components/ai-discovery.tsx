import { useState, useMemo } from 'react';
import {
  CalendarDays,
  MapPin,
  Sparkles,
  Users,
  Utensils,
  X,
  Search,
  Check,
  SlidersHorizontal,
  Bookmark,
  DollarSign,
  Heart,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Briefcase,
  Store,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoSession } from '@/hooks/useDemoSession';
import { DEMO_VENDORS } from '@/data/demoVendors';
import { Vendor, VendorCategory, City, AvailabilityStatus, VendorSortOption } from '@/types/vendor';
import {
  MUMBAI_LOCALITIES,
  PUNE_LOCALITIES,
} from '@/utils/searchIntentParser';
import { filterVendors, getEffectiveAvailability } from '@/utils/vendorFilters';
import { isOrganizerCategory } from '@/types/shortlist';
import { VendorCard } from '@/components/vendors/VendorCard';
import { VendorProfileModal } from '@/components/vendors/VendorProfileModal';
import { VendorComparisonModal } from '@/components/vendors/VendorComparisonModal';
import { RequestQuotationModal } from '@/components/bookings/RequestQuotationModal';

export interface VendorBundleItem {
  category: string;
  vendor: Vendor;
  matchReason?: string;
}

export interface AIDiscoveryProps {
  eventId?: string;
  initialCategory?: string;
  role?: 'CUSTOMER' | 'VENDOR' | 'PLANNER';
  vendorContext?: any;
  onlyOrganizers?: boolean;
}

type ActiveEditModal = 'NONE' | 'DATE' | 'LOCATION' | 'GUESTS' | 'CATEGORY';

export const KEY_DATES = [
  { label: '15 Dec 2026 (Peak Wedding Auspicious Muhurat)', date: '2026-12-15' },
  { label: '20 Dec 2026 (Winter Weekend)', date: '2026-12-20' },
  { label: '28 Dec 2026 (Year-End Festive Season)', date: '2026-12-28' },
  { label: '14 Jan 2027 (Makar Sankranti Auspicious)', date: '2027-01-14' },
];

export const GUEST_PRESETS = [
  { label: 'Intimate (100–250 guests)', val: 200 },
  { label: 'Medium (300–500 guests)', val: 500 },
  { label: 'Grand (600–800 guests)', val: 750 },
  { label: 'Royal (1,000+ guests)', val: 1200 },
];

export const ALL_CATEGORIES = [
  'Catering and Food Services',
  'Venues and Banquet Spaces',
  'Photography and Cinematography',
  'Floral and Event Decor',
  'Sound, Lighting and DJ',
  'Makeup, Hair and Styling',
  'Bridal and Groom Wear',
  'Invitations and Stationery',
  'Entertainment and Performers',
  'Transportation and Logistics',
  'Event Organizers / Wedding Planners',
  'End-to-End Event Management',
];

export const ORGANIZER_CATEGORIES = [
  'Event Organizers / Wedding Planners',
  'End-to-End Event Management',
];

export function AIDiscovery({
  eventId,
  initialCategory,
  role = 'CUSTOMER',
  vendorContext,
  onlyOrganizers = false,
}: AIDiscoveryProps) {
  const {
    city,
    changeCity,
    activeEvent,
    calendarOverrides,
    createInquiry,
    shortlist,
    isShortlisted,
    toggleShortlist,
  } = useDemoSession();

  const effectiveEventId = eventId || activeEvent?.id || 'evt-01';

  // Vendor Bundle & Swap state for Professional Organizer (PRD Section 8)
  const [vendorBundle, setVendorBundle] = useState<VendorBundleItem[] | null>(null);
  const [swappingCategory, setSwappingCategory] = useState<string | null>(null);

  // Search & Filter State
  const [activeCity, setActiveCity] = useState<City>(() => (city as City) || 'Pune');
  const [activeAreas, setActiveAreas] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(() =>
    onlyOrganizers
      ? 'All Event Planners'
      : initialCategory || 'All Categories'
  );
  const [activeDate, setActiveDate] = useState<string>('2026-12-15');
  const [isDateNotFinalized, setIsDateNotFinalized] = useState<boolean>(false);
  const [activeGuests, setActiveGuests] = useState<number>(500);
  const [maxBudget, setMaxBudget] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<VendorSortOption>('recommended');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals state
  const [activeEditModal, setActiveEditModal] = useState<ActiveEditModal>('NONE');
  const [tempDate, setTempDate] = useState<string>(activeDate);
  const [tempCity, setTempCity] = useState<City>(activeCity);
  const [tempAreas, setTempAreas] = useState<string[]>(activeAreas);
  const [areaSearchTerm, setAreaSearchTerm] = useState<string>('');
  const [tempGuests, setTempGuests] = useState<number>(activeGuests);
  const [tempCategory, setTempCategory] = useState<string>(activeCategory);

  // Modals for Vendor details & comparison
  const [profileVendor, setProfileVendor] = useState<Vendor | null>(null);
  const [quoteVendor, setQuoteVendor] = useState<Vendor | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Today's date boundary
  const todayStr = '2026-10-23';

  // Base list of vendors: if onlyOrganizers is true, STRICTLY filter out all non-planners
  const baseVendors = useMemo(() => {
    if (onlyOrganizers) {
      return DEMO_VENDORS.filter((v) => isOrganizerCategory(v.category));
    }
    return DEMO_VENDORS;
  }, [onlyOrganizers]);

  // Available category chips
  const categoryChips = useMemo(() => {
    if (onlyOrganizers) {
      return ['All Event Planners', ...ORGANIZER_CATEGORIES];
    }
    return ['All Categories', ...ALL_CATEGORIES];
  }, [onlyOrganizers]);

  // Search Results computation
  const searchResults = useMemo(() => {
    let effectiveCategory: string | undefined = undefined;
    if (onlyOrganizers) {
      if (activeCategory === 'Event Organizers / Wedding Planners' || activeCategory === 'End-to-End Event Management') {
        effectiveCategory = activeCategory;
      }
    } else if (activeCategory && activeCategory !== 'All Categories') {
      effectiveCategory = activeCategory;
    }

    const filtered = filterVendors(
      {
        category: effectiveCategory,
        city: activeCity,
        areas: activeAreas.length > 0 ? activeAreas : undefined,
        date: isDateNotFinalized ? undefined : activeDate || undefined,
        guestCount: activeGuests,
        maxBudget,
        sortBy,
      },
      calendarOverrides,
      baseVendors
    );

    // Apply text search filter if user typed in search input
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const textMatches = filtered.results.filter(
        (v) =>
          v.businessName.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.about.toLowerCase().includes(q) ||
          v.serviceableAreas.some((a) => a.toLowerCase().includes(q)) ||
          v.tags?.some((t) => t.toLowerCase().includes(q))
      );
      return {
        ...filtered,
        results: textMatches,
        totalMatched: textMatches.length,
      };
    }

    return filtered;
  }, [
    onlyOrganizers,
    baseVendors,
    activeCategory,
    activeCity,
    activeAreas,
    activeDate,
    isDateNotFinalized,
    activeGuests,
    maxBudget,
    sortBy,
    searchTerm,
    calendarOverrides,
  ]);

  // Comparison Vendors
  const comparedVendors = useMemo(() => {
    return DEMO_VENDORS.filter((v) => compareIds.includes(v.id));
  }, [compareIds]);

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Build Vendor Bundle for Planner
  const handleBuildBundle = () => {
    const catering =
      DEMO_VENDORS.find(
        (v) => v.category === 'Catering and Food Services' && v.primaryCity === activeCity
      ) || DEMO_VENDORS[0];
    const decor =
      DEMO_VENDORS.find(
        (v) => (v.category === 'Floral and Event Decor' || v.category.includes('Decor')) && v.primaryCity === activeCity
      ) || DEMO_VENDORS[1];
    const photo =
      DEMO_VENDORS.find(
        (v) => (v.category === 'Photography and Cinematography' || v.category.includes('Photo')) && v.primaryCity === activeCity
      ) || DEMO_VENDORS[2];
    const venue =
      DEMO_VENDORS.find(
        (v) => (v.category === 'Venues and Banquet Spaces' || v.category.includes('Venue')) && v.primaryCity === activeCity
      ) || DEMO_VENDORS[3];

    const bundle: VendorBundleItem[] = [
      {
        category: 'Venues and Banquet Spaces',
        vendor: venue,
        matchReason: 'Historical venue partner · 99% capacity compliance',
      },
      {
        category: 'Catering and Food Services',
        vendor: catering,
        matchReason: 'Previously collaborated at venue · 98% on-time delivery',
      },
      {
        category: 'Floral and Event Decor',
        vendor: decor,
        matchReason: 'Preferred decor partner · 4.9 recorded delivery score',
      },
      {
        category: 'Photography and Cinematography',
        vendor: photo,
        matchReason: 'Consistent milestone delivery · Verified client feedback',
      },
    ];

    setVendorBundle(bundle);
    setSwappingCategory(null);
  };

  // Swap Vendor in Bundle
  const handleSwapVendor = (categoryToSwap: string, newVendor: Vendor) => {
    if (!vendorBundle) return;
    setVendorBundle((prev) =>
      prev
        ? prev.map((item) =>
            item.category === categoryToSwap
              ? { ...item, vendor: newVendor, matchReason: 'Swapped by organizer' }
              : item
          )
        : null
    );
    setSwappingCategory(null);
  };

  // Date apply handler
  const handleApplyDate = (newDate: string) => {
    if (!newDate || newDate < todayStr) {
      alert('Please select a valid upcoming event date.');
      return;
    }
    setActiveDate(newDate);
    setIsDateNotFinalized(false);
    setActiveEditModal('NONE');
  };

  // City & Area apply handler
  const handleApplyLocation = () => {
    setActiveCity(tempCity);
    changeCity(tempCity);
    setActiveAreas(tempAreas);
    setActiveEditModal('NONE');
  };

  // Guest count apply handler
  const handleApplyGuests = (count: number) => {
    if (count <= 0) {
      alert('Please enter a positive whole number for guests.');
      return;
    }
    setActiveGuests(count);
    setActiveEditModal('NONE');
  };

  // Filter localities for active temp city in modal
  const availableLocalities = tempCity === 'Mumbai' ? MUMBAI_LOCALITIES : PUNE_LOCALITIES;
  const filteredLocalities = availableLocalities.filter((loc) =>
    loc.toLowerCase().includes(areaSearchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* ================= TOP DIRECTORY HEADER & ACTIONS ================= */}
      <div className="rounded-3xl border bg-card p-4 sm:p-5 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-plum text-gold shrink-0">
              {onlyOrganizers ? <Briefcase className="size-5" /> : <Store className="size-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-display text-plum font-semibold">
                  {onlyOrganizers
                    ? 'Verified Event Planners & Coordinators'
                    : activeCategory === 'All Categories'
                    ? 'All Verified Wedding Vendors'
                    : activeCategory}
                </h2>
                <span className="rounded-full bg-gold-soft text-navy px-2.5 py-0.5 text-xs font-bold border border-gold/40">
                  {searchResults.totalMatched} Verified {onlyOrganizers ? 'Planners' : 'Matches'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {onlyOrganizers
                  ? `Professional wedding planners and end-to-end event management teams in ${activeCity}. Only verified event organizers are displayed.`
                  : `Verified wedding professionals serving ${activeCity} ${
                      activeAreas.length > 0 ? `(${activeAreas.join(', ')})` : '(All Localities)'
                    } · ${isDateNotFinalized ? 'Date: Flexible' : `Date: ${activeDate}`}`}
              </p>
            </div>
          </div>

          {/* Header Action Buttons (Planner Bundle Button, Reset, etc.) */}
          <div className="flex items-center gap-2">
            {role === 'PLANNER' && (
              <>
                {vendorBundle ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-gold text-plum hover:bg-gold-soft font-semibold"
                    onClick={() => {
                      setVendorBundle(null);
                      setSwappingCategory(null);
                    }}
                  >
                    <RotateCcw className="size-3.5 mr-1.5" /> Return to Full Directory
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="hero"
                    className="text-xs font-semibold"
                    onClick={handleBuildBundle}
                  >
                    <Layers className="size-3.5 mr-1.5" /> Build Vendor Bundle
                  </Button>
                )}
              </>
            )}

            {/* City Switcher Pill */}
            <div className="flex rounded-full bg-secondary p-1 border">
              {(['Pune', 'Mumbai'] as City[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setActiveCity(c);
                    changeCity(c);
                    setActiveAreas([]);
                  }}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                    activeCity === c
                      ? 'bg-plum text-primary-foreground font-semibold shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Quick Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                onlyOrganizers
                  ? 'Search planners by name, area, or speciality...'
                  : 'Search vendors by business name, keyword, or area...'
              }
              className="w-full rounded-full border bg-background pl-8 pr-3 py-1.5 text-xs outline-none focus:border-gold font-medium text-navy"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Area / Localities Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setTempCity(activeCity);
              setTempAreas(activeAreas);
              setAreaSearchTerm('');
              setActiveEditModal('LOCATION');
            }}
            className="text-xs rounded-full h-8 px-3 border-border text-navy"
          >
            <MapPin className="size-3.5 mr-1.5 text-gold" />
            {activeAreas.length > 0 ? `${activeAreas.length} Areas Selected` : `All Areas in ${activeCity}`}
          </Button>

          {/* Date Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setTempDate(activeDate);
              setActiveEditModal('DATE');
            }}
            className="text-xs rounded-full h-8 px-3 border-border text-navy"
          >
            <CalendarDays className="size-3.5 mr-1.5 text-gold" />
            {isDateNotFinalized ? 'Date Not Finalized' : activeDate}
          </Button>

          {/* Guest Count Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setTempGuests(activeGuests);
              setActiveEditModal('GUESTS');
            }}
            className="text-xs rounded-full h-8 px-3 border-border text-navy"
          >
            <Users className="size-3.5 mr-1.5 text-gold" />
            {activeGuests} Guests
          </Button>

          {/* Budget Filter */}
          <div className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 h-8">
            <DollarSign className="size-3.5 text-gold" />
            <span className="text-[11px] text-muted-foreground">Max:</span>
            <input
              type="number"
              placeholder="Any budget"
              value={maxBudget || ''}
              onChange={(e) => setMaxBudget(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              className="w-20 bg-transparent text-xs font-semibold text-navy outline-none"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-muted-foreground text-[11px] font-medium flex items-center gap-1">
              <SlidersHorizontal className="size-3 text-gold" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as VendorSortOption)}
              className="rounded-full border bg-background px-3 py-1.5 text-xs font-semibold text-navy outline-none focus:border-gold cursor-pointer h-8"
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

        {/* Quick Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categoryChips.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition font-medium ${
                  isSelected
                    ? 'bg-plum text-primary-foreground font-semibold shadow-xs'
                    : 'bg-secondary text-navy hover:bg-gold-soft hover:text-plum border'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= MAIN VENDOR CONTENT BOX ================= */}
      <div className="rounded-3xl border bg-card/60 p-4 sm:p-5 shadow-soft flex flex-col h-[580px] xl:h-[calc(100vh-21rem)] min-h-[460px] overflow-hidden">
        {vendorBundle && vendorBundle.length > 0 ? (
          /* ================= VENDOR BUNDLE DISPLAY FOR ORGANIZER (PRD Section 8) ================= */
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gold-soft/50 p-3.5 border border-gold/40 shadow-soft shrink-0 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="size-4 text-plum" />
                  <h3 className="text-sm font-display text-plum font-semibold">
                    Coordinated Vendor Bundle for {activeEvent.eventName}
                  </h3>
                  <span className="rounded-full bg-plum text-white px-2 py-0.5 text-[10px] font-bold">
                    {vendorBundle.length} Coordinated Services
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Coordinated vendors with verified historical collaboration in {activeCity}. You can swap any individual service below without losing the rest of your bundle.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 border-gold text-plum hover:bg-gold-soft"
                onClick={() => {
                  setVendorBundle(null);
                  setSwappingCategory(null);
                }}
              >
                <RotateCcw className="size-3 mr-1" /> Exit Bundle Mode
              </Button>
            </div>

            {swappingCategory ? (
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden space-y-3">
                <div className="p-2.5 bg-plum-soft rounded-xl border border-plum/30 flex items-center justify-between text-xs shrink-0">
                  <div className="text-plum font-medium">
                    Swapping <strong>{swappingCategory}</strong> — Select a replacement below to update your bundle:
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-plum h-7 px-2"
                    onClick={() => setSwappingCategory(null)}
                  >
                    <X className="size-3.5 mr-1" /> Cancel Swap
                  </Button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-2 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-secondary/40 [&::-webkit-scrollbar-thumb]:bg-gold/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold">
                  {DEMO_VENDORS.filter(
                    (v) =>
                      v.category === swappingCategory &&
                      v.primaryCity === activeCity &&
                      !vendorBundle.some((b) => b.vendor.id === v.id)
                  ).map((candidate) => (
                    <div key={candidate.id} className="relative">
                      <VendorCard
                        vendor={candidate}
                        targetDate={activeDate}
                        effectiveAvailability="Available"
                        isComparing={compareIds.includes(candidate.id)}
                        isShortlisted={isShortlisted(candidate.id, eventId || activeEvent.id)}
                        selectedAreas={activeAreas}
                        selectedCity={activeCity}
                        onToggleCompare={handleToggleCompare}
                        onViewProfile={(v) => setProfileVendor(v)}
                        onRequestQuote={(v) => setQuoteVendor(v)}
                        onShortlist={() => toggleShortlist(candidate, eventId || activeEvent.id)}
                        onSwap={() => handleSwapVendor(swappingCategory, candidate)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-2 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-secondary/40 [&::-webkit-scrollbar-thumb]:bg-gold/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold">
                {vendorBundle.map((item) => (
                  <div key={item.vendor.id} className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                        <Sparkles className="size-3 text-gold" /> {item.category}
                      </span>
                      {item.matchReason && (
                        <span className="text-[10px] text-plum font-medium bg-plum-soft px-2 py-0.5 rounded-full border border-plum/20">
                          {item.matchReason}
                        </span>
                      )}
                    </div>
                    <VendorCard
                      vendor={item.vendor}
                      targetDate={isDateNotFinalized ? 'Not finalized yet' : activeDate}
                      effectiveAvailability="Available"
                      isComparing={compareIds.includes(item.vendor.id)}
                      isShortlisted={isShortlisted(item.vendor.id, eventId || activeEvent.id)}
                      selectedAreas={activeAreas}
                      selectedCity={activeCity}
                      onToggleCompare={handleToggleCompare}
                      onViewProfile={(v) => setProfileVendor(v)}
                      onRequestQuote={(v) => setQuoteVendor(v)}
                      onShortlist={() => toggleShortlist(item.vendor, eventId || activeEvent.id)}
                      onSwap={() => setSwappingCategory(item.category)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ================= STANDARD FULL-WIDTH VENDOR / ORGANIZER GRID INSIDE SCROLLABLE BOX ================= */
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Box Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b shrink-0 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-navy">
                  {onlyOrganizers
                    ? 'Verified Event Planners'
                    : activeCategory === 'All Categories'
                    ? 'All Verified Vendors'
                    : activeCategory}
                </span>
                <span>•</span>
                <span className="text-gold font-bold">
                  {searchResults.totalMatched} verified {onlyOrganizers ? 'organizers' : 'results'} in {activeCity}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="hidden sm:inline">Scroll within box to explore all</span>
                <span className="inline-block animate-bounce text-gold">↓</span>
              </div>
            </div>

            {/* Scrollable list inside the Box */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-2 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-secondary/40 [&::-webkit-scrollbar-thumb]:bg-gold/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold">
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
                <div className="rounded-2xl border bg-card p-12 text-center shadow-soft my-auto">
                  <Clock className="size-12 mx-auto text-gold mb-3 animate-pulse" />
                  <h3 className="text-xl font-display text-plum font-semibold">
                    No Matching {onlyOrganizers ? 'Event Planners' : 'Vendors'} Found
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
                    No verified {onlyOrganizers ? 'event organizers' : 'vendors'} in{' '}
                    <strong className="text-navy">{activeCity}</strong> match your exact filter criteria.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() => {
                        setActiveAreas([]);
                        setSearchTerm('');
                        setMaxBudget(undefined);
                        setActiveCategory(onlyOrganizers ? 'All Event Planners' : 'All Categories');
                      }}
                    >
                      Clear Filters & Show All in {activeCity}
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
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Compare Bar */}
      {compareIds.length > 0 && (
        <div className="shrink-0 rounded-2xl bg-gradient-plum p-3.5 text-primary-foreground shadow-float flex flex-wrap items-center justify-between gap-3 animate-rise">
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

      {/* ================= MODALS ================= */}

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
