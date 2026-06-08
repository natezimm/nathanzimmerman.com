import { describe, expect, it } from "vitest";
import {
  LOCATION_DESTINATIONS,
  NAV_POINTS,
  buildGuidedRoute,
  getNextNavNode,
} from "./navigationMap";

const samePoint = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  a.x === b.x && a.y === b.y;

describe("navigation map", () => {
  it("locks free movement to connected path nodes", () => {
    expect(getNextNavNode("center", "down")).toBeUndefined();
    expect(getNextNavNode("bottomCenter", "left")).toBe("leftBottomSpine");
    expect(getNextNavNode("bottomCenter", "right")).toBe("rightBottomSpine");
  });

  it("keeps the lower horizontal path available for travel", () => {
    const route = buildGuidedRoute("nerdle", "experience");

    expect(route.some((point) => samePoint(point, NAV_POINTS.bottomCenter))).toBe(
      true,
    );
    expect(
      route.some((point) => samePoint(point, NAV_POINTS.rightBottomSpine)),
    ).toBe(true);
  });

  it("routes to Arcade District from the side path instead of the center vertical approach", () => {
    const route = buildGuidedRoute("blackjack", "brick-breaker");

    expect(
      route.some((point) => samePoint(point, NAV_POINTS.rightBottomSpine)),
    ).toBe(true);
    expect(route.some((point) => samePoint(point, NAV_POINTS.bottomCenter))).toBe(
      true,
    );
  });

  it("still routes to Arcade District when Brick Breaker is selected", () => {
    const route = buildGuidedRoute("blackjack", "brick-breaker");
    const arcadeDistrict = LOCATION_DESTINATIONS["brick-breaker"];

    expect(route.some((point) => samePoint(point, arcadeDistrict))).toBe(true);
  });
});
