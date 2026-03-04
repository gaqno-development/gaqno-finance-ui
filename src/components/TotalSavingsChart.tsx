

import { useMemo, useState } from 'react'
import { Card, CardHeader, CardContent } from '@gaqno-development/frontcore/components/ui'
import { Button } from '@gaqno-development/frontcore/components/ui'
import { TrendingUp } from 'lucide-react'
import type { IFinanceTransaction } from '@gaqno-development/types/finance'
import { formatCurrency } from '@/utils/finance/formatCurrency'
import { generateRecurringTransactions } from '@/utils/finance/generateRecurringTransactions'
import { QuarterFilterButtons } from './QuarterFilterButtons'

interface ITotalSavingsChartProps {
  transactions: IFinanceTransaction[]
}

interface IMonthSummary {
  month: string
  income: number
  expenses: number
  net: number
  color: string
}

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const MONTH_COLORS: Record<string, { bg: string; hex: string }> = {
  Janeiro: { bg: 'bg-blue-500', hex: '#3B82F6' },
  Fevereiro: { bg: 'bg-blue-500', hex: '#3B82F6' },
  Março: { bg: 'bg-blue-500', hex: '#3B82F6' },
  Abril: { bg: 'bg-green-500', hex: '#22C55E' },
  Maio: { bg: 'bg-green-500', hex: '#22C55E' },
  Junho: { bg: 'bg-green-500', hex: '#22C55E' },
  Julho: { bg: 'bg-yellow-500', hex: '#EAB308' },
  Agosto: { bg: 'bg-yellow-500', hex: '#EAB308' },
  Setembro: { bg: 'bg-yellow-500', hex: '#EAB308' },
  Outubro: { bg: 'bg-gray-500', hex: '#6B7280' },
  Novembro: { bg: 'bg-red-500', hex: '#EF4444' },
  Dezembro: { bg: 'bg-red-500', hex: '#EF4444' },
}

export function TotalSavingsChart({ transactions }: ITotalSavingsChartProps) {
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all')
  
  const allTransactions = useMemo(
    () => generateRecurringTransactions(transactions, 12),
    [transactions]
  )

  const monthlyData = useMemo(() => {
    const data: IMonthSummary[] = []

    MONTHS.forEach((month, index) => {
      const monthTransactions = allTransactions.filter((t) => {
        const date = new Date(t.transaction_date)
        return date.getMonth() === index
      })

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      const expenses = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      data.push({
        month,
        income,
        expenses,
        net: income - expenses,
        color: MONTH_COLORS[month]?.bg || 'bg-gray-500',
      })
    })

    return data
  }, [allTransactions])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
            <TrendingUp className="h-4 w-4" />
            Total Savings
          </Button>
          <QuarterFilterButtons
            selectedQuarter={selectedQuarter}
            onQuarterChange={setSelectedQuarter}
            variant="desktop"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {monthlyData.map((data) => (
            <Card
              key={data.month}
              className="p-4 border-l-4 hover:shadow-md transition-shadow"
              style={{ borderLeftColor: MONTH_COLORS[data.month]?.hex || '#6B7280' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${data.color}`} />
                <h3 className="font-semibold text-sm">{data.month}</h3>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Income:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(data.income)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expenses:</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(data.expenses)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t">
                  <span className="text-muted-foreground">Net:</span>
                  <span
                    className={`font-semibold ${data.net >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                  >
                    {formatCurrency(data.net)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

