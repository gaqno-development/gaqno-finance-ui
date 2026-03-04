import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenant, useAuth } from "@gaqno-development/frontcore/contexts";
import { financeApi } from "@/lib/finance-api";
import type {
  ICreditCard,
  ICreateCreditCardInput,
  IUpdateCreditCardInput,
  ICreditCardSummary,
} from "@gaqno-development/types/finance";

export const useCreditCards = () => {
  const { tenantId } = useTenant();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: creditCards,
    isLoading,
    refetch,
  } = useQuery<ICreditCard[]>({
    queryKey: [
      "finance-credit-cards",
      tenantId ?? "no-tenant",
      user?.id ?? "no-user",
    ],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      return financeApi.creditCards.getAll();
    },
    enabled: !!user,
  });

  const createMutation = useMutation<
    ICreditCard,
    Error,
    ICreateCreditCardInput
  >({
    mutationFn: async (input) => {
      if (!user) throw new Error("User not authenticated");
      return financeApi.creditCards.create(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["finance-credit-cards", tenantId ?? "no-tenant"],
      });
      queryClient.invalidateQueries({
        queryKey: ["finance-summary", tenantId ?? "no-tenant"],
      });
    },
  });

  const updateMutation = useMutation<
    ICreditCard,
    Error,
    IUpdateCreditCardInput
  >({
    mutationFn: async (input) => {
      if (!user || !input.id)
        throw new Error("User not authenticated or missing ID");
      return financeApi.creditCards.update(input.id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["finance-credit-cards", tenantId ?? "no-tenant"],
      });
      queryClient.invalidateQueries({
        queryKey: ["finance-summary", tenantId ?? "no-tenant"],
      });
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (creditCardId) => {
      if (!user) throw new Error("User not authenticated");
      return financeApi.creditCards.delete(creditCardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["finance-credit-cards", tenantId ?? "no-tenant"],
      });
      queryClient.invalidateQueries({
        queryKey: ["finance-transactions", tenantId ?? "no-tenant"],
      });
    },
  });

  const createCreditCard = async (input: ICreateCreditCardInput) => {
    try {
      await createMutation.mutateAsync(input);
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const updateCreditCard = async (input: IUpdateCreditCardInput) => {
    try {
      await updateMutation.mutateAsync(input);
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const deleteCreditCard = async (creditCardId: string) => {
    try {
      await deleteMutation.mutateAsync(creditCardId);
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  return {
    creditCards: creditCards || [],
    isLoading,
    refetch,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useCreditCardSummary = (creditCardId: string | null) => {
  const { tenantId } = useTenant();
  const { user } = useAuth();

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).toISOString();

  return useQuery<ICreditCardSummary>({
    queryKey: [
      "finance-credit-card-summary",
      tenantId ?? "no-tenant",
      creditCardId ?? "",
      startDate,
      endDate,
    ],
    queryFn: async () => {
      if (!user || !creditCardId)
        throw new Error("User or credit card not available");

      const transactions = await financeApi.transactions.getAll(
        startDate,
        endDate
      );

      const cardTransactions = transactions.filter(
        (t) => t.creditCardId === creditCardId && t.type === "expense"
      );

      const monthlyValue = cardTransactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      );

      const allCards = await financeApi.creditCards.getAll();
      const card = allCards.find((c) => c.id === creditCardId);
      const totalLimit = card ? Number(card.creditLimit) : 0;

      return {
        monthlyValue,
        remainingLimit: totalLimit - monthlyValue,
        totalLimit,
      };
    },
    enabled: !!user && !!creditCardId,
  });
};
