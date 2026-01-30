import { Card, CardHeader, CardTitle, CardContent } from '@gaqno-development/frontcore/components/ui'
import { FileText } from 'lucide-react'

export function ReportsView() {
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Reports</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Reports and analytics functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

