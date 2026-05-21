import { describe, it, expect } from "vitest";
import { cn } from "../cn";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });
  it("ignores falsy values", () => {
    expect(cn("base", false && "skip", undefined, "keep")).toBe("base keep");
  });
  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });
  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
  it("handles conditional object syntax", () => {
    expect(cn({ active: true, disabled: false })).toBe("active");
  });
});
