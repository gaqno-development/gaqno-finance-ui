

import { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@gaqno-development/frontcore/components/ui'
import { DialogFormFooter } from '@gaqno-development/frontcore/components/ui'
import { handleMutationError, handleFormError } from '@gaqno-development/frontcore/utils/error-handler'
import { Input } from '@gaqno-development/frontcore/components/ui'
import { Label } from '@gaqno-development/frontcore/components/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@gaqno-development/frontcore/components/ui'
import { useTransactions } from '../hooks/useTransactions'
import { useCreditCards } from '../hooks/useCreditCards'
import { useCategories } from '../hooks/useCategories'
import { useSubcategories } from '../hooks/useSubcategories'
import { CategorySelectorDialog } from './CategorySelectorDialog'
import { CategoryBadge } from './CategoryBadge'
import { getTransactionIcon } from './TransactionIconPicker'
import { IFinanceTransaction, TransactionType, TransactionStatus } from '../types/finance'
import { Button } from '@gaqno-development/frontcore/components/ui'
import { X } from 'lucide-react'
import { CurrencyInput } from './CurrencyInput'
import { cn } from '@gaqno-development/frontcore/lib/utils'

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero').refine((val) => val > 0, {
    message: 'Valor deve ser maior que zero',
  }),
  type: z.enum(['income', 'expense']),
  transaction_date: z.string().min(1, 'Data é obrigatória'),
  due_date: z.string().optional().nullable(),
  credit_card_id: z.string().optional().nullable(),
  status: z.enum([TransactionStatus.PAGO, TransactionStatus.A_PAGAR, TransactionStatus.EM_ATRASO]).optional(),
  notes: z.string().optional().nullable(),
  installment_count: z.preprocess(
    (val) => (typeof val === 'number' && isNaN(val) ? 1 : val),
    z.number().min(1).optional()
  ),
  installment_current: z.preprocess(
    (val) => (typeof val === 'number' && isNaN(val) ? 1 : val),
    z.number().min(1).optional()
  ),
  is_recurring: z.boolean().optional(),
  recurring_type: z.string().optional().nullable(),
  recurring_day: z.preprocess(
    (val) => (typeof val === 'number' && isNaN(val) ? null : val),
    z.number().min(1).max(31).nullable().optional()
  ),
  recurring_months: z.preprocess(
    (val) => (typeof val === 'number' && isNaN(val) ? null : val),
    z.number().min(1).nullable().optional()
  ),
  category_id: z.string().optional().nullable(),
  subcategory_id: z.string().optional().nullable(),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

interface IAddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: IFinanceTransaction | null
  defaultType?: TransactionType
  onClose?: () => void
}

