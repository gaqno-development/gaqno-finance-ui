import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@gaqno-dev/core/hooks/useAuth'
import { UserRole } from '@gaqno-dev/core/types/user'
import { isRootAdmin } from '@gaqno-dev/core/lib/permissions'

export const useAdminGuard = () => {
    const router = useRouter()
    const { profile, loading } = useAuth()

    const isAdmin = profile?.role === UserRole.ADMIN || isRootAdmin(profile)

    useEffect(() => {
        if (!loading && (!profile || !isAdmin)) {
            router.push('/dashboard')
        }
    }, [profile, loading, router, isAdmin])

    return {
        isAdmin,
        loading
    }
}

