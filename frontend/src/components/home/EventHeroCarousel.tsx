import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  PartyPopper,
  Baby,
  Home,
  Flame,
  HeartHandshake,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mandala } from "@/components/brand";
import {
  HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS,
  HERO_CAROUSEL_READABLE_INTERVAL_MS,
} from "@/config/features";

// Authentic event photographs
import heroCoupleImg from "@/assets/hero-couple.jpg";
import birthdayImg from "@/assets/birthday.jpg";
import babyShowerImg from "@/assets/baby-shower.jpg";
import grihaPraveshImg from "@/assets/griha-pravesh.jpg";
import ganpatiDecorImg from "@/assets/ganpati-decor.jpg";
import babyShowerCelebrationImg from "@/assets/baby-shower-celebration.jpg";

export interface EventHeroSlide {
  id: string;
  eventType: string;
  badge: string;
  badgeIcon: typeof Sparkles;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  floatingBadge1: {
    eventTag: string;
    location: string;
    status: string;
  };
  floatingBadge2: string;
}

export const EVENT_HERO_SLIDES: EventHeroSlide[] = [
  {
    id: "wedding",
    eventType: "Wedding",
    badge: "Weddings & Receptions · Mumbai & Pune",
    badgeIcon: Sparkles,
    headline: "Your Dream Wedding, Beautifully Planned.",
    description:
      "From the perfect venue to the final celebration, discover trusted vendors and event professionals.",
    image: heroCoupleImg,
    imageAlt:
      "Realistic Indian wedding photograph featuring a bride and groom in traditional attire, with elegant burgundy, ivory, and gold decorations",
    floatingBadge1: {
      eventTag: "Grand Wedding & Reception",
      location: "Pune (Baner/Wakad)",
      status: "2 Caterers verified available",
    },
    floatingBadge2: "Decorator available",
  },
  {
    id: "birthday",
    eventType: "Birthday",
    badge: "Birthday Celebrations · Mumbai & Pune",
    badgeIcon: PartyPopper,
    headline: "Every Birthday Deserves a Celebration.",
    description:
      "Find the right decorators, caterers, and entertainers to make the day truly special.",
    image: birthdayImg,
    imageAlt:
      "Realistic birthday celebration setup featuring a decorated cake, balloons, flowers, and warm ambient lighting",
    floatingBadge1: {
      eventTag: "1st & Milestone Birthdays",
      location: "Mumbai (Bandra/Andheri)",
      status: "3 Balloon Decorators available",
    },
    floatingBadge2: "Live DJ & MC booked",
  },
  {
    id: "baby-shower",
    eventType: "Baby Shower",
    badge: "Baby Showers & Dohale Jevan",
    badgeIcon: Baby,
    headline: "Celebrate Little Beginnings.",
    description:
      "Plan a beautiful baby shower with trusted decorators, caterers, and event professionals.",
    image: babyShowerImg,
    imageAlt:
      "Realistic Indian baby shower celebration with tasteful pastel decorations, floral arrangements, and natural lighting",
    floatingBadge1: {
      eventTag: "Traditional Dohale Jevan",
      location: "Pune (Kothrud/Aundh)",
      status: "Specialty Caterers available",
    },
    floatingBadge2: "Floral Arch confirmed",
  },
  {
    id: "griha-pravesh",
    eventType: "Griha Pravesh",
    badge: "Housewarming Ceremonies · Mumbai & Pune",
    badgeIcon: Home,
    headline: "New Home, New Beginnings.",
    description:
      "Plan a beautiful housewarming celebration with trusted event professionals.",
    image: grihaPraveshImg,
    imageAlt:
      "Realistic Indian Griha Pravesh ceremony featuring marigold decorations, traditional rangoli, diyas, and a decorated home entrance",
    floatingBadge1: {
      eventTag: "Vastu Shanti & Feast",
      location: "Thane & Navi Mumbai",
      status: "Satvik Caterers available",
    },
    floatingBadge2: "Floral Toran artists ready",
  },
  {
    id: "ganpati-decoration",
    eventType: "Ganpati Decoration",
    badge: "Ganesh Utsav & Eco-Friendly Decor",
    badgeIcon: Flame,
    headline: "Celebrate Ganpati with Devotion and Creativity.",
    description:
      "Discover decoration specialists and event professionals for a memorable Ganpati celebration.",
    image: ganpatiDecorImg,
    imageAlt:
      "Realistic Ganpati decoration arrangement featuring a beautifully decorated Ganesh idol, marigold flowers, and traditional lighting",
    floatingBadge1: {
      eventTag: "Ganesh Festival 2026",
      location: "Pune & Mumbai",
      status: "Eco-friendly Mandap ready",
    },
    floatingBadge2: "Lighting & sound verified",
  },
  {
    id: "baby-shower-celebration",
    eventType: "Baby Shower Celebration",
    badge: "Stage & Family Celebration Decor",
    badgeIcon: HeartHandshake,
    headline: "A Beautiful Celebration for a New Beginning.",
    description:
      "Make every moment special with thoughtful decorations, memorable experiences, and trusted professionals.",
    image: babyShowerCelebrationImg,
    imageAlt:
      "Realistic baby shower celebration photograph featuring a beautifully decorated stage and family celebration setup",
    floatingBadge1: {
      eventTag: "Grand Baby Shower Gala",
      location: "Mumbai (Juhu/Powai)",
      status: "Decorators & Caterers ready",
    },
    floatingBadge2: "Pastel Stage confirmed",
  },
];

