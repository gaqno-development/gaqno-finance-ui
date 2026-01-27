import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant } from '@gaqno-development/frontcore/contexts'
import { api } from '@/lib/api-client'
import {
  IFinanceSubcategory,
  ICreateSubcategoryInput,
  IUpdateSubcategoryInput,
} from '@/types/finance/finance'

export const useSubcategories = (parentCategoryId: string | null) => {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()

  const { data: subcategories, isLoading, refetch } = useQuery<IFinanceSubcategory[]>({
    queryKey: ['finance-subcategories', tenantId ?? 'no-tenant', parentCategoryId ?? 'no-parent'],
    queryFn: async () => {
      if (!parentCategoryId) return []
      return api.subcategories.getAll(parentCategoryId)
    },
    enabled: !!parentCategoryId,
  })

  const createMutation = useMutation<IFinanceSubcategory, Error, ICreateSubcategoryInput>({
    mutationFn: async (input) => {
      return api.subcategories.create(input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-subcategories', tenantId ?? 'no-tenant'] })
      queryClient.invalidateQueries({ queryKey: ['finance-categories', tenantId ?? 'no-tenant'] })
    },
  })

  const updateMutation = useMutation<IFinanceSubcategory, Error, IUpdateSubcategoryInput>({
    mutationFn: async (input) => {
      if (!input.id) throw new Error('Missing subcategory ID')
      return api.subcategories.update(input.id, input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-subcategories', tenantId ?? 'no-tenant'] })
    },
  })

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (subcategoryId) => {
      return api.subcategories.delete(subcategoryId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-subcategories', tenantId ?? 'no-tenant'] })
    },
  })

  const createSubcategory = async (input: ICreateSubcategoryInput) => {
    try {
      await createMutation.mutateAsync(input)
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  const updateSubcategory = async (input: IUpdateSubcategoryInput) => {
    try {
      await updateMutation.mutateAsync(input)
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  const deleteSubcategory = async (subcategoryId: string) => {
    try {
      await deleteMutation.mutateAsync(subcategoryId)
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  return {
    subcategories: subcategories || [],
    isLoading,
    refetch,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

