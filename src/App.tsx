import React from 'react'
import { AuthProvider, QueryProvider, TenantProvider } from '@gaqno-development/frontcore'
import { FinancePage } from './pages/FinancePage'

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <TenantProvider>
          <FinancePage />
        </TenantProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
