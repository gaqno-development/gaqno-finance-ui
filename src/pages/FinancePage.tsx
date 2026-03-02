import React from 'react'
import { PageLayout } from '@gaqno-development/frontcore/components/layout'
import { useTranslation } from '@gaqno-development/frontcore/i18n'
import { useModuleView } from '@gaqno-development/frontcore/hooks'
import { Home, ArrowLeftRight, Wallet, FileText, TrendingUp, Settings } from 'lucide-react'
import { DashboardView } from './DashboardView'
import { TransactionsView } from './TransactionsView'
import { AccountsView } from './AccountsView'
import { ReportsView } from './ReportsView'
import { InvestmentsView } from './InvestmentsView'
import { SettingsView } from './SettingsView'

const TAB_KEYS = [
  { id: 'dashboard', icon: <Home className="h-4 w-4" />, tKey: 'finance.dashboard' },
  { id: 'transactions', icon: <ArrowLeftRight className="h-4 w-4" />, tKey: 'finance.transactions' },
  { id: 'accounts', icon: <Wallet className="h-4 w-4" />, tKey: 'finance.accounts' },
  { id: 'reports', icon: <FileText className="h-4 w-4" />, tKey: 'finance.reports' },
  { id: 'investments', icon: <TrendingUp className="h-4 w-4" />, tKey: 'finance.investments' },
  { id: 'settings', icon: <Settings className="h-4 w-4" />, tKey: 'finance.settings' },
] as const

const VIEW_MAP: Record<string, React.ComponentType> = {
  dashboard: DashboardView,
  transactions: TransactionsView,
  accounts: AccountsView,
  reports: ReportsView,
  investments: InvestmentsView,
  settings: SettingsView,
}

export function FinancePage() {
  const { t } = useTranslation('navigation')
  const { currentView, setView } = useModuleView({
    defaultView: 'dashboard',
    allowedViews: TAB_KEYS.map((tab) => tab.id),
  })

  const tabs = TAB_KEYS.map((tab) => ({
    id: tab.id,
    label: t(tab.tKey),
    icon: tab.icon,
  }))

  const ViewComponent = VIEW_MAP[currentView] || DashboardView

  return (
    <PageLayout
      title={t('finance.title')}
      tabs={tabs}
      activeTab={currentView}
      onTabChange={setView}
      layoutId="financeActiveTab"
    >
      <ViewComponent />
    </PageLayout>
  )
}
