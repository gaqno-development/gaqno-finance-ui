import { useRoleBasedAccess } from '@gaqno-dev/core/hooks/useRoleBasedAccess'
import { UserRole } from '@gaqno-dev/core/types/user'

export const useUserDashboard = () => {
  const { isAuthorized, loading } = useRoleBasedAccess(UserRole.USER)

  return {
    isAuthorized,
    loading,
  }
}

