import { useRoleBasedAccess } from '@gaqno-dev/core/hooks/useRoleBasedAccess'
import { UserRole } from '@gaqno-dev/core/types/user'

export const useManagerDashboard = () => {
  const { isAuthorized, loading } = useRoleBasedAccess(UserRole.MANAGER)

  return {
    isAuthorized,
    loading,
  }
}

