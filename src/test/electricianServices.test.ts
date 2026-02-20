import { describe, it, expect } from "vitest";
import {
  electricianServicesData,
  type ElectricianServiceData,
} from "@/lib/electricianServices";

describe("Electrician Services Data", () => {
  const serviceKeys = Object.keys(electricianServicesData);

  it("TC-ES01: should have at least 3 service categories", () => {
    expect(serviceKeys.length).toBeGreaterThanOrEqual(3);
  });

  it("TC-ES02: each service should have required fields", () => {
    serviceKeys.forEach((key) => {
      const service = electricianServicesData[key];
      expect(service.slug).toBeDefined();
      expect(service.title).toBeDefined();
      expect(service.subtitle).toBeDefined();
      expect(service.description).toBeDefined();
      expect(service.startingPrice).toBeDefined();
      expect(service.duration).toBeDefined();
    });
  });

  it("TC-ES03: slug should match the object key", () => {
    serviceKeys.forEach((key) => {
      expect(electricianServicesData[key].slug).toBe(key);
    });
  });

  it("TC-ES04: each service should have non-empty included items", () => {
    serviceKeys.forEach((key) => {
      const service = electricianServicesData[key];
      expect(Array.isArray(service.included)).toBe(true);
      expect(service.included.length).toBeGreaterThan(0);
    });
  });

  it("TC-ES05: each service should have non-empty notIncluded items", () => {
    serviceKeys.forEach((key) => {
      const service = electricianServicesData[key];
      expect(Array.isArray(service.notIncluded)).toBe(true);
      expect(service.notIncluded.length).toBeGreaterThan(0);
    });
  });

  it("TC-ES06: each service should have FAQs with question and answer", () => {
    serviceKeys.forEach((key) => {
      const service = electricianServicesData[key];
      expect(Array.isArray(service.faqs)).toBe(true);
      expect(service.faqs.length).toBeGreaterThan(0);
      service.faqs.forEach((faq) => {
        expect(faq.question).toBeDefined();
        expect(faq.question.length).toBeGreaterThan(0);
        expect(faq.answer).toBeDefined();
        expect(faq.answer.length).toBeGreaterThan(0);
      });
    });
  });

  it("TC-ES07: each service should have pricing factors", () => {
    serviceKeys.forEach((key) => {
      const service = electricianServicesData[key];
      expect(Array.isArray(service.pricingFactors)).toBe(true);
      expect(service.pricingFactors.length).toBeGreaterThan(0);
      service.pricingFactors.forEach((pf) => {
        expect(pf.factor).toBeDefined();
        expect(pf.description).toBeDefined();
      });
    });
  });

  it("TC-ES08: 'electrical-repair' service should exist with correct title", () => {
    expect(electricianServicesData["electrical-repair"]).toBeDefined();
    expect(electricianServicesData["electrical-repair"].title).toBe(
      "Electrical Repair"
    );
  });

  it("TC-ES09: each service should have coveredAreas", () => {
    serviceKeys.forEach((key) => {
      const service = electricianServicesData[key];
      expect(Array.isArray(service.coveredAreas)).toBe(true);
      expect(service.coveredAreas.length).toBeGreaterThan(0);
    });
  });

  it("TC-ES10: startingPrice should contain the currency symbol ৳", () => {
    serviceKeys.forEach((key) => {
      expect(electricianServicesData[key].startingPrice).toContain("৳");
    });
  });
});
