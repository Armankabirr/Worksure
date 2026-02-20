import { describe, it, expect } from "vitest";
import { reducer } from "@/hooks/use-toast";

describe("Toast Reducer", () => {
  const initialState = { toasts: [] };

  const sampleToast = {
    id: "1",
    title: "Success",
    description: "Operation completed",
    open: true,
  };

  it("TC-T01: should add a toast", () => {
    const newState = reducer(initialState, {
      type: "ADD_TOAST",
      toast: sampleToast as any,
    });

    expect(newState.toasts).toHaveLength(1);
    expect(newState.toasts[0].title).toBe("Success");
  });

  it("TC-T02: should enforce toast limit of 1", () => {
    const stateWithOne = reducer(initialState, {
      type: "ADD_TOAST",
      toast: { ...sampleToast, id: "1" } as any,
    });

    const stateWithTwo = reducer(stateWithOne, {
      type: "ADD_TOAST",
      toast: { ...sampleToast, id: "2", title: "Second" } as any,
    });

    expect(stateWithTwo.toasts).toHaveLength(1);
    expect(stateWithTwo.toasts[0].title).toBe("Second");
  });

  it("TC-T03: should update an existing toast", () => {
    const stateWithToast = reducer(initialState, {
      type: "ADD_TOAST",
      toast: sampleToast as any,
    });

    const updatedState = reducer(stateWithToast, {
      type: "UPDATE_TOAST",
      toast: { id: "1", title: "Updated Title" },
    });

    expect(updatedState.toasts[0].title).toBe("Updated Title");
    expect(updatedState.toasts[0].description).toBe("Operation completed");
  });

  it("TC-T04: should dismiss a toast by id", () => {
    const stateWithToast = reducer(initialState, {
      type: "ADD_TOAST",
      toast: sampleToast as any,
    });

    const dismissedState = reducer(stateWithToast, {
      type: "DISMISS_TOAST",
      toastId: "1",
    });

    expect(dismissedState.toasts[0].open).toBe(false);
  });

  it("TC-T05: should remove a toast by id", () => {
    const stateWithToast = reducer(initialState, {
      type: "ADD_TOAST",
      toast: sampleToast as any,
    });

    const removedState = reducer(stateWithToast, {
      type: "REMOVE_TOAST",
      toastId: "1",
    });

    expect(removedState.toasts).toHaveLength(0);
  });

  it("TC-T06: should remove all toasts when no toastId provided", () => {
    const stateWithToast = reducer(initialState, {
      type: "ADD_TOAST",
      toast: sampleToast as any,
    });

    const removedState = reducer(stateWithToast, {
      type: "REMOVE_TOAST",
    });

    expect(removedState.toasts).toHaveLength(0);
  });

  it("TC-T07: should not modify state for non-existent toast update", () => {
    const stateWithToast = reducer(initialState, {
      type: "ADD_TOAST",
      toast: sampleToast as any,
    });

    const updatedState = reducer(stateWithToast, {
      type: "UPDATE_TOAST",
      toast: { id: "999", title: "Nonexistent" },
    });

    expect(updatedState.toasts[0].title).toBe("Success");
  });
});
