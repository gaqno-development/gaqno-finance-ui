import { useSupabaseQuery } from '@gaqno-dev/core/hooks/useSupabaseQuery'
import { api } from '@gaqno-dev/core/lib/api'
import { IUserProfile } from '@gaqno-dev/core/types/user'

export const useUsers = () => {
  return useSupabaseQuery<IUserProfile[]>(
    ['users'],
    () => api.users.getAll()
  )
}

