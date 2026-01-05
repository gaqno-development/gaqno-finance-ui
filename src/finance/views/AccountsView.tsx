import { Card, CardHeader, CardTitle, CardContent } from '@gaqno-dev/frontcore/components/ui'
import { Wallet } from 'lucide-react'

export function AccountsView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <CardTitle>Accounts</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Accounts management functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

