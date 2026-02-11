import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreditCards } from "./useCreditCards";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(QueryClientProvider, { client: queryClient }, children);

describe("useCreditCards", () => {
  it("returns creditCards array and loading state", async () => {
    const { result } = renderHook(() => useCreditCards(), { wrapper });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(Array.isArray(result.current.creditCards)).toBe(true);
    expect(typeof result.current.refetch).toBe("function");
    expect(typeof result.current.createCreditCard).toBe("function");
    expect(typeof result.current.updateCreditCard).toBe("function");
    expect(typeof result.current.deleteCreditCard).toBe("function");
  });
});
