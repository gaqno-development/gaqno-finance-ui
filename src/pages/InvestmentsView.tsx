import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@gaqno-development/frontcore/components/ui'
import { Badge } from '@gaqno-development/frontcore/components/ui'
import { TrendingUp, BarChart3, PieChart, Wallet } from 'lucide-react'
import { useFinanceSummary } from '@/hooks/finance'
import { formatCurrency } from '@/utils/finance/formatCurrency'
import { LoadingSkeleton } from '@gaqno-development/frontcore/components/ui'

export function InvestmentsView() {
  const { summary, isLoading } = useFinanceSummary()

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="card" count={3} />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Investido</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.invested)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rendimento</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patrimônio Total</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              <div>
                <CardTitle>Distribuição de Ativos</CardTitle>
                <CardDescription>Alocação do portfólio por tipo de investimento</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <PieChart className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">
                Cadastre seus investimentos para visualizar a distribuição
              </p>
              <Badge variant="outline">Em desenvolvimento</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <div>
                <CardTitle>Evolução Patrimonial</CardTitle>
                <CardDescription>Crescimento do patrimônio ao longo do tempo</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">
                Acompanhe a evolução do seu patrimônio
              </p>
              <Badge variant="outline">Em desenvolvimento</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
