import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn helper", () => {
  it("keeps the last conflicting utility", () => {
    const value = cn("text-sm", "text-lg", "text-red-500");

    expect(value).toContain("text-lg");
    expect(value).not.toContain("text-sm");
  });

  it("joins multiple classes", () => {
    const value = cn("foo", "bar", "baz");
    expect(value).toBe("foo bar baz");
  });
});
