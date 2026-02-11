import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSubcategories } from "./useSubcategories";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(QueryClientProvider, { client: queryClient }, children);

describe("useSubcategories", () => {
  it("returns subcategories array when parentCategoryId is provided", async () => {
    const { result } = renderHook(() => useSubcategories("parent-1"), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(Array.isArray(result.current.subcategories)).toBe(true);
    expect(typeof result.current.refetch).toBe("function");
    expect(typeof result.current.createSubcategory).toBe("function");
    expect(typeof result.current.updateSubcategory).toBe("function");
    expect(typeof result.current.deleteSubcategory).toBe("function");
  });

  it("does not fetch when parentCategoryId is null", async () => {
    const { result } = renderHook(() => useSubcategories(null), { wrapper });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.subcategories).toEqual([]);
  });
});
