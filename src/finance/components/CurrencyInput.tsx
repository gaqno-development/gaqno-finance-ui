import { forwardRef, useState, useEffect } from 'react'
import { Input } from '@gaqno-dev/frontcore/components/ui'
import { InputProps } from '@gaqno-dev/frontcore/components/ui'

interface ICurrencyInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  value?: number | string
  onChange?: (value: number | null) => void
}

export const CurrencyInput = forwardRef<HTMLInputElement, ICurrencyInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
      if (!isFocused) {
        if (value === undefined || value === null || value === '' || value === 0) {
          setDisplayValue('')
          return
        }

        const numValue = typeof value === 'string' ? parseFloat(value) : value
        if (isNaN(numValue)) {
          setDisplayValue('')
          return
        }

        // Formata como moeda brasileira (1.234,56)
        const formatted = new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(numValue)

        setDisplayValue(formatted)
      }
    }, [value, isFocused])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value

      // Remove tudo exceto números, vírgula e ponto
      let cleaned = inputValue.replace(/[^\d,.]/g, '')

      // Se está vazio, limpa
      if (cleaned === '') {
        setDisplayValue('')
        onChange?.(null)
        return
      }

      // Remove pontos de milhar (mantém apenas como separador decimal se necessário)
      // Se tem vírgula, remove todos os pontos (vírgula é o separador decimal)
      if (cleaned.includes(',')) {
        cleaned = cleaned.replace(/\./g, '')
        // Garante apenas uma vírgula
        const commaIndex = cleaned.indexOf(',')
        if (commaIndex !== -1) {
          cleaned = cleaned.substring(0, commaIndex + 1) + cleaned.substring(commaIndex + 1).replace(/,/g, '')
        }
      } else if (cleaned.includes('.')) {
        // Se tem ponto, mantém apenas o último como separador decimal
        const parts = cleaned.split('.')
        if (parts.length > 2) {
          // Remove pontos intermediários, mantém apenas o último
          cleaned = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1]
        }
      }

      // Permite digitação livre enquanto está digitando
      setDisplayValue(cleaned)

      // Converte para número para validação
      const normalized = cleaned.replace(',', '.')
      if (normalized === '' || normalized === '.') {
        onChange?.(null)
        return
      }

      const numValue = parseFloat(normalized)
      if (!isNaN(numValue) && numValue >= 0) {
        onChange?.(numValue)
      } else {
        onChange?.(null)
      }
    }

    const handleFocus = () => {
      setIsFocused(true)
      // Quando foca, mostra o valor numérico sem formatação para facilitar edição
      if (value && value !== 0) {
        const numValue = typeof value === 'string' ? parseFloat(value) : value
        if (!isNaN(numValue)) {
          // Mostra sem formatação, usando vírgula como separador decimal
          const str = numValue.toString()
          setDisplayValue(str.replace('.', ','))
        }
      } else {
        setDisplayValue('')
      }
    }

    const handleBlur = () => {
      setIsFocused(false)
      
      const currentValue = displayValue.trim()
      
      if (currentValue === '' || currentValue === '.' || currentValue === ',') {
        setDisplayValue('')
        onChange?.(null)
        return
      }

      // Normaliza o valor antes de formatar
      const normalized = currentValue.replace(/\./g, '').replace(',', '.')
      const numValue = parseFloat(normalized)
      
      if (!isNaN(numValue) && numValue > 0) {
        // Formata o valor final
        const formatted = new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(numValue)
        setDisplayValue(formatted)
        onChange?.(numValue)
      } else {
        setDisplayValue('')
        onChange?.(null)
      }
    }

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
          R$
        </span>
        <Input
          {...props}
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="0,00"
          className={props.className ? `${props.className} pl-10` : 'pl-10'}
        />
      </div>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'

