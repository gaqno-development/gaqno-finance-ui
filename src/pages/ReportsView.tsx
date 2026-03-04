import { useFinanceSummary } from '@/hooks/finance'
import { ExpensesBreakdownChart } from '@/components/ExpensesBreakdownChart'
import { IncomeBreakdownChart } from '@/components/IncomeBreakdownChart'
import { CategoryExpensesBarChart } from '@/components/CategoryExpensesBarChart'
import { IncomeExpenseAreaChart } from '@/components/IncomeExpenseAreaChart'
import { MonthlySummaryBarChart } from '@/components/MonthlySummaryBarChart'
import { TotalSavingsChart } from '@/components/TotalSavingsChart'
import { LoadingSkeleton } from '@gaqno-development/frontcore/components/ui'

export function ReportsView() {
  const { transactions, isLoading } = useFinanceSummary()

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="card" count={2} />
        <LoadingSkeleton variant="card" count={1} />
      </div>
    )
  }

  const allTransactions = transactions || []

  return (
    <div className="space-y-6 p-6">
      <IncomeExpenseAreaChart transactions={allTransactions} />

      <div className="grid gap-6 md:grid-cols-2">
        <ExpensesBreakdownChart transactions={allTransactions} />
        <IncomeBreakdownChart transactions={allTransactions} />
      </div>

      <CategoryExpensesBarChart transactions={allTransactions} />

      <MonthlySummaryBarChart transactions={allTransactions} />

      <TotalSavingsChart transactions={allTransactions} />
    </div>
  )
}
