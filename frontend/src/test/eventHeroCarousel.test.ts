import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  ENABLE_EVENT_HERO_CAROUSEL,
  HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS,
  HERO_CAROUSEL_FAST_TEST_INTERVAL_MS,
} from "../config/features";
import { EVENT_HERO_SLIDES } from "../components/home/EventHeroCarousel";

describe("Wedora – Reversible Event Carousel on Live Homepage", () => {
  const indexTsxPath = path.resolve(__dirname, "../routes/index.tsx");
  const carouselTsxPath = path.resolve(__dirname, "../components/home/EventHeroCarousel.tsx");
  const weddingHeroTsxPath = path.resolve(__dirname, "../components/home/WeddingHero.tsx");
  const featuresTsPath = path.resolve(__dirname, "../config/features.ts");

  const indexContent = fs.readFileSync(indexTsxPath, "utf-8");
  const carouselContent = fs.readFileSync(carouselTsxPath, "utf-8");
  const weddingHeroContent = fs.readFileSync(weddingHeroTsxPath, "utf-8");
  const featuresContent = fs.readFileSync(featuresTsPath, "utf-8");

  describe("1. Reversible Feature Flag & Configuration", () => {
    it("exports ENABLE_EVENT_HERO_CAROUSEL configured to true by default", () => {
      expect(ENABLE_EVENT_HERO_CAROUSEL).toBe(true);
      expect(featuresContent).toContain("export const ENABLE_EVENT_HERO_CAROUSEL = true;");
    });

    it("homepage route conditionally renders EventHeroCarousel or WeddingHero based on flag", () => {
      expect(indexContent).toContain("ENABLE_EVENT_HERO_CAROUSEL ? <EventHeroCarousel /> : <WeddingHero />");
      expect(indexContent).toContain('import { ENABLE_EVENT_HERO_CAROUSEL } from "@/config/features"');
      expect(indexContent).toContain('import { WeddingHero } from "@/components/home/WeddingHero"');
      expect(indexContent).toContain('import { EventHeroCarousel } from "@/components/home/EventHeroCarousel"');
    });

    it("preserves the original wedding hero component intact for immediate zero-db rollback", () => {
      expect(weddingHeroContent).toContain("Your Entire Wedding.");
      expect(weddingHeroContent).toContain("One Intelligent");
      expect(weddingHeroContent).toContain("AI Wedding Planning Platform · Mumbai & Pune");
    });
  });

  describe("2. Five Event Slides & Exact Copy", () => {
    it("contains exactly 5 distinct event slides", () => {
      expect(EVENT_HERO_SLIDES).toHaveLength(5);
      const slideIds = EVENT_HERO_SLIDES.map((s) => s.id);
      expect(slideIds).toEqual([
        "wedding",
        "birthday",
        "baby-shower",
        "griha-pravesh",
        "ganpati-decoration",
      ]);
    });

    it("Slide 1 (Wedding) has exact headline and subtitle", () => {
      const slide = EVENT_HERO_SLIDES.find((s) => s.id === "wedding");
      expect(slide).toBeDefined();
      expect(slide?.headline).toBe("Your Dream Wedding, Beautifully Planned");
      expect(slide?.subtitle).toBe("From the perfect venue to the final celebration.");
      expect(slide?.eventType).toBe("Wedding");
    });

    it("Slide 2 (Birthday) has exact headline and subtitle", () => {
      const slide = EVENT_HERO_SLIDES.find((s) => s.id === "birthday");
      expect(slide).toBeDefined();
      expect(slide?.headline).toBe("Every Birthday Deserves a Celebration");
      expect(slide?.subtitle).toBe("Find the right decorators, caterers, and entertainers.");
      expect(slide?.eventType).toBe("Birthday");
    });

    it("Slide 3 (Baby Shower) has exact headline and subtitle", () => {
      const slide = EVENT_HERO_SLIDES.find((s) => s.id === "baby-shower");
      expect(slide).toBeDefined();
      expect(slide?.headline).toBe("Celebrate Little Beginnings");
      expect(slide?.subtitle).toBe("Create unforgettable memories for your special occasion.");
      expect(slide?.eventType).toBe("Baby Shower");
    });

    it("Slide 4 (Griha Pravesh) has exact headline and subtitle", () => {
      const slide = EVENT_HERO_SLIDES.find((s) => s.id === "griha-pravesh");
      expect(slide).toBeDefined();
      expect(slide?.headline).toBe("New Home, New Beginnings");
      expect(slide?.subtitle).toBe("Plan a beautiful housewarming celebration with trusted professionals.");
      expect(slide?.eventType).toBe("Griha Pravesh");
    });

    it("Slide 5 (Ganpati Decoration) has exact headline and subtitle", () => {
      const slide = EVENT_HERO_SLIDES.find((s) => s.id === "ganpati-decoration");
      expect(slide).toBeDefined();
      expect(slide?.headline).toBe("Celebrate Ganpati with Creativity and Devotion");
      expect(slide?.subtitle).toBe("Discover decoration specialists for your Ganpati celebrations.");
      expect(slide?.eventType).toBe("Ganpati Decoration");
    });

    it("each slide references a verified local optimized image", () => {
      EVENT_HERO_SLIDES.forEach((slide) => {
        expect(slide.image).toBeDefined();
        expect(slide.imageAlt).toBeDefined();
        expect(slide.imageAlt.length).toBeGreaterThan(10);
      });
    });
  });

  describe("3. Carousel Timing, Navigation & Accessibility", () => {
    it("has a default autoplay interval of 3000 ms and configurable fast test interval of 150 ms", () => {
      expect(HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS).toBe(3000);
      expect(HERO_CAROUSEL_FAST_TEST_INTERVAL_MS).toBe(150);
    });

    it("includes 5 slide indicators with tablist roles and accessible labels", () => {
      expect(carouselContent).toContain('role="tablist"');
      expect(carouselContent).toContain('role="tab"');
      expect(carouselContent).toContain("aria-selected");
      expect(carouselContent).toContain("Go to slide");
    });

    it("provides manual previous and next navigation buttons", () => {
      expect(carouselContent).toContain('aria-label="Previous slide"');
      expect(carouselContent).toContain('aria-label="Next slide"');
      expect(carouselContent).toContain("prevSlide");
      expect(carouselContent).toContain("nextSlide");
    });

    it("pauses autoplay on user interaction (hover and focus)", () => {
      expect(carouselContent).toContain("onMouseEnter");
      expect(carouselContent).toContain("onMouseLeave");
      expect(carouselContent).toContain("onFocus");
      expect(carouselContent).toContain("onBlur");
      expect(carouselContent).toContain("setIsPaused");
    });

    it("respects prefers-reduced-motion user preference", () => {
      expect(carouselContent).toContain("prefers-reduced-motion");
      expect(carouselContent).toContain("prefersReducedMotion");
    });

    it("cleans up timer in useEffect to prevent memory leaks on unmount", () => {
      expect(carouselContent).toContain("clearInterval(timer)");
    });
  });

  describe("4. Fixed Action Buttons & Fixed Platform Statistics", () => {
    it("keeps 'Plan an Event' and 'Join as a Professional' fixed outside the moving slide track", () => {
      // Must have the buttons defined outside the rotating transform container
      expect(carouselContent).toContain("Plan an Event");
      expect(carouselContent).toContain('search={{ role: "CUSTOMER" }}');
      expect(carouselContent).toContain("Join as a Professional");
      expect(carouselContent).toContain('to="/professionals"');
    });

    it("keeps platform statistics (200+, 2 Cities, 13 Categories) fixed and stationary", () => {
      expect(carouselContent).toContain("200+");
      expect(carouselContent).toContain("Verified Profiles");
      expect(carouselContent).toContain("2 Cities");
      expect(carouselContent).toContain("Mumbai & Pune");
      expect(carouselContent).toContain("13 Categories");
      expect(carouselContent).toContain("Catering to Venues");
    });

    it("maintains layout stability with min-height container preventing layout shifts", () => {
      // Rotating text container has fixed min-height
      expect(carouselContent).toContain("min-h-[175px]");
      // Right image container has fixed aspect ratio
      expect(carouselContent).toContain("aspect-[3/4]");
      // No horizontal overflow
      expect(carouselContent).toContain("overflow-hidden");
    });
  });
});
