import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCategories } from "./useCategories";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(QueryClientProvider, { client: queryClient }, children);

describe("useCategories", () => {
  it("returns categories array and loading state", async () => {
    const { result } = renderHook(() => useCategories(), { wrapper });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(Array.isArray(result.current.categories)).toBe(true);
    expect(typeof result.current.refetch).toBe("function");
    expect(typeof result.current.createCategory).toBe("function");
    expect(typeof result.current.updateCategory).toBe("function");
    expect(typeof result.current.deleteCategory).toBe("function");
  });
});
