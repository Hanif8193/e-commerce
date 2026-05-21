import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, formatShortDate, truncateId } from "../format";

describe("formatCurrency", () => {
  it("formats a number as USD", () => {
    expect(formatCurrency(29.99)).toBe("$29.99");
  });
  it("formats a string amount", () => {
    expect(formatCurrency("100")).toBe("$100.00");
  });
  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });
  it("formats a large amount with commas", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });
});

describe("truncateId", () => {
  it("returns last 8 chars uppercase with # prefix", () => {
    expect(truncateId("abcdef1234567890")).toBe("#34567890".toUpperCase());
  });
  it("respects custom length", () => {
    expect(truncateId("abcdef1234567890", 4)).toBe("#7890".toUpperCase());
  });
  it("handles IDs shorter than the default length", () => {
    const short = "abc";
    expect(truncateId(short)).toBe(`#${short.toUpperCase()}`);
  });
});

describe("formatDate", () => {
  it("includes the year", () => {
    expect(formatDate(new Date("2024-06-15"))).toContain("2024");
  });
  it("accepts a string date", () => {
    expect(formatDate("2024-01-01")).toContain("2024");
  });
});

describe("formatShortDate", () => {
  it("returns a shorter date string", () => {
    const result = formatShortDate(new Date("2024-06-15"));
    expect(result).toContain("2024");
    expect(result.length).toBeLessThan(formatDate(new Date("2024-06-15")).length + 5);
  });
});
