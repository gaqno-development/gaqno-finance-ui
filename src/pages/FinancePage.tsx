import React from 'react'
import { ModuleTabs, IModuleTabConfig } from '@gaqno-development/frontcore/components/ui'
import { useModuleView } from '@gaqno-development/frontcore/hooks'
import { Home, ArrowLeftRight, Wallet, FileText, TrendingUp, Settings } from 'lucide-react'
import { DashboardView } from './DashboardView'
import { TransactionsView } from './TransactionsView'
import { AccountsView } from './AccountsView'
import { ReportsView } from './ReportsView'
import { InvestmentsView } from './InvestmentsView'
import { SettingsView } from './SettingsView'

const FINANCE_TABS: IModuleTabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'accounts', label: 'Accounts', icon: Wallet },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function FinancePage() {
  const { currentView } = useModuleView({
    defaultView: 'dashboard',
    allowedViews: FINANCE_TABS.map((tab) => tab.id),
  })

  const renderView = () => {
    const viewMap: Record<string, React.ComponentType> = {
      dashboard: DashboardView,
      transactions: TransactionsView,
      accounts: AccountsView,
      reports: ReportsView,
      investments: InvestmentsView,
      settings: SettingsView,
    }

    const ViewComponent = viewMap[currentView] || DashboardView
    return <ViewComponent />
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold mb-4">Finance</h1>
          <ModuleTabs tabs={FINANCE_TABS} defaultView="dashboard" />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        {renderView()}
      </div>
    </div>
  )
}
