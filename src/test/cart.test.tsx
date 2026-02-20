import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, type CartItem } from "@/context/CartContext";
import { useCart } from "@/hooks/useCart";
import type { ReactNode } from "react";
import { createElement } from "react";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(CartProvider, null, children);

const sampleItem = {
  serviceType: "electrician",
  serviceName: "Wiring Repair",
  price: 500,
  description: "Basic wiring repair service",
};

const sampleItem2 = {
  serviceType: "cleaning",
  serviceName: "Deep Clean",
  price: 1000,
  description: "Full house deep cleaning",
};

describe("useCart Hook & CartContext", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("TC-C01: should start with an empty cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("TC-C02: should add an item to the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].serviceName).toBe("Wiring Repair");
    expect(result.current.cart[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(500);
  });

  it("TC-C03: should increase quantity when adding duplicate item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
    });
    act(() => {
      result.current.addToCart(sampleItem);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(1000);
  });

  it("TC-C04: should add multiple different items", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
    });
    act(() => {
      result.current.addToCart(sampleItem2);
    });

    expect(result.current.cart).toHaveLength(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(1500);
  });

  it("TC-C05: should remove an item from the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
    });

    const itemId = result.current.cart[0].id;

    act(() => {
      result.current.removeFromCart(itemId);
    });

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it("TC-C06: should update quantity of an item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
    });

    const itemId = result.current.cart[0].id;

    act(() => {
      result.current.updateQuantity(itemId, 5);
    });

    expect(result.current.cart[0].quantity).toBe(5);
    expect(result.current.totalItems).toBe(5);
    expect(result.current.totalPrice).toBe(2500);
  });

  it("TC-C07: should remove item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
    });

    const itemId = result.current.cart[0].id;

    act(() => {
      result.current.updateQuantity(itemId, 0);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it("TC-C08: should clear the entire cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
      result.current.addToCart(sampleItem2);
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("TC-C09: should throw error when useCart is used outside CartProvider", () => {
    expect(() => {
      renderHook(() => useCart());
    }).toThrow("useCart must be used within a CartProvider");
  });

  it("TC-C10: should calculate totalPrice correctly with multiple items and quantities", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem); // 500 × 1
    });
    act(() => {
      result.current.addToCart(sampleItem2); // 1000 × 1
    });

    const firstId = result.current.cart[0].id;

    act(() => {
      result.current.updateQuantity(firstId, 3); // 500 × 3 = 1500
    });

    // 1500 + 1000 = 2500
    expect(result.current.totalPrice).toBe(2500);
    expect(result.current.totalItems).toBe(4);
  });
});
