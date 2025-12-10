import { useRoleBasedAccess } from '@gaqno-dev/core/hooks/useRoleBasedAccess'
import { UserRole } from '@gaqno-dev/core/types/user'

export const useAdminDashboard = () => {
  const { isAuthorized, loading } = useRoleBasedAccess(UserRole.ADMIN)

  return {
    isAuthorized,
    loading,
  }
}

