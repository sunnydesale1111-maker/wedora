import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

describe("App routing & navigation targets", () => {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
  });

  it("matches root route '/' successfully", () => {
    const matches = router.matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/");
  });

  it("matches dedicated '/professionals' selection route successfully", () => {
    const matches = router.matchRoutes("/professionals");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/professionals");
  });

  it("matches auth flow '/get-started' route successfully", () => {
    const matches = router.matchRoutes("/get-started");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/get-started");
  });

  it("matches customer, planner, and vendor dashboard routes successfully", () => {
    const customerMatches = router.matchRoutes("/customer");
    expect(customerMatches.at(-1)?.routeId).toBe("/customer");

    const plannerMatches = router.matchRoutes("/planner");
    expect(plannerMatches.at(-1)?.routeId).toBe("/planner");

    const vendorMatches = router.matchRoutes("/vendor");
    expect(vendorMatches.at(-1)?.routeId).toBe("/vendor");
  });
});
