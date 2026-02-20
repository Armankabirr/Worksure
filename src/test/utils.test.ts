import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn() utility function", () => {
  it("TC-U01: should merge class names correctly", () => {
    const result = cn("bg-red-500", "text-white");
    expect(result).toBe("bg-red-500 text-white");
  });

  it("TC-U02: should handle conflicting Tailwind classes (last wins)", () => {
    const result = cn("bg-red-500", "bg-blue-500");
    expect(result).toBe("bg-blue-500");
  });

  it("TC-U03: should handle conditional classes", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class active-class");
  });

  it("TC-U04: should ignore falsy values", () => {
    const result = cn("base-class", false, null, undefined, "real-class");
    expect(result).toBe("base-class real-class");
  });

  it("TC-U05: should return empty string for no arguments", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("TC-U06: should handle object syntax", () => {
    const result = cn({ "bg-red-500": true, "text-white": false });
    expect(result).toBe("bg-red-500");
  });

  it("TC-U07: should handle array syntax", () => {
    const result = cn(["bg-red-500", "text-white"]);
    expect(result).toBe("bg-red-500 text-white");
  });
});
