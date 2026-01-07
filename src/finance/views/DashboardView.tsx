import { useFinanceSummary } from '../hooks/useFinanceSummary'
import { BalanceCard } from '../components/BalanceCard'
import { IncomeCard } from '../components/IncomeCard'
import { ExpenseCard } from '../components/ExpenseCard'
import { IncomeExpenseView } from '../components/IncomeExpenseView'
import { useTransactions } from '../hooks/useTransactions'
import { LoadingSkeleton } from '@gaqno-development/frontcore/components/ui'

export function DashboardView() {
  const { summary, transactions, isLoading } = useFinanceSummary()
  const { deleteTransaction } = useTransactions()

  const handleDelete = async (transactionId: string) => {
    await deleteTransaction(transactionId)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <LoadingSkeleton variant="card" count={3} />
        </div>
        <LoadingSkeleton variant="card" count={1} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <BalanceCard
          total={summary.totalBalance}
          invested={summary.invested}
          available={summary.availableBalance}
        />
        <IncomeCard total={summary.totalIncome} />
        <ExpenseCard total={summary.totalExpenses} />
      </div>

      <IncomeExpenseView
        transactions={transactions || []}
        onDelete={handleDelete}
      />
    </div>
  )
}

