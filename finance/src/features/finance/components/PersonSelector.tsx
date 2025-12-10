'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gaqno-dev/ui/components/ui'
import { useAuth } from '@gaqno-dev/core/contexts/AuthContext'
import { useSupabaseQuery } from '@gaqno-dev/core/hooks/useSupabaseQuery'
import { useSupabaseClient } from '@gaqno-dev/core/hooks/useSupabaseClient'
import { useTenant } from '@gaqno-dev/core/contexts/TenantContext'

interface IPersonSelectorProps {
  value?: string | null
  onValueChange: (value: string | null) => void
  placeholder?: string
}

export function PersonSelector({
  value,
  onValueChange,
  placeholder = 'Selecione uma pessoa',
}: IPersonSelectorProps) {
  const supabase = useSupabaseClient()
  const { tenantId } = useTenant()
  const { profile } = useAuth()

  const { data: profiles } = useSupabaseQuery<any[]>(
    ['tenant-profiles', tenantId ?? 'no-tenant'],
    async () => {
      if (!tenantId) return []

      let query = supabase.from('profiles').select('id, name, avatar_url').eq('tenant_id', tenantId)

      const { data, error } = await query
      if (error) throw error
      return data || []
    },
    {
      enabled: !!tenantId,
    }
  )

  return (
    <Select value={value || 'none'} onValueChange={(val) => onValueChange(val === 'none' ? null : val)}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Ninguém</SelectItem>
        {profiles?.map((person) => (
          <SelectItem key={person.id} value={person.id}>
            {person.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

