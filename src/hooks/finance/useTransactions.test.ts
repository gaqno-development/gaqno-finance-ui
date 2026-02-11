import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTransactions } from "./useTransactions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(QueryClientProvider, { client: queryClient }, children);

describe("useTransactions", () => {
  it("returns transactions array and loading state", async () => {
    const { result } = renderHook(() => useTransactions(), { wrapper });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(Array.isArray(result.current.transactions)).toBe(true);
    expect(typeof result.current.refetch).toBe("function");
    expect(typeof result.current.createTransaction).toBe("function");
    expect(typeof result.current.updateTransaction).toBe("function");
    expect(typeof result.current.deleteTransaction).toBe("function");
  });
});
