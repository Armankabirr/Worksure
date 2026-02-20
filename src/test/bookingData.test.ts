import { describe, it, expect } from "vitest";
import { mockBookings, calculateBookingStats } from "@/lib/mockBookingData";

describe("Mock Booking Data", () => {
  it("TC-B01: should have at least 10 bookings", () => {
    expect(mockBookings.length).toBeGreaterThanOrEqual(10);
  });

  it("TC-B02: each booking should have a unique id", () => {
    const ids = mockBookings.map((b) => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("TC-B03: each booking should have required fields", () => {
    mockBookings.forEach((booking) => {
      expect(booking.id).toBeDefined();
      expect(booking.serviceCategory).toBeDefined();
      expect(booking.serviceName).toBeDefined();
      expect(booking.status).toBeDefined();
      expect(booking.totalAmount).toBeDefined();
      expect(booking.scheduledDate).toBeDefined();
    });
  });

  it("TC-B04: booking status should be one of the valid values", () => {
    const validStatuses = [
      "pending",
      "accepted",
      "ongoing",
      "in_progress",
      "completed",
      "cancelled",
      "disputed",
      "awaiting",
    ];
    mockBookings.forEach((booking) => {
      expect(validStatuses).toContain(booking.status);
    });
  });

  it("TC-B05: totalAmount should always be a positive number", () => {
    mockBookings.forEach((booking) => {
      expect(booking.totalAmount).toBeGreaterThan(0);
    });
  });

  it("TC-B06: each booking should have a valid user object", () => {
    mockBookings.forEach((booking) => {
      expect(booking.user).toBeDefined();
      expect(booking.user.name).toBeDefined();
      expect(booking.user.email).toBeDefined();
      expect(booking.user.phone).toBeDefined();
    });
  });

  it("TC-B07: paid bookings should have a payment method", () => {
    const paidBookings = mockBookings.filter(
      (b) => b.paymentStatus === "paid"
    );
    paidBookings.forEach((booking) => {
      expect(booking.paymentMethod).toBeDefined();
    });
  });

  it("TC-B08: each booking should have a statusHistory array", () => {
    mockBookings.forEach((booking) => {
      expect(Array.isArray(booking.statusHistory)).toBe(true);
      expect(booking.statusHistory.length).toBeGreaterThanOrEqual(1);
    });
  });
});

describe("calculateBookingStats()", () => {
  it("TC-BS01: should return correct totalBookings count", () => {
    const stats = calculateBookingStats(mockBookings);
    expect(stats.totalBookings).toBe(mockBookings.length);
  });

  it("TC-BS02: should calculate totalRevenue from paid bookings only", () => {
    const stats = calculateBookingStats(mockBookings);
    const expectedRevenue = mockBookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    expect(stats.totalRevenue).toBe(expectedRevenue);
  });

  it("TC-BS03: statusCounts should sum to totalBookings", () => {
    const stats = calculateBookingStats(mockBookings);
    const totalFromCounts = stats.statusCounts.reduce(
      (sum, s) => sum + s.count,
      0
    );
    expect(totalFromCounts).toBe(stats.totalBookings);
  });

  it("TC-BS04: should have paymentStats for paid and unpaid", () => {
    const stats = calculateBookingStats(mockBookings);
    expect(stats.paymentStats).toHaveLength(2);
    expect(stats.paymentStats[0].paymentCompleted).toBe(true);
    expect(stats.paymentStats[1].paymentCompleted).toBe(false);
  });

  it("TC-BS05: paid + unpaid count should cover most bookings (excluding refunded)", () => {
    const stats = calculateBookingStats(mockBookings);
    const paidCount = stats.paymentStats[0].count;
    const unpaidCount = stats.paymentStats[1].count;
    const refundedCount = mockBookings.filter(
      (b) => b.paymentStatus !== "paid" && b.paymentStatus !== "unpaid"
    ).length;
    expect(paidCount + unpaidCount + refundedCount).toBe(stats.totalBookings);
  });

  it("TC-BS06: should return zero revenue for empty bookings array", () => {
    const stats = calculateBookingStats([]);
    expect(stats.totalBookings).toBe(0);
    expect(stats.totalRevenue).toBe(0);
  });

  it("TC-BS07: pending bookings count should match filtered data", () => {
    const stats = calculateBookingStats(mockBookings);
    const pendingCount = stats.statusCounts.find(
      (s) => s.status === "pending"
    )?.count;
    const expectedPending = mockBookings.filter(
      (b) => b.status === "pending"
    ).length;
    expect(pendingCount).toBe(expectedPending);
  });
});
