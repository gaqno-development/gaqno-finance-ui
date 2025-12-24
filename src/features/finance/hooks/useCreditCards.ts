import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant, useAuth } from '@gaqno-dev/frontcore/contexts'
import { api } from '@/lib/api-client'
import {
  ICreditCard,
  ICreateCreditCardInput,
  IUpdateCreditCardInput,
  ICreditCardSummary,
} from '../types/finance'

export const useCreditCards = () => {
  const { tenantId } = useTenant()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: creditCards, isLoading, refetch } = useQuery<ICreditCard[]>({
    queryKey: ['finance-credit-cards', tenantId ?? 'no-tenant', user?.id ?? 'no-user'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      return api.creditCards.getAll()
    },
    enabled: !!user,
  })

  const createMutation = useMutation<ICreditCard, Error, ICreateCreditCardInput>({
    mutationFn: async (input) => {
      if (!user) throw new Error('User not authenticated')
      return api.creditCards.create(input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-credit-cards', tenantId ?? 'no-tenant'] })
      queryClient.invalidateQueries({ queryKey: ['finance-summary', tenantId ?? 'no-tenant'] })
    },
  })

  const updateMutation = useMutation<ICreditCard, Error, IUpdateCreditCardInput>({
    mutationFn: async (input) => {
      if (!user || !input.id) throw new Error('User not authenticated or missing ID')
      return api.creditCards.update(input.id, input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-credit-cards', tenantId ?? 'no-tenant'] })
      queryClient.invalidateQueries({ queryKey: ['finance-summary', tenantId ?? 'no-tenant'] })
    },
  })

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (creditCardId) => {
      if (!user) throw new Error('User not authenticated')
      return api.creditCards.delete(creditCardId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-credit-cards', tenantId ?? 'no-tenant'] })
      queryClient.invalidateQueries({ queryKey: ['finance-transactions', tenantId ?? 'no-tenant'] })
    },
  })

  const createCreditCard = async (input: ICreateCreditCardInput) => {
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

  const updateCreditCard = async (input: IUpdateCreditCardInput) => {
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

  const deleteCreditCard = async (creditCardId: string) => {
    try {
      await deleteMutation.mutateAsync(creditCardId)
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

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
  }
}

export const useCreditCardSummary = (
  creditCardId: string | null,
  startDate?: string,
  endDate?: string
) => {
  const { tenantId } = useTenant()
  const { user } = useAuth()

  return useQuery<ICreditCardSummary>({
    queryKey: ['finance-credit-card-summary', tenantId ?? 'no-tenant', creditCardId ?? '', startDate ?? '', endDate ?? ''],
    queryFn: async () => {
      if (!user || !creditCardId) throw new Error('User or credit card not available')
      return { monthlyValue: 0, remainingLimit: 0, totalLimit: 0 }
    },
    enabled: !!user && !!creditCardId,
  })
}

