import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@gaqno-development/frontcore/components/ui'
import { Button } from '@gaqno-development/frontcore/components/ui'
import { Badge } from '@gaqno-development/frontcore/components/ui'
import { Wallet, Plus, Building2, Landmark, PiggyBank } from 'lucide-react'
import { CreditCardOverview } from '@/components/CreditCardOverview'
import { useFinanceSummary } from '@/hooks/finance'
import { useCreditCards } from '@/hooks/finance'
import { formatCurrency } from '@/utils/finance/formatCurrency'
import { LoadingSkeleton } from '@gaqno-development/frontcore/components/ui'

export function AccountsView() {
  const { summary, isLoading: isSummaryLoading } = useFinanceSummary()
  const { creditCards, isLoading: isCardsLoading } = useCreditCards()

  const isLoading = isSummaryLoading || isCardsLoading

  const totalCreditLimit = creditCards.reduce(
    (sum, card) => sum + Number(card.creditLimit),
    0
  )

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
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Disponível</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.availableBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <PiggyBank className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Investido</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.invested)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Landmark className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Limite de Crédito Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCreditLimit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreditCardOverview />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <div>
                <CardTitle>Contas Bancárias</CardTitle>
                <CardDescription>Gerencie suas contas correntes e poupanças</CardDescription>
              </div>
            </div>
            <Button size="sm" variant="outline" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Conta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2">
              Integração com contas bancárias em breve
            </p>
            <Badge variant="outline">Em desenvolvimento</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
