import { useAuth } from '@gaqno-dev/core/hooks/useAuth'

export const useSettings = () => {
  const { profile, loading } = useAuth()

  return {
    profile,
    loading,
  }
}

