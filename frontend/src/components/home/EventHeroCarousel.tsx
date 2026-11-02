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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mandala } from "@/components/brand";
import { HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS } from "@/config/features";

// Event images
import heroCoupleImg from "@/assets/hero-couple.jpg";
import birthdayImg from "@/assets/birthday.jpg";
import babyShowerImg from "@/assets/baby-shower.jpg";
import grihaPraveshImg from "@/assets/griha-pravesh.jpg";
import ganpatiDecorImg from "@/assets/ganpati-decor.jpg";

export interface EventHeroSlide {
  id: string;
  eventType: string;
  badge: string;
  badgeIcon: typeof Sparkles;
  headline: string;
  subtitle: string;
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
    badge: "Wedding Planning · Mumbai & Pune",
    badgeIcon: Sparkles,
    headline: "Your Dream Wedding, Beautifully Planned",
    subtitle: "From the perfect venue to the final celebration.",
    image: heroCoupleImg,
    imageAlt: "Bride and groom celebrating their dream wedding",
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
    headline: "Every Birthday Deserves a Celebration",
    subtitle: "Find the right decorators, caterers, and entertainers.",
    image: birthdayImg,
    imageAlt: "Festive birthday party celebration with colorful balloons and ambient lighting",
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
    headline: "Celebrate Little Beginnings",
    subtitle: "Create unforgettable memories for your special occasion.",
    image: babyShowerImg,
    imageAlt: "Pastel floral baby shower and dohale jevan backdrop setup",
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
    headline: "New Home, New Beginnings",
    subtitle: "Plan a beautiful housewarming celebration with trusted professionals.",
    image: grihaPraveshImg,
    imageAlt: "Warmly lit Indian home interior prepared for Griha Pravesh ceremony",
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
    headline: "Celebrate Ganpati with Creativity and Devotion",
    subtitle: "Discover decoration specialists for your Ganpati celebrations.",
    image: ganpatiDecorImg,
    imageAlt: "Artistic floral mandap decoration for Ganesh Utsav with golden lighting",
    floatingBadge1: {
      eventTag: "Ganesh Festival 2026",
      location: "Pune & Mumbai",
      status: "Eco-friendly Mandap ready",
    },
    floatingBadge2: "Lighting & sound verified",
  },
];

interface EventHeroCarouselProps {
  /**
   * Autoplay interval in milliseconds.
   * Defaults to HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS (3000 ms).
   * Can be configured to 150 ms for fast-interval testing.
   */
  intervalMs?: number;
}

export function EventHeroCarousel({
  intervalMs = HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS,
}: EventHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
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
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, intervalMs, totalSlides]);

  const currentSlide = EVENT_HERO_SLIDES[activeIndex];
  const BadgeIcon = currentSlide.badgeIcon;

  return (
    <section
      ref={containerRef}
      className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-6 lg:grid-cols-[1.1fr_1fr]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Wedora Event Celebrations Showcase"
    >
      <Mandala className="absolute -left-40 top-0 size-96 text-plum/10 pointer-events-none" />

      {/* Left Column: Rotating Headline & Subtitle with FIXED CTAs and Statistics */}
      <div className="relative animate-rise z-10 flex flex-col justify-between">
        {/* Dynamic Category Tag / Badge */}
        <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold font-semibold h-7">
          <BadgeIcon className="size-3.5 text-gold shrink-0" />
          <span>{currentSlide.badge}</span>
        </div>

        {/* Carousel Rotating Content (Headline + Subtitle) with fixed min-height to eliminate layout shifts */}
        <div className="relative overflow-hidden min-h-[175px] sm:min-h-[185px] md:min-h-[200px] flex items-center">
          <div
            className={`w-full flex transition-transform ease-out ${
              prefersReducedMotion ? "duration-0" : "duration-500"
            }`}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
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
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Bar (Indicators + Manual Prev/Next) */}
        <div className="mt-4 flex items-center gap-4">
          {/* Indicators */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Event Slides">
            {EVENT_HERO_SLIDES.map((slide, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`group relative flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "w-8 h-2.5 rounded-full bg-gold shadow-sm"
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

          {/* Slide Number & Active Event Label */}
          <span className="text-xs font-semibold text-muted-foreground">
            <span className="text-plum font-bold">{activeIndex + 1}</span> / {totalSlides} · {currentSlide.eventType}
          </span>

          {/* Prev/Next Navigation Controls */}
          <div className="flex items-center gap-1 ml-auto sm:ml-0">
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

        {/* FIXED Hero CTAs - Kept completely fixed, never animated or repositioned */}
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

        {/* FIXED Platform Statistics - Kept completely fixed, never animated or repositioned */}
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

      {/* Right Column: Rotating Event Visuals with Synchronized Badges */}
      <div className="relative mx-auto w-full max-w-md animate-rise [animation-delay:150ms]">
        <div className="absolute -inset-4 arch border border-gold/60 pointer-events-none" />

        {/* Horizontal Sliding Image Track */}
        <div className="relative aspect-[3/4] w-full arch overflow-hidden shadow-float bg-card">
          <div
            className={`w-full h-full flex transition-transform ease-out ${
              prefersReducedMotion ? "duration-0" : "duration-500"
            }`}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
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

        {/* Floating Verified Badge 1 (Bottom Left) */}
        <div className="absolute -left-8 bottom-14 w-64 rounded-2xl bg-card p-4 shadow-float border border-gold/30 transition-all duration-300">
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

        {/* Floating Verified Badge 2 (Top Right) */}
        <div className="absolute -right-6 top-14 flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-semibold text-navy shadow-soft border border-gold/30 transition-all duration-300">
          <CheckCircle2 className="size-4 text-success shrink-0" />
          <span>{currentSlide.floatingBadge2}</span>
        </div>
      </div>
    </section>
  );
}
