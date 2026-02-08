import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenant } from "@gaqno-development/frontcore/contexts";
import { financeApi } from "@/lib/finance-api";
import {
  IFinanceCategory,
  ICreateCategoryInput,
  IUpdateCategoryInput,
  TransactionType,
} from "@/types/finance/finance";

export const useCategories = (type?: TransactionType) => {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery<IFinanceCategory[]>({
    queryKey: ["finance-categories", tenantId ?? "no-tenant", type ?? "all"],
    queryFn: async () => {
      return financeApi.categories.getAll(type);
    },
  });

  const createMutation = useMutation<
    IFinanceCategory,
    Error,
    ICreateCategoryInput
  >({
    mutationFn: async (input) => {
      return financeApi.categories.create(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["finance-categories", tenantId ?? "no-tenant"],
      });
    },
  });

  const updateMutation = useMutation<
    IFinanceCategory,
    Error,
    IUpdateCategoryInput
  >({
    mutationFn: async (input) => {
      if (!input.id) throw new Error("Missing category ID");
      return financeApi.categories.update(input.id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["finance-categories", tenantId ?? "no-tenant"],
      });
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (categoryId) => {
      return financeApi.categories.delete(categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["finance-categories", tenantId ?? "no-tenant"],
      });
    },
  });

  const createCategory = async (input: ICreateCategoryInput) => {
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

  const updateCategory = async (input: IUpdateCategoryInput) => {
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

  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteMutation.mutateAsync(categoryId);
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  return {
    categories: categories || [],
    isLoading,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
