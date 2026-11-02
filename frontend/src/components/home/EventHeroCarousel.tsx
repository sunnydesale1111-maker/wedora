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
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mandala } from "@/components/brand";
import {
  AUTO_SLIDE_INTERVAL,
  SLIDE_TRANSITION_DURATION,
  HERO_CAROUSEL_READABLE_INTERVAL_MS,
} from "@/config/features";

// Verified authentic event photograph assets extracted from approved mockups
import weddingPhotoImg from "@/assets/banners/01_wedding_photo.png";
import birthdayPhotoImg from "@/assets/banners/02_birthday_photo.png";
import babyShowerPhotoImg from "@/assets/banners/03_baby_shower_photo.png";
import grihaPraveshPhotoImg from "@/assets/banners/04_griha_pravesh_photo.png";
import ganpatiPhotoImg from "@/assets/banners/05_ganpati_photo.png";
import corporateEventPhotoImg from "@/assets/banners/06_corporate_event_photo.png";

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
    badge: "Weddings & Receptions",
    badgeIcon: Sparkles,
    headline: "Your Dream Wedding, Beautifully Planned.",
    description:
      "From the perfect venue to the final celebration, discover trusted vendors and event professionals.",
    image: weddingPhotoImg,
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
    badge: "Birthday Celebrations",
    badgeIcon: PartyPopper,
    headline: "Every Birthday Deserves a Celebration.",
    description:
      "Find the right decorators, caterers, and entertainers to make the day truly special.",
    image: birthdayPhotoImg,
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
    image: babyShowerPhotoImg,
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
    badge: "Housewarming Ceremonies",
    badgeIcon: Home,
    headline: "New Home, New Beginnings.",
    description:
      "Plan a beautiful housewarming celebration with trusted event professionals.",
    image: grihaPraveshPhotoImg,
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
    image: ganpatiPhotoImg,
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
    id: "corporate-events",
    eventType: "Corporate Events",
    badge: "Conferences & Annual Meets",
    badgeIcon: Briefcase,
    headline: "Seamless Corporate Events, Expertly Managed.",
    description:
      "Plan conferences, team events, and corporate celebrations with trusted event professionals.",
    image: corporateEventPhotoImg,
    imageAlt:
      "Realistic corporate event setup featuring an executive banquet, stage presentation, and professional lighting",
    floatingBadge1: {
      eventTag: "Corporate Summits & Galas",
      location: "Mumbai (BKC/Powai)",
      status: "Corporate Planners ready",
    },
    floatingBadge2: "AV & Stage verified",
  },
];

interface EventHeroCarouselProps {
  /**
   * Autoplay interval in milliseconds.
   * Defaults to AUTO_SLIDE_INTERVAL (5000 ms).
   */
  intervalMs?: number;
}

