'use client'

import React from 'react'
import { DashboardLayout } from '@gaqno-dev/ui/components'
import { AppProvider } from '@gaqno-dev/ui/components/providers'
import { WhiteLabelProvider } from '@gaqno-dev/ui/components/providers'
import { ToastContainer } from '@gaqno-dev/ui/components/ui'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <WhiteLabelProvider>
        <DashboardLayout>{children}</DashboardLayout>
        <ToastContainer />
      </WhiteLabelProvider>
    </AppProvider>
  )
}

