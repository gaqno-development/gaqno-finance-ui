import { useAuth } from '@gaqno-dev/core/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ROLE_ROUTES } from '@gaqno-dev/core/lib/constants'

export const useDashboard = () => {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && profile) {
      const roleRoute = ROLE_ROUTES[profile.role]
      if (roleRoute && window.location.pathname === '/dashboard') {
        router.push(roleRoute)
      }
    }
  }, [profile, loading, router])

  return {
    profile,
    loading,
  }
}

