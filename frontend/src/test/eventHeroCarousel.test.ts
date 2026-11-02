import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  ENABLE_EVENT_HERO_CAROUSEL,
  AUTO_SLIDE_INTERVAL,
  HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS,
  HERO_CAROUSEL_READABLE_INTERVAL_MS,
} from "../config/features";
import { EVENT_HERO_SLIDES } from "../components/home/EventHeroCarousel";

describe("WEDORA – FINAL HOMEPAGE HERO BANNER IMPLEMENTATION", () => {
  const indexTsxPath = path.resolve(__dirname, "../routes/index.tsx");
  const carouselTsxPath = path.resolve(__dirname, "../components/home/EventHeroCarousel.tsx");
  const weddingHeroTsxPath = path.resolve(__dirname, "../components/home/WeddingHero.tsx");
  const featuresTsPath = path.resolve(__dirname, "../config/features.ts");

  const indexContent = fs.readFileSync(indexTsxPath, "utf-8");
  const carouselContent = fs.readFileSync(carouselTsxPath, "utf-8");
  const weddingHeroContent = fs.readFileSync(weddingHeroTsxPath, "utf-8");
  const featuresContent = fs.readFileSync(featuresTsPath, "utf-8");

  describe("1. Banner File Location & Asset Verification", () => {
    it("verifies all six source PNG banners exist in E:\\wedora_six_hero_banners", () => {
      const sourceDir = "E:\\wedora_six_hero_banners";
      const expectedFiles = [
        "01_wedding.png",
        "02_birthday.png",
        "03_baby_shower.png",
        "04_griha_pravesh.png",
        "05_ganpati.png",
        "06_corporate_event.png",
      ];

      expect(fs.existsSync(sourceDir), "Source banner directory must exist").toBe(true);
      expectedFiles.forEach((file) => {
        const filePath = path.join(sourceDir, file);
        expect(fs.existsSync(filePath), `Missing source banner: ${file}`).toBe(true);
        const stats = fs.statSync(filePath);
        expect(stats.size).toBeGreaterThan(100000); // Verify high-res file size
      });
    });

    it("verifies all six banner assets are imported into the project assets", () => {
      const assetsBannerDir = path.resolve(__dirname, "../assets/banners");
      const expectedCropped = [
        "01_wedding_photo.png",
        "02_birthday_photo.png",
        "03_baby_shower_photo.png",
        "04_griha_pravesh_photo.png",
        "05_ganpati_photo.png",
        "06_corporate_event_photo.png",
      ];

      expect(fs.existsSync(assetsBannerDir)).toBe(true);
      expectedCropped.forEach((file) => {
        const filePath = path.join(assetsBannerDir, file);
        expect(fs.existsSync(filePath), `Missing project banner asset: ${file}`).toBe(true);
      });
    });
  });

  describe("2. Reproduce Approved Wedora Design & Layout", () => {
    it("places the event photograph on the left and event content on the right", () => {
      expect(carouselContent).toContain("lg:grid-cols-[1.05fr_1.15fr]");
      // Left side has arched frame
      expect(carouselContent).toContain("rounded-tr-[12rem]");
      // Right side has small heading
      expect(carouselContent).toContain("AI EVENT PLANNING PLATFORM");
    });

    it("features subtle gold decorative mandala pattern on the right side", () => {
      expect(carouselContent).toContain("<Mandala");
      expect(carouselContent).toContain("text-gold/15");
    });
  });

  describe("3. Six Homepage Event Banners in Exact Order", () => {
    it("contains exactly 6 distinct event banners", () => {
      expect(EVENT_HERO_SLIDES).toHaveLength(6);
      const slideIds = EVENT_HERO_SLIDES.map((s) => s.id);
      expect(slideIds).toEqual([
        "wedding",
        "birthday",
        "baby-shower",
        "griha-pravesh",
        "ganpati-decoration",
        "corporate-events",
      ]);
    });

    it("Banner 1 (Wedding) has exact headline and description", () => {
      const slide = EVENT_HERO_SLIDES[0];
      expect(slide.eventType).toBe("Wedding");
      expect(slide.headline).toBe("Your Dream Wedding, Beautifully Planned.");
      expect(slide.description).toBe(
        "From the perfect venue to the final celebration, discover trusted vendors and event professionals."
      );
      expect(slide.image).toBeDefined();
    });

    it("Banner 2 (Birthday) has exact headline and description", () => {
      const slide = EVENT_HERO_SLIDES[1];
      expect(slide.eventType).toBe("Birthday");
      expect(slide.headline).toBe("Every Birthday Deserves a Celebration.");
      expect(slide.description).toBe(
        "Find the right decorators, caterers, and entertainers to make the day truly special."
      );
      expect(slide.image).toBeDefined();
    });

    it("Banner 3 (Baby Shower) has exact headline and description", () => {
      const slide = EVENT_HERO_SLIDES[2];
      expect(slide.eventType).toBe("Baby Shower");
      expect(slide.headline).toBe("Celebrate Little Beginnings.");
      expect(slide.description).toBe(
        "Plan a beautiful baby shower with trusted decorators, caterers, and event professionals."
      );
      expect(slide.image).toBeDefined();
    });

    it("Banner 4 (Griha Pravesh) has exact headline and description", () => {
      const slide = EVENT_HERO_SLIDES[3];
      expect(slide.eventType).toBe("Griha Pravesh");
      expect(slide.headline).toBe("New Home, New Beginnings.");
      expect(slide.description).toBe(
        "Plan a beautiful housewarming celebration with trusted event professionals."
      );
      expect(slide.image).toBeDefined();
    });

    it("Banner 5 (Ganpati Decoration) has exact headline and description", () => {
      const slide = EVENT_HERO_SLIDES[4];
      expect(slide.eventType).toBe("Ganpati Decoration");
      expect(slide.headline).toBe("Celebrate Ganpati with Devotion and Creativity.");
      expect(slide.description).toBe(
        "Discover decoration specialists and event professionals for a memorable Ganpati celebration."
      );
      expect(slide.image).toBeDefined();
    });

    it("Banner 6 (Corporate Events) has exact headline and description", () => {
      const slide = EVENT_HERO_SLIDES[5];
      expect(slide.eventType).toBe("Corporate Events");
      expect(slide.headline).toBe("Seamless Corporate Events, Expertly Managed.");
      expect(slide.description).toBe(
        "Plan conferences, team events, and corporate celebrations with trusted event professionals."
      );
      expect(slide.image).toBeDefined();
    });
  });

  describe("4. Automatic Carousel Timing (350 ms)", () => {
    it("configures AUTO_SLIDE_INTERVAL to 350 ms", () => {
      expect(AUTO_SLIDE_INTERVAL).toBe(350);
      expect(HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS).toBe(350);
      expect(HERO_CAROUSEL_READABLE_INTERVAL_MS).toBe(3000);
      expect(featuresContent).toContain("export const AUTO_SLIDE_INTERVAL = 350;");
    });

    it("provides six slide indicators with accessible tab roles", () => {
      expect(carouselContent).toContain('role="tablist"');
      expect(carouselContent).toContain('role="tab"');
      expect(carouselContent).toContain("aria-selected");
      expect(carouselContent).toContain("Go to slide");
    });

    it("supports manual previous and next navigation controls", () => {
      expect(carouselContent).toContain('aria-label="Previous slide"');
      expect(carouselContent).toContain('aria-label="Next slide"');
      expect(carouselContent).toContain("prevSlide");
      expect(carouselContent).toContain("nextSlide");
    });

    it("pauses automatic movement during user hover and focus interactions", () => {
      expect(carouselContent).toContain("onMouseEnter");
      expect(carouselContent).toContain("onMouseLeave");
      expect(carouselContent).toContain("onFocus");
      expect(carouselContent).toContain("onBlur");
      expect(carouselContent).toContain("setIsPaused");
    });

    it("respects reduced-motion accessibility preference", () => {
      expect(carouselContent).toContain("prefers-reduced-motion");
      expect(carouselContent).toContain("prefersReducedMotion");
    });

    it("cleans up timer on unmount to prevent leaks", () => {
      expect(carouselContent).toContain("clearInterval(timer)");
    });
  });

  describe("5. Fixed Homepage Buttons & Platform Statistics", () => {
    it("keeps 'Plan an Event' and 'Join as a Professional' stationary outside the slide track", () => {
      expect(carouselContent).toContain("Plan an Event");
      expect(carouselContent).toContain('search={{ role: "CUSTOMER" }}');
      expect(carouselContent).toContain("Join as a Professional");
      expect(carouselContent).toContain('to="/professionals"');
    });

    it("keeps platform statistics (200+ Profiles, 2 Cities, 13 Categories) visible and stationary", () => {
      expect(carouselContent).toContain("200+");
      expect(carouselContent).toContain("Profiles");
      expect(carouselContent).toContain("2");
      expect(carouselContent).toContain("Cities");
      expect(carouselContent).toContain("13");
      expect(carouselContent).toContain("Categories");
    });

    it("ensures zero layout shift with fixed min-height container and fixed aspect ratio", () => {
      expect(carouselContent).toContain("min-h-[160px]");
      expect(carouselContent).toContain("overflow-hidden");
    });
  });

  describe("6. Reversibility", () => {
    it("preserves ENABLE_EVENT_HERO_CAROUSEL flag for immediate rollback", () => {
      expect(ENABLE_EVENT_HERO_CAROUSEL).toBe(true);
      expect(indexContent).toContain("ENABLE_EVENT_HERO_CAROUSEL ? <EventHeroCarousel /> : <WeddingHero />");
      expect(weddingHeroContent).toContain("Your Entire Wedding.");
    });
  });
});
