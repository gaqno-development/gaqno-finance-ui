import React from 'react'
import { AuthProvider, QueryProvider, TenantProvider } from "@gaqno-dev/frontcore";

function FinancePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Finance Module</h1>
      <p className="text-muted-foreground mt-2">Finance functionality coming soon...</p>
    </div>
  )
}

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