export function AddTransactionDialog({
  open,
  onOpenChange,
  transaction,
  defaultType = 'expense',
  onClose,
}: IAddTransactionDialogProps) {
  const { createTransaction, updateTransaction } = useTransactions()
  const { creditCards } = useCreditCards()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue,
    watch,
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    mode: 'onChange',
    defaultValues: {
      description: '',
      amount: 0,
      type: 'expense',
      transaction_date: new Date().toISOString().split('T')[0],
      due_date: null,
      credit_card_id: null,
      status: TransactionStatus.A_PAGAR,
      notes: null,
      installment_count: 1,
      installment_current: 1,
      is_recurring: false,
      recurring_type: null,
      recurring_day: null,
      recurring_months: null,
      category_id: null,
      subcategory_id: null,
    },
  })

  const selectedType = watch('type')
  const selectedCategoryId = watch('category_id') ?? null
  const selectedSubcategoryId = watch('subcategory_id') ?? null
  const isExpense = selectedType === 'expense'
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  
  const { categories: allCategories } = useCategories()
  const filteredCategories = useMemo(
    () => allCategories?.filter(cat => cat.type === selectedType) || [],
    [allCategories, selectedType]
  )
  const selectedCategory = useMemo(
    () => filteredCategories.find(cat => cat.id === selectedCategoryId),
    [filteredCategories, selectedCategoryId]
  )
  
  const { subcategories } = useSubcategories(selectedCategoryId)
  const selectedSubcategory = useMemo(
    () => subcategories.find(sub => sub.id === selectedSubcategoryId),
    [subcategories, selectedSubcategoryId]
  )

  useEffect(() => {
    if (transaction) {
      reset({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        transaction_date: transaction.transaction_date,
        due_date: transaction.due_date || null,
        credit_card_id: transaction.credit_card_id || null,
        status: transaction.status || TransactionStatus.A_PAGAR,
        notes: transaction.notes || null,
        installment_count: transaction.installment_count || 1,
        installment_current: transaction.installment_current || 1,
        is_recurring: transaction.is_recurring || false,
        recurring_type: transaction.recurring_type || null,
        recurring_day: transaction.recurring_day || null,
        recurring_months: transaction.recurring_months || null,
        category_id: transaction.category_id || null,
        subcategory_id: transaction.subcategory_id || null,
      })
    } else {
      reset({
        description: '',
        amount: 0,
        type: defaultType,
        transaction_date: new Date().toISOString().split('T')[0],
        due_date: null,
        credit_card_id: null,
        status: TransactionStatus.A_PAGAR,
        notes: null,
        installment_count: 1,
        installment_current: 1,
        is_recurring: false,
        recurring_type: null,
        recurring_day: null,
        recurring_months: null,
        category_id: null,
        subcategory_id: null,
      })
    }
  }, [transaction, defaultType, reset, open])

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      // Limpa campos de recorrência se is_recurring é false
      const submitData = {
        ...data,
        is_recurring: data.is_recurring || false,
        recurring_type: data.is_recurring ? (data.recurring_type || null) : null,
        recurring_day: data.is_recurring ? data.recurring_day : null,
        recurring_months: data.is_recurring ? data.recurring_months : null,
      }

      let result
      if (transaction) {
        result = await updateTransaction({
          id: transaction.id,
          ...submitData,
        })
      } else {
        result = await createTransaction(submitData)
      }

      if (!result.success) {
        handleMutationError(result.error, 'transação')
        return
      }

      onClose?.()
      onOpenChange(false)
    } catch (error) {
      handleMutationError(error, 'transação')
    }
  }

  const onError = (errors: any) => {
    handleFormError(errors)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </DialogTitle>
          <DialogDescription>
            {transaction ? 'Edite os dados da transação' : 'Preencha os dados para criar uma nova transação'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-3">
          {/* Primeira linha: Tipo, Descrição e Categoria */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-3 space-y-1.5">
              <Label htmlFor="type" className="text-xs">
                Tipo <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  selectedType === 'expense' ? "text-foreground" : "text-muted-foreground"
                )}>
                  Despesa
                </span>
                <Switch
                  id="type"
                  checked={selectedType === 'income'}
                  onCheckedChange={(checked) => {
                    setValue('type', checked ? 'income' : 'expense', { shouldValidate: true })
                  }}
                />
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  selectedType === 'income' ? "text-foreground" : "text-muted-foreground"
                )}>
                  Receita
                </span>
              </div>
              {errors.type && (
                <p className="text-xs text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="col-span-5 space-y-1.5">
              <Label htmlFor="description" className="text-xs">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                {...register('description')}
                placeholder="Ex: Salário, Alimentação..."
                className="h-9"
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="col-span-4 space-y-1.5">
              <Label className="text-xs">Categoria</Label>
              {selectedCategory ? (
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20 h-9">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: selectedCategory.color }}
                  >
                    {selectedCategory.icon ? (
                      (() => {
                        const IconComponent = getTransactionIcon(selectedCategory.icon)
                        return IconComponent ? <IconComponent className="w-3 h-3" /> : null
                      })()
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CategoryBadge 
                      category={selectedCategory} 
                      subcategory={selectedSubcategory}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      setValue('category_id', null)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-9 text-xs"
                  onClick={() => setIsCategoryDialogOpen(true)}
                >
                  Selecionar
                </Button>
              )}
            </div>
          </div>

          <CategorySelectorDialog
            open={isCategoryDialogOpen}
            onOpenChange={setIsCategoryDialogOpen}
            categories={filteredCategories}
            selectedCategoryId={selectedCategoryId}
            selectedSubcategoryId={selectedSubcategoryId}
            onSelect={(categoryId, subcategoryId) => {
              setValue('category_id', categoryId)
              setValue('subcategory_id', subcategoryId || null)
            }}
            transactionType={selectedType}
          />

          {/* Segunda linha: Valor e Datas */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-4 space-y-1.5">
              <Label htmlFor="amount" className="text-xs">
                Valor <span className="text-red-500">*</span>
              </Label>
              <CurrencyInput
                id="amount"
                value={watch('amount')}
              onChange={(value: number | null) => {
                setValue('amount', value || 0, { shouldValidate: true })
              }}
                className="h-9"
              />
              {errors.amount && (
                <p className="text-xs text-red-500">{errors.amount.message}</p>
              )}
            </div>

            <div className="col-span-4 space-y-1.5">
              <Label htmlFor="transaction_date" className="text-xs">
                Data da Transação <span className="text-red-500">*</span>
              </Label>
              <Input
                id="transaction_date"
                type="date"
                {...register('transaction_date')}
                className="h-9"
              />
              {errors.transaction_date && (
                <p className="text-xs text-red-500">{errors.transaction_date.message}</p>
              )}
            </div>

            {isExpense && (
              <div className="col-span-4 space-y-1.5">
                <Label htmlFor="due_date" className="text-xs">Data de Vencimento</Label>
                <Input
                  id="due_date"
                  type="date"
                  {...register('due_date')}
                  className="h-9"
                />
              </div>
            )}
          </div>

          {isExpense && (
            <>
              {/* Terceira linha: Cartão de Crédito, Status e Parcelas */}
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4 space-y-1.5">
                  <Label htmlFor="credit_card_id" className="text-xs">Cartão de Crédito</Label>
                  <Select
                    value={watch('credit_card_id') || 'none'}
                    onValueChange={(value: string) => setValue('credit_card_id', value === 'none' ? null : value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Selecione um cartão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem cartão</SelectItem>
                      {creditCards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name} - Final {card.last_four_digits}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-4 space-y-1.5">
                  <Label htmlFor="status" className="text-xs">Status</Label>
                  <Select
                    value={watch('status') || TransactionStatus.A_PAGAR}
                    onValueChange={(value) => setValue('status', value as TransactionStatus)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TransactionStatus.A_PAGAR}>A pagar</SelectItem>
                      <SelectItem value={TransactionStatus.PAGO}>Pago</SelectItem>
                      <SelectItem value={TransactionStatus.EM_ATRASO}>Em atraso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="installment_count" className="text-xs">Parcelas</Label>
                  <Input
                    id="installment_count"
                    type="number"
                    min="1"
                    {...register('installment_count', { valueAsNumber: true })}
                    className="h-9"
                    placeholder="Total"
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="installment_current" className="text-xs">Parcela Atual</Label>
                  <Input
                    id="installment_current"
                    type="number"
                    min="1"
                    {...register('installment_current', { valueAsNumber: true })}
                    className="h-9"
                    placeholder="Atual"
                  />
                </div>
              </div>
            </>
          )}

          {/* Quarta linha: Anotações e Recorrência */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-6 space-y-1.5">
              <Label htmlFor="notes" className="text-xs">Anotações</Label>
              <Input
                id="notes"
                {...register('notes')}
                placeholder="Observações..."
                className="h-9"
              />
            </div>

            <div className="col-span-6 space-y-1.5">
              <Label className="text-xs">Transação Recorrente</Label>
              <div className="flex items-center gap-2 h-9">
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  !watch('is_recurring') ? "text-foreground" : "text-muted-foreground"
                )}>
                  OFF
                </span>
                <Switch
                  id="is_recurring"
                  checked={watch('is_recurring') || false}
                  onCheckedChange={(checked) => {
                    setValue('is_recurring', checked)
                    if (!checked) {
                      setValue('recurring_type', null)
                      setValue('recurring_day', null)
                      setValue('recurring_months', null)
                    } else {
                      // Define um valor padrão quando ativa
                      if (!watch('recurring_type')) {
                        setValue('recurring_type', 'day_15')
                      }
                    }
                  }}
                />
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  watch('is_recurring') ? "text-foreground" : "text-muted-foreground"
                )}>
                  ON
                </span>
              </div>
            </div>
          </div>

          {watch('is_recurring') && (
            <div className="grid grid-cols-12 gap-3 p-3 border rounded-md bg-muted/20">
              <div className="col-span-4 space-y-1.5">
                <Label htmlFor="recurring_type" className="text-xs">Tipo de recorrência</Label>
                <Select
                  value={watch('recurring_type') || 'none'}
                  onValueChange={(value) => {
                    setValue('recurring_type', value === 'none' ? null : value)
                    if (value === 'day_15') {
                      setValue('recurring_day', 15)
                    } else if (value === 'last_day') {
                      setValue('recurring_day', 31)
                    } else if (value === 'fifth_business_day') {
                      setValue('recurring_day', 5)
                    } else if (value !== 'custom') {
                      setValue('recurring_day', null)
                    }
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fifth_business_day">Quinto dia útil</SelectItem>
                    <SelectItem value="day_15">Dia 15</SelectItem>
                    <SelectItem value="last_day">Final do mês</SelectItem>
                    <SelectItem value="custom">Dia personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {watch('recurring_type') === 'custom' && (
                <div className="col-span-3 space-y-1.5">
                  <Label htmlFor="recurring_day" className="text-xs">Dia do mês</Label>
                  <Input
                    id="recurring_day"
                    type="number"
                    min="1"
                    max="31"
                    {...register('recurring_day', { valueAsNumber: true })}
                    placeholder="Ex: 5"
                    className="h-9"
                  />
                </div>
              )}

              <div className={cn("space-y-1.5", watch('recurring_type') === 'custom' ? 'col-span-5' : 'col-span-8')}>
                <Label htmlFor="recurring_months" className="text-xs">Por quantos meses?</Label>
                <Input
                  id="recurring_months"
                  type="number"
                  min="1"
                  {...register('recurring_months', { valueAsNumber: true })}
                  placeholder="Vazio = infinito"
                  className="h-9"
                />
              </div>
            </div>
          )}

          <DialogFormFooter
            onCancel={() => {
              onClose?.()
              onOpenChange(false)
            }}
            isSubmitting={isSubmitting}
            isEdit={!!transaction}
            isValid={isValid}
            submitLabel={transaction ? 'Atualizar' : 'Criar'}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}

