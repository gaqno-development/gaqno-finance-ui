import { useTransactions } from '@/hooks/finance/useTransactions'
import { TransactionsTable } from '@/components/TransactionsTable'
import { LoadingSkeleton } from '@gaqno-development/frontcore/components/ui'

export function TransactionsView() {
  const { transactions, isLoading, deleteTransaction } = useTransactions()

  const handleDelete = async (transactionId: string) => {
    await deleteTransaction(transactionId)
  }

  if (isLoading) {
    return <LoadingSkeleton variant="card" count={1} />
  }

  return (
    <div className="space-y-6">
      <TransactionsTable
        transactions={transactions}
        onDelete={handleDelete}
      />
    </div>
  )
}

