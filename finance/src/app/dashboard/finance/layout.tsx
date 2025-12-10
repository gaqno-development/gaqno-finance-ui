'use client'

import { FeatureGuard } from '@gaqno-dev/ui/components/guards'
import { FeatureModule, FeaturePermissionLevel } from '@gaqno-dev/core/types/user'

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FeatureGuard feature={FeatureModule.FINANCE} minRole={FeaturePermissionLevel.ACCESS}>
      {children}
    </FeatureGuard>
  )
}

