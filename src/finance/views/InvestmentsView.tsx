import { Card, CardHeader, CardTitle, CardContent } from '@gaqno-dev/frontcore/components/ui'
import { TrendingUp } from 'lucide-react'

export function InvestmentsView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <CardTitle>Investments</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Investments tracking functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

