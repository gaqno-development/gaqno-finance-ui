import React from 'react'
import { AuthProvider, QueryProvider, TenantProvider } from '@gaqno-development/frontcore'
import { initI18n, I18nProvider } from '@gaqno-development/frontcore/i18n'
import { FinancePage } from './pages/FinancePage'

initI18n()

export default function App() {
  return (
    <I18nProvider>
      <QueryProvider>
        <AuthProvider>
          <TenantProvider>
            <FinancePage />
          </TenantProvider>
        </AuthProvider>
      </QueryProvider>
    </I18nProvider>
  )
}
