import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@gaqno-development/frontcore/components/ui'
import { Button } from '@gaqno-development/frontcore/components/ui'
import { Plus, Edit2, Trash2, Tags, CreditCard } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@gaqno-development/frontcore/components/ui'
import { Badge } from '@gaqno-development/frontcore/components/ui'
import { useCategories } from '@/hooks/finance'
import type { IFinanceCategory } from '@gaqno-development/types/finance'
import { CategoryManagementDialog } from '@/components/CategoryManagementDialog'
import { CreditCardOverview } from '@/components/CreditCardOverview'
import { LoadingSkeleton } from '@gaqno-development/frontcore/components/ui'

export function SettingsView() {
  const { categories, isLoading, deleteCategory, isDeleting } = useCategories()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<IFinanceCategory | null>(null)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)

  const incomeCategories = categories.filter((c) => c.type === 'income')
  const expenseCategories = categories.filter((c) => c.type === 'expense')

  const handleEdit = (category: IFinanceCategory) => {
    setEditingCategory(category)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteCategoryId) return
    await deleteCategory(deleteCategoryId)
    setDeleteCategoryId(null)
  }

  const renderCategoryList = (list: IFinanceCategory[], emptyMessage: string) => {
    if (list.length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center py-6">{emptyMessage}</p>
      )
    }

    return (
      <div className="space-y-2">
        {list.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div
              className="w-8 h-8 rounded-md shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <span className="flex-1 font-medium text-sm">{category.name}</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(category)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteCategoryId(category.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="card" count={3} />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tags className="h-5 w-5" />
              <div>
                <CardTitle>Categorias</CardTitle>
                <CardDescription>Gerencie as categorias de receitas e despesas</CardDescription>
              </div>
            </div>
            <Button onClick={handleCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-green-600 border-green-600">Receitas</Badge>
              <span className="text-xs text-muted-foreground">{incomeCategories.length} categorias</span>
            </div>
            {renderCategoryList(incomeCategories, 'Nenhuma categoria de receita cadastrada')}
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-red-600 border-red-600">Despesas</Badge>
              <span className="text-xs text-muted-foreground">{expenseCategories.length} categorias</span>
            </div>
            {renderCategoryList(expenseCategories, 'Nenhuma categoria de despesa cadastrada')}
          </div>
        </CardContent>
      </Card>

      <CreditCardOverview />

      <CategoryManagementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />

      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Transações vinculadas ficarão sem categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
