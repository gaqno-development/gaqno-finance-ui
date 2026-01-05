import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant, useAuth } from '@gaqno-dev/frontcore/contexts'
import { api } from '@/lib/api-client'
import {
  IFinanceTransaction,
  ICreateTransactionInput,
  IUpdateTransactionInput,
} from '../types/finance'

export const useTransactions = (startDate?: string, endDate?: string) => {
  const { tenantId } = useTenant()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: transactions, isLoading, refetch } = useQuery<IFinanceTransaction[]>({
    queryKey: ['finance-transactions', tenantId ?? 'no-tenant', user?.id ?? 'no-user', startDate ?? '', endDate ?? ''],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      return api.transactions.getAll(startDate, endDate)
    },
    enabled: !!user,
  })

  const createMutation = useMutation<IFinanceTransaction, Error, ICreateTransactionInput>({
    mutationFn: async (input) => {
      if (!user) throw new Error('User not authenticated')
      return api.transactions.create(input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['finance-transactions'],
        exact: false 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['finance-summary'],
        exact: false 
      })
    },
  })

  const updateMutation = useMutation<IFinanceTransaction, Error, IUpdateTransactionInput>({
    mutationFn: async (input) => {
      if (!user || !input.id) throw new Error('User not authenticated or missing ID')
      return api.transactions.update(input.id, input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['finance-transactions'],
        exact: false 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['finance-summary'],
        exact: false 
      })
    },
  })

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (transactionId) => {
      if (!user) throw new Error('User not authenticated')
      return api.transactions.delete(transactionId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['finance-transactions'],
        exact: false 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['finance-summary'],
        exact: false 
      })
    },
  })

  const createTransaction = async (input: ICreateTransactionInput) => {
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

  const updateTransaction = async (input: IUpdateTransactionInput) => {
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

  const deleteTransaction = async (transactionId: string) => {
    try {
      await deleteMutation.mutateAsync(transactionId)
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  return {
    transactions: transactions || [],
    isLoading,
    refetch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

