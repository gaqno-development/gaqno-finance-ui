import { Card, CardHeader, CardTitle, CardContent } from '@gaqno-dev/frontcore/components/ui'
import { Settings } from 'lucide-react'

export function SettingsView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Finance settings functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

