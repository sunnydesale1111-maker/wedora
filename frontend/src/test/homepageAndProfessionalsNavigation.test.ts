import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Wedora – Final Homepage Navigation & Dedicated Professionals Selection Page", () => {
  const indexTsxPath = path.resolve(__dirname, "../routes/index.tsx");
  const professionalsTsxPath = path.resolve(__dirname, "../routes/professionals.tsx");

  const indexContent = fs.readFileSync(indexTsxPath, "utf-8");
  const professionalsContent = fs.readFileSync(professionalsTsxPath, "utf-8");

  describe("1. Homepage Header Navigation", () => {
    it("completely removes 'Get Started' button from the top navigation header", () => {
      // Extract header block
      const headerMatch = indexContent.match(/<header[\s\S]*?<\/header>/);
      expect(headerMatch).not.toBeNull();
      const headerText = headerMatch![0];

      // Must not contain "Get Started"
      expect(headerText).not.toContain("Get Started");
      // Must not contain link to get-started in header
      expect(headerText).not.toContain('to="/get-started"');
    });

    it("does not leave any duplicate 'Get Started' buttons anywhere on the homepage", () => {
      expect(indexContent).not.toContain("Get Started");
    });
  });

  describe("2. Homepage Main Hero CTAs", () => {
    it("has 'Plan an Event' as primary button navigating to /get-started with role=CUSTOMER", () => {
      // Must have "Plan an Event"
      expect(indexContent).toContain("Plan an Event");
      // Must link to /get-started with role: "CUSTOMER"
      expect(indexContent).toContain('search={{ role: "CUSTOMER" }}');
    });

    it("has 'Join as a Professional' linking directly to /professionals without dropdowns or popovers", () => {
      expect(indexContent).toContain('to="/professionals"');
      expect(indexContent).toContain("Join as a Professional");

      // Verify no dropdown, popover or inline selection state
      expect(indexContent).not.toContain("isProDropdownOpen");
      expect(indexContent).not.toContain("proDropdownRef");
      expect(indexContent).not.toContain("Choose Your Professional Role");
    });

    it("updates section CTAs (Customer Stories and Planning Journey) to 'Plan an Event'", () => {
      // Both sections should feature Plan an Event
      const planAnEventCount = (indexContent.match(/Plan an Event/g) || []).length;
      // Hero + Stories + Planning Journey = at least 3 occurrences
      expect(planAnEventCount).toBeGreaterThanOrEqual(3);
    });
  });

  describe("3. Dedicated Professional Selection Page (/professionals)", () => {
    it("is implemented as a dedicated TanStack route at /professionals", () => {
      expect(professionalsContent).toContain('createFileRoute("/professionals")');
    });

    it("includes a back navigation link to return to the homepage", () => {
      expect(professionalsContent).toContain('to="/"');
      expect(professionalsContent).toContain("Back to Homepage");
    });

    it("contains Option 1 for Vendor navigating to /get-started with role=VENDOR", () => {
      expect(professionalsContent).toContain("I'm a Vendor");
      expect(professionalsContent).toContain('search={{ role: "VENDOR" }}');
      expect(professionalsContent).toContain("Store");
    });

    it("contains Option 2 for Event Organizer navigating to /get-started with role=PLANNER", () => {
      expect(professionalsContent).toContain("I'm an Event Organizer");
      expect(professionalsContent).toContain('search={{ role: "PLANNER" }}');
      expect(professionalsContent).toContain("Users");
    });

    it("uses a responsive layout: side by side on desktop and stacked on mobile", () => {
      expect(professionalsContent).toContain("grid gap-8 md:grid-cols-2");
    });

    it("does not render duplicate onboarding forms on the selection page", () => {
      // It links to /get-started rather than embedding auth forms
      expect(professionalsContent).not.toContain("<form");
      expect(professionalsContent).not.toContain("useForm");
    });
  });
});