export function EventHeroCarousel({
  intervalMs = AUTO_SLIDE_INTERVAL,
}: EventHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeInterval, setActiveInterval] = useState(intervalMs);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);
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

  const resetCountdown = useCallback(() => {
    setTimerResetKey((prev) => prev + 1);
  }, []);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
    resetCountdown();
  }, [totalSlides, resetCountdown]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    resetCountdown();
  }, [totalSlides, resetCountdown]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    resetCountdown();
  }, [resetCountdown]);

  // Autoplay timer with pause on hover/interaction, reset on manual click, and continuous looping
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, activeInterval);

    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, activeInterval, totalSlides, timerResetKey]);

  const currentSlide = EVENT_HERO_SLIDES[activeIndex];
  const transitionDurationMs = SLIDE_TRANSITION_DURATION;

  return (
    <section
      ref={containerRef}
      className="relative mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 py-8 lg:py-10 xl:py-12 min-h-[500px] lg:min-h-[560px] xl:min-h-[640px] xl:max-h-[660px] grid lg:grid-cols-[45%_55%] items-center gap-8 lg:gap-12 xl:gap-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Wedora Event Celebrations Showcase"
    >
      {/* Decorative Traditional Mandala watermark on right side */}
      <Mandala className="absolute -right-20 top-1/2 -translate-y-1/2 size-[28rem] lg:size-[34rem] text-gold/15 pointer-events-none select-none" />

      {/* LEFT SIDE: Event photograph inside approved elegant arched frame (45% column on desktop) */}
      <div className="relative mx-auto w-full flex flex-col items-center order-1 lg:order-1 animate-rise">
        {/* Decorative Arched Frame matching approved visual mockup (approx 600x560px on desktop) */}
        <div className="relative w-full max-w-[600px] h-[300px] sm:h-[380px] md:h-[440px] lg:h-[500px] xl:h-[560px] rounded-tl-3xl rounded-bl-3xl rounded-tr-[9rem] sm:rounded-tr-[12rem] lg:rounded-tr-[14rem] rounded-br-3xl overflow-hidden shadow-float bg-card border border-gold/40">
          {/* Horizontal Sliding Image Track */}
          <div
            className="w-full h-full flex ease-in-out"
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
                  width={1164}
                  height={720}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>

          {/* Floating Verified Status Badge (Bottom Left of photo) */}
          <div className="absolute left-4 bottom-4 rounded-xl bg-card/95 backdrop-blur-xs px-3.5 py-2 shadow-soft border border-gold/30 text-xs hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              {currentSlide.floatingBadge1.eventTag}
            </div>
            <div className="mt-0.5 text-xs text-success font-medium flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-success shrink-0" />
              <span>{currentSlide.floatingBadge1.status}</span>
            </div>
          </div>
        </div>

        {/* Six Slide Indicators & Navigation Below Photograph (matching mockup placement) */}
        <div className="mt-4 flex items-center gap-3 w-full max-w-[600px] justify-between">
          <div className="flex items-center gap-2" role="tablist" aria-label="Event Banners">
            {EVENT_HERO_SLIDES.map((slide, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`group relative flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "w-7 h-2.5 rounded-full bg-plum shadow-xs"
                      : "w-2.5 h-2.5 rounded-full bg-gold/40 hover:bg-gold/80"
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

          {/* Slide Indicator Label */}
          <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground">
            <span className="text-plum font-bold">{activeIndex + 1}</span> / {totalSlides} · {currentSlide.eventType}
          </span>

          {/* Manual Previous / Next Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="p-1.5 rounded-full border border-border/80 bg-background/80 hover:bg-gold-soft hover:text-plum text-muted-foreground transition shadow-2xs"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="p-1.5 rounded-full border border-border/80 bg-background/80 hover:bg-gold-soft hover:text-plum text-muted-foreground transition shadow-2xs"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Rotating event information, Fixed CTAs, and Stationary Platform statistics (55% column on desktop) */}
      <div className="relative animate-rise z-10 flex flex-col justify-between order-2 lg:order-2 pl-0 lg:pl-6 xl:pl-8">
        {/* Small Heading: AI EVENT PLANNING PLATFORM and Rotating Event Badge */}
        <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#8C3A4D] font-bold">
          <span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span>AI EVENT PLANNING PLATFORM</span>
          <span className="text-muted-foreground/60">·</span>
          <span className="text-plum font-semibold tracking-normal normal-case">{currentSlide.badge}</span>
        </div>

        {/* Rotating Event-Specific Content (Headline + Description) with fixed min-height to prevent layout shifts */}
        <div className="relative overflow-hidden min-h-[190px] sm:min-h-[210px] md:min-h-[230px] lg:min-h-[250px] xl:min-h-[280px] flex items-center">
          <div
            className="w-full flex ease-in-out"
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
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] 2xl:text-[66px] leading-[1.08] text-plum font-display font-semibold tracking-tight">
                  {slide.headline}
                </h1>
                <p className="mt-4 max-w-xl text-base sm:text-[17px] lg:text-[18px] xl:text-[20px] text-muted-foreground leading-relaxed">
                  {slide.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FIXED HOMEPAGE ACTION BUTTONS - Stationary throughout carousel transitions */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button
            asChild
            variant="hero"
            size="xl"
            className="rounded-full bg-plum hover:bg-plum/90 text-primary-foreground font-semibold px-8 shadow-soft text-sm sm:text-base h-12 lg:h-[50px]"
          >
            <Link to="/professionals">
              <span>Join as a Professional</span>
              <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="soft"
            size="xl"
            className="rounded-full border border-plum/30 bg-card hover:bg-gold-soft text-plum font-semibold px-8 text-sm sm:text-base h-12 lg:h-[50px] shadow-2xs"
          >
            <Link to="/get-started" search={{ role: "CUSTOMER" }}>
              <span>Plan an Event</span>
              <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* FIXED PLATFORM STATISTICS - Stationary throughout carousel transitions */}
        <div className="mt-10 flex items-center gap-6 sm:gap-10 text-sm pt-4 border-t border-border/40 max-w-lg">
          <div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-plum leading-tight">200+</div>
            <div className="text-xs text-muted-foreground mt-0.5 font-medium">Profiles</div>
          </div>
          <div className="h-9 w-px bg-border/60" />
          <div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-plum leading-tight">2</div>
            <div className="text-xs text-muted-foreground mt-0.5 font-medium">Cities</div>
          </div>
          <div className="h-9 w-px bg-border/60" />
          <div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-plum leading-tight">13</div>
            <div className="text-xs text-muted-foreground mt-0.5 font-medium">Categories</div>
          </div>
        </div>
      </div>
    </section>
  );
}