interface EventHeroCarouselProps {
  /**
   * Autoplay interval in milliseconds.
   * Defaults to HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS (120 ms).
   */
  intervalMs?: number;
}

export function EventHeroCarousel({
  intervalMs = HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS,
}: EventHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeInterval, setActiveInterval] = useState(intervalMs);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion accessibility preference
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const totalSlides = EVENT_HERO_SLIDES.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Autoplay timer with pause on hover/interaction and reduced motion respect
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, activeInterval);

    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, activeInterval, totalSlides]);

  const currentSlide = EVENT_HERO_SLIDES[activeIndex];
  const BadgeIcon = currentSlide.badgeIcon;

  // Transition duration adapts to active interval:
  // Fast 175ms interval uses snappy 95ms transition to prevent overlap; readable 3s interval uses smooth 500ms transition.
  const transitionDurationMs = activeInterval <= 250 ? 95 : 500;

  return (
    <section
      ref={containerRef}
      className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-24 pt-6 lg:grid-cols-[1fr_1.15fr]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Wedora Event Celebrations Showcase"
    >
      <Mandala className="absolute -left-40 top-0 size-96 text-plum/10 pointer-events-none" />

      {/* LEFT SIDE: Event photograph inside large decorative arched frame */}
      <div className="relative mx-auto w-full max-w-md animate-rise order-1 lg:order-1">
        {/* Decorative Outer Arch Border */}
        <div className="absolute -inset-4 arch border border-gold/60 pointer-events-none" />

        {/* Horizontal Sliding Image Track */}
        <div className="relative aspect-[3/4] w-full arch overflow-hidden shadow-float bg-card">
          <div
            className="w-full h-full flex ease-out"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
              transitionProperty: "transform",
              transitionDuration: prefersReducedMotion ? "0ms" : `${transitionDurationMs}ms`,
            }}
          >
            {EVENT_HERO_SLIDES.map((slide, idx) => (
              <div key={slide.id} className="w-full h-full shrink-0 flex-none relative">
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={832}
                  height={1152}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Floating Status Badge 1 (Bottom Left) */}
        <div className="absolute -left-6 sm:-left-8 bottom-12 w-64 rounded-2xl bg-card p-4 shadow-float border border-gold/30 transition-all duration-300">
          <div className="text-[11px] text-muted-foreground">
            {currentSlide.floatingBadge1.eventTag}
          </div>
          <div className="mt-1 font-semibold text-navy text-sm">
            {currentSlide.floatingBadge1.location}
          </div>
          <div className="mt-2 text-xs text-success font-medium flex items-center gap-1.5">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{currentSlide.floatingBadge1.status}</span>
          </div>
        </div>

        {/* Floating Status Badge 2 (Top Right) */}
        <div className="absolute -right-4 sm:-right-6 top-12 flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-semibold text-navy shadow-soft border border-gold/30 transition-all duration-300">
          <CheckCircle2 className="size-4 text-success shrink-0" />
          <span>{currentSlide.floatingBadge2}</span>
        </div>
      </div>

      {/* RIGHT SIDE: Event information, Stationary CTAs, and Platform statistics */}
      <div className="relative animate-rise z-10 flex flex-col justify-between order-2 lg:order-2">
        {/* Small Heading */}
        <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold font-semibold h-7">
          <BadgeIcon className="size-3.5 text-gold shrink-0" />
          <span>AI EVENT PLANNING PLATFORM · MUMBAI & PUNE</span>
        </div>

        {/* Rotating Event-Specific Content (Headline + Description) with fixed min-height */}
        <div className="relative overflow-hidden min-h-[175px] sm:min-h-[190px] md:min-h-[205px] flex items-center">
          <div
            className="w-full flex ease-out"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
              transitionProperty: "transform",
              transitionDuration: prefersReducedMotion ? "0ms" : `${transitionDurationMs}ms`,
            }}
          >
            {EVENT_HERO_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                className="w-full shrink-0 flex-none pr-4"
                aria-hidden={activeIndex !== idx}
              >
                <h1 className="text-4xl leading-[1.1] text-plum sm:text-5xl md:text-6xl font-display font-semibold">
                  {slide.headline}
                </h1>
                <p className="mt-4 max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {slide.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Bar (Six Slide Indicators + Speed Switcher + Manual Controls) */}
        <div className="mt-4 flex flex-wrap items-center gap-3 pt-2">
          {/* Six Slide Indicators */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Event Banners">
            {EVENT_HERO_SLIDES.map((slide, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`group relative flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "w-7 h-2.5 rounded-full bg-gold shadow-sm"
                      : "w-2.5 h-2.5 rounded-full bg-border hover:bg-gold/50"
                  }`}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${idx + 1}: ${slide.eventType}`}
                >
                  <span className="sr-only">{slide.eventType}</span>
                </button>
              );
            })}
          </div>

          {/* Active Slide Counter & Event Name */}
          <span className="text-xs font-semibold text-muted-foreground">
            <span className="text-plum font-bold">{activeIndex + 1}</span> / {totalSlides} · {currentSlide.eventType}
          </span>

          {/* Configurable Timing Toggle (175ms Trial vs 3s Readable) */}
          <div className="inline-flex items-center rounded-full border border-border/80 bg-background/90 p-0.5 text-[11px] font-medium shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveInterval(HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS)}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition ${
                activeInterval <= 250
                  ? "bg-plum text-gold font-bold shadow-xs"
                  : "text-muted-foreground hover:text-plum"
              }`}
              title="175ms rapid transition trial"
            >
              <Zap className="size-3" />
              <span>175ms</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveInterval(HERO_CAROUSEL_READABLE_INTERVAL_MS)}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition ${
                activeInterval > 200
                  ? "bg-plum text-gold font-bold shadow-xs"
                  : "text-muted-foreground hover:text-plum"
              }`}
              title="3,000ms safe readable transition"
            >
              <Clock className="size-3" />
              <span>3.0s</span>
            </button>
          </div>

          {/* Manual Previous / Next Controls */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="p-1.5 rounded-full border border-border/80 bg-background/80 hover:bg-gold-soft hover:text-plum text-muted-foreground transition shadow-xs"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="p-1.5 rounded-full border border-border/80 bg-background/80 hover:bg-gold-soft hover:text-plum text-muted-foreground transition shadow-xs"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* STATIONARY HOMEPAGE BUTTONS - Kept fixed in place across transitions */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild variant="hero" size="xl">
            <Link to="/get-started" search={{ role: "CUSTOMER" }}>
              <span>Plan an Event</span>
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>

          <Button
            asChild
            variant="soft"
            size="xl"
            className="border border-gold/40 hover:bg-gold-soft text-plum font-semibold"
          >
            <Link to="/professionals">
              <span>Join as a Professional</span>
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* STATIONARY PLATFORM STATISTICS - Kept fixed in place across transitions */}
        <div className="mt-10 flex gap-10 text-sm">
          {[
            ["200+", "Verified Profiles"],
            ["2 Cities", "Mumbai & Pune"],
            ["13 Categories", "Catering to Venues"],
          ].map(([count, label]) => (
            <div key={label}>
              <div className="font-display text-2xl font-bold text-plum">{count}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
