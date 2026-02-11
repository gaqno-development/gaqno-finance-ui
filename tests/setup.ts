import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@gaqno-development/frontcore/contexts", () => ({
  useTenant: () => ({ tenantId: "tenant-1" }),
  useAuth: () => ({
    user: { id: "user-1", email: "test@example.com" },
  }),
}));

vi.mock("@/lib/finance-api", () => ({
  financeApi: {
    transactions: {
      getAll: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue(undefined),
    },
    categories: {
      getAll: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue(undefined),
    },
    subcategories: {
      getAll: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue(undefined),
    },
    creditCards: {
      getAll: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue(undefined),
    },
  },
}));
