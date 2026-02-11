import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFinanceSummary } from "./useFinanceSummary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(QueryClientProvider, { client: queryClient }, children);

describe("useFinanceSummary", () => {
  it("returns summary and loading state", async () => {
    const { result } = renderHook(() => useFinanceSummary(), { wrapper });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.summary).toEqual({
      totalBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      invested: 0,
      availableBalance: 0,
    });
    expect(Array.isArray(result.current.transactions)).toBe(true);
  });
});
