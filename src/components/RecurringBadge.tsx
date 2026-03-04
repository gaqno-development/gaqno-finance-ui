

import { RefreshCw } from 'lucide-react'
import type { IFinanceTransaction } from '@gaqno-development/types/finance'

interface IRecurringBadgeProps {
  transaction: IFinanceTransaction
  variant?: 'badge' | 'text'
  className?: string
}

const getRecurringTypeLabel = (transaction: IFinanceTransaction): string => {
  if (transaction.recurringType === 'fifth_business_day') return '(5º dia útil)'
  if (transaction.recurringType === 'day_15') return '(dia 15)'
  if (transaction.recurringType === 'last_day') return '(fim do mês)'
  if (transaction.recurringDay) return `(dia ${transaction.recurringDay})`
  return ''
}

const getRecurringTypeText = (transaction: IFinanceTransaction): string => {
  if (transaction.recurringType === 'fifth_business_day') return 'Quinto dia útil do mês'
  if (transaction.recurringType === 'day_15') return 'Todo dia 15'
  if (transaction.recurringType === 'last_day') return 'Final do mês'
  if (transaction.recurringType === 'custom' && transaction.recurringDay) {
    return `Todo dia ${transaction.recurringDay} do mês`
  }
  if (transaction.recurringDay) {
    return `Todo dia ${transaction.recurringDay} do mês`
  }
  return ''
}

export function RecurringBadge({ transaction, variant = 'badge', className = '' }: IRecurringBadgeProps) {
  if (!transaction.isRecurring) return null

  if (variant === 'text') {
    const text = getRecurringTypeText(transaction)
    return text ? <span>{text}</span> : null
  }

  const label = transaction.id.includes('-generated-') ? 'Auto' : 'Recorrente'
  const typeLabel = getRecurringTypeLabel(transaction)

  return (
    <span className={`bg-purple-100 text-purple-700 px-2 py-0.5 rounded flex items-center gap-1 ${className}`}>
      <RefreshCw className="w-3 h-3" />
      <span className="hidden md:inline">
        {label} {typeLabel}
      </span>
    </span>
  )
}

