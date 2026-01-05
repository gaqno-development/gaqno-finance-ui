import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTenant, useAuth } from '@gaqno-dev/frontcore/contexts'
import { api } from '@/lib/api-client'
import { calculateBalance } from '../utils/calcBalance'
import { IFinanceTransaction, IFinanceSummary } from '../types/finance'

export const useFinanceSummary = (startDate?: string, endDate?: string) => {
  const { tenantId } = useTenant()
  const { user } = useAuth()

  const { data: transactions, isLoading } = useQuery<IFinanceTransaction[]>({
    queryKey: ['finance-summary', tenantId ?? 'no-tenant', user?.id ?? 'no-user', startDate ?? '', endDate ?? ''],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      return api.transactions.getAll(startDate, endDate)
    },
    enabled: !!user,
  })

  const summary = useMemo<IFinanceSummary>(() => {
    if (!transactions) {
      return {
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        invested: 0,
        availableBalance: 0,
      }
    }
    return calculateBalance(transactions)
  }, [transactions])

  return {
    summary,
    transactions,
    isLoading,
  }
}

