

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gaqno-development/frontcore/components/ui'
import { useQuery } from '@tanstack/react-query'
import { useTenant } from '@gaqno-development/frontcore/contexts'

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
  const { tenantId } = useTenant()

  const { data: profiles } = useQuery<any[]>({
    queryKey: ['tenant-profiles', tenantId ?? 'no-tenant'],
    queryFn: async () => {
      return []
    },
    enabled: !!tenantId,
  })

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

