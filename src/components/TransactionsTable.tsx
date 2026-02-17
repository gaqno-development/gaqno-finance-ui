import { useState, useMemo } from "react";
import type { ColumnDef } from "@gaqno-development/frontcore/components/ui";
import {
  DataTable,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@gaqno-development/frontcore/components/ui";
import { Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/finance/formatCurrency";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { TransactionIcon } from "./TransactionIcon";
import { IFinanceTransaction } from "@/types/finance/finance";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { RecurringBadge } from "./RecurringBadge";

interface ITransactionsTableProps {
  transactions: IFinanceTransaction[];
  onDelete: (transactionId: string) => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

export function TransactionsTable({
  transactions,
  onDelete,
}: ITransactionsTableProps) {
  const [editingTransaction, setEditingTransaction] =
    useState<IFinanceTransaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (transaction: IFinanceTransaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  const columns = useMemo<ColumnDef<IFinanceTransaction, unknown>[]>(
    () => [
      {
        id: "date",
        header: "Data",
        cell: ({ row }) => formatDate(row.original.transaction_date),
      },
      {
        id: "description",
        header: "Descrição",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 font-medium">
            <TransactionIcon transaction={row.original} size="sm" />
            <span>{row.original.description}</span>
          </div>
        ),
      },
      {
        id: "category",
        header: "Categoria",
        cell: ({ row }) =>
          row.original.subcategory?.name ||
          row.original.category?.name ||
          "Sem categoria",
      },
      {
        id: "type",
        header: "Tipo",
        cell: ({ row }) => {
          const t = row.original;
          return (
            <div className="flex flex-col gap-1">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium w-fit ${
                  t.type === "income"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {t.type === "income" ? "Receita" : "Despesa"}
              </span>
              {t.status && <TransactionStatusBadge status={t.status} />}
              <RecurringBadge transaction={t} className="text-xs w-fit" />
            </div>
          );
        },
      },
      {
        id: "amount",
        header: "Valor",
        meta: { align: "right" as const },
        cell: ({ row }) => {
          const t = row.original;
          return (
            <span
              className={`font-semibold ${
                t.type === "income" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {t.type === "income" ? "+" : "-"}
              {formatCurrency(Math.abs(t.amount))}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Ações",
        meta: { align: "right" as const },
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onDelete]
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transações</CardTitle>
            <Button onClick={() => setIsDialogOpen(true)}>
              Adicionar Transação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable<IFinanceTransaction, unknown>
            columns={columns}
            data={transactions}
            getRowId={(row) => row.id}
            enableSorting={false}
            enableFiltering={false}
            enableVisibility={false}
            showPagination={transactions.length > 10}
            emptyMessage="Nenhuma transação registrada"
          />
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        transaction={editingTransaction}
        onClose={handleClose}
      />
    </>
  );
}
