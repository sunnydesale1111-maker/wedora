import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  ENABLE_EVENT_HERO_CAROUSEL,
  HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS,
  HERO_CAROUSEL_READABLE_INTERVAL_MS,
} from "../config/features";
import { EVENT_HERO_SLIDES } from "../components/home/EventHeroCarousel";

describe("Wedora – Final Homepage Hero Carousel Implementation", () => {
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

    it("preserves the original wedding hero component intact for immediate rollback", () => {
      expect(weddingHeroContent).toContain("Your Entire Wedding.");
      expect(weddingHeroContent).toContain("One Intelligent");
      expect(weddingHeroContent).toContain("AI Wedding Planning Platform · Mumbai & Pune");
    });
  });

  describe("2. Approved Banner Layout (Left Photograph, Right Information)", () => {
    it("places the event photograph on the left side and event information on the right side", () => {
      // Container layout grid
      expect(carouselContent).toContain("lg:grid-cols-[1fr_1.15fr]");
      // Left side has the arched photographic frame
      expect(carouselContent).toContain("arch border border-gold/60");
      // Right side has the small heading
      expect(carouselContent).toContain("AI EVENT PLANNING PLATFORM · MUMBAI & PUNE");
    });
  });

  describe("3. Six Event Banners & Exact Approved Copy", () => {
    it("contains exactly 6 distinct event slides", () => {
      expect(EVENT_HERO_SLIDES).toHaveLength(6);
      const slideIds = EVENT_HERO_SLIDES.map((s) => s.id);
      expect(slideIds).toEqual([
        "wedding",
        "birthday",
        "baby-shower",
        "griha-pravesh",
        "ganpati-decoration",
        "baby-shower-celebration",
      ]);
    });

    it("Slide 1 (Wedding) has exact headline, description, and realistic photograph", () => {
      const slide = EVENT_HERO_SLIDES.find((s) => s.id === "wedding");
      expect(slide).toBeDefined();
      expect(slide?.headline).toBe("Your Dream Wedding, Beautifully Planned.");
      expect(slide?.description).toBe(
        "From the perfect venue to the final celebration, discover trusted vendors and event professionals."
      );
      expect(slide?.eventType).toBe("Wedding");
      expect(slide?.image).toBeDefined();
    });

    it("Slide 2 (Birthday) has exact headline, description, and realistic photograph", () => {
      const slide = EVENT_HERO_SLIDES.find((s) => s.id === "birthday");
      expect(slide).toBeDefined();
      expect(slide?.headline).toBe("Every Birthday Deserves a Celebration.");
      expect(slide?.description).toBe(
        "Find the right decorators, caterers, and entertainers to make the day truly special."
      );
      expect(slide?.eventType).toBe("Birthday");
      expect(slide?.image).toBeDefined();
    });

    it("Slide 3 (Baby Shower) has exact headline, description, and realistic photograph", () => {
      const slide = EVENT_HERO_SLIDES.find((s) => s.id === "baby-shower");
      expect(slide).toBeDefined();
      expect(slide?.headline).toBe("Celebrate Little Beginnings.");
      expect(slide?.description).toBe(
        "Plan a beautiful baby shower with trusted decorators, caterers, and event professionals."
      );
      expect(slide?.eventType).toBe("Baby Shower");
      expect(slide?.image).toBeDefined();
    });

    it("Slide 4 (Griha Pravesh) has exact headline, description, and realistic photograph", () => {
      const slide = EVENT_HERO_SLIDES.find((s) => s.id === "griha-pravesh");
      expect(slide).toBeDefined();
      expect(slide?.headline).toBe("New Home, New Beginnings.");
      expect(slide?.description).toBe(
        "Plan a beautiful housewarming celebration with trusted event professionals."
      );
      expect(slide?.eventType).toBe("Griha Pravesh");
      expect(slide?.image).toBeDefined();
    });

    it("Slide 5 (Ganpati Decoration) has exact headline, description, and realistic photograph", () => {
      const slide = EVENT_HERO_SLIDES.find((s) => s.id === "ganpati-decoration");
      expect(slide).toBeDefined();
      expect(slide?.headline).toBe("Celebrate Ganpati with Devotion and Creativity.");
      expect(slide?.description).toBe(
        "Discover decoration specialists and event professionals for a memorable Ganpati celebration."
      );
      expect(slide?.eventType).toBe("Ganpati Decoration");
      expect(slide?.image).toBeDefined();
    });

    it("Slide 6 (Baby Shower Celebration) has distinct headline, description, and photograph from Slide 3", () => {
      const slide3 = EVENT_HERO_SLIDES.find((s) => s.id === "baby-shower");
      const slide6 = EVENT_HERO_SLIDES.find((s) => s.id === "baby-shower-celebration");

      expect(slide6).toBeDefined();
      expect(slide6?.headline).toBe("A Beautiful Celebration for a New Beginning.");
      expect(slide6?.description).toBe(
        "Make every moment special with thoughtful decorations, memorable experiences, and trusted professionals."
      );
      expect(slide6?.eventType).toBe("Baby Shower Celebration");

      // Verify distinct photograph and composition from Slide 3
      expect(slide6?.image).not.toEqual(slide3?.image);
      expect(slide6?.imageAlt).not.toEqual(slide3?.imageAlt);
    });

    it("verifies all 6 event image assets exist in the project", () => {
      const assetsDir = path.resolve(__dirname, "../assets");
      const expectedFiles = [
        "hero-couple.jpg",
        "birthday.jpg",
        "baby-shower.jpg",
        "griha-pravesh.jpg",
        "ganpati-decor.jpg",
        "baby-shower-celebration.jpg",
      ];

      expectedFiles.forEach((file) => {
        const filePath = path.join(assetsDir, file);
        expect(fs.existsSync(filePath), `Missing asset: ${file}`).toBe(true);
        const stats = fs.statSync(filePath);
        expect(stats.size).toBeGreaterThan(1000); // Valid image file
      });
    });
  });

  describe("4. Automatic Carousel Timing & Controls", () => {
    it("has the requested 175 ms interval configured with safe 3000 ms option", () => {
      expect(HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS).toBe(175);
      expect(HERO_CAROUSEL_READABLE_INTERVAL_MS).toBe(3000);
    });

    it("includes six slide indicators with accessible tab roles", () => {
      expect(carouselContent).toContain('role="tablist"');
      expect(carouselContent).toContain('role="tab"');
      expect(carouselContent).toContain("aria-selected");
      expect(carouselContent).toContain("Go to slide");
    });

    it("provides manual previous and next navigation controls", () => {
      expect(carouselContent).toContain('aria-label="Previous slide"');
      expect(carouselContent).toContain('aria-label="Next slide"');
      expect(carouselContent).toContain("prevSlide");
      expect(carouselContent).toContain("nextSlide");
    });

    it("pauses autoplay on interaction (hover and focus)", () => {
      expect(carouselContent).toContain("onMouseEnter");
      expect(carouselContent).toContain("onMouseLeave");
      expect(carouselContent).toContain("onFocus");
      expect(carouselContent).toContain("onBlur");
      expect(carouselContent).toContain("setIsPaused");
    });

    it("respects prefers-reduced-motion accessibility preference", () => {
      expect(carouselContent).toContain("prefers-reduced-motion");
      expect(carouselContent).toContain("prefersReducedMotion");
    });

    it("properly cleans up timer on unmount", () => {
      expect(carouselContent).toContain("clearInterval(timer)");
    });
  });

  describe("5. Fixed Stationary Action Buttons & Platform Statistics", () => {
    it("keeps 'Plan an Event' and 'Join as a Professional' stationary outside the slide track", () => {
      expect(carouselContent).toContain("Plan an Event");
      expect(carouselContent).toContain('search={{ role: "CUSTOMER" }}');
      expect(carouselContent).toContain("Join as a Professional");
      expect(carouselContent).toContain('to="/professionals"');
    });

    it("keeps platform statistics (200+, 2 Cities, 13 Categories) visible and stationary", () => {
      expect(carouselContent).toContain("200+");
      expect(carouselContent).toContain("Verified Profiles");
      expect(carouselContent).toContain("2 Cities");
      expect(carouselContent).toContain("Mumbai & Pune");
      expect(carouselContent).toContain("13 Categories");
      expect(carouselContent).toContain("Catering to Venues");
    });

    it("ensures zero layout shift with fixed min-height container and fixed aspect ratio", () => {
      expect(carouselContent).toContain("min-h-[175px]");
      expect(carouselContent).toContain("aspect-[3/4]");
      expect(carouselContent).toContain("overflow-hidden");
    });
  });
});
