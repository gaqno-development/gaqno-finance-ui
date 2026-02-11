import type {
  TransactionStatus as TStatus,
  TransactionType as TType,
  RecurrenceType as TRecurrence,
} from "@gaqno-development/types/finance";

export const TransactionStatus = {
  PAGO: "pago",
  A_PAGAR: "a_pagar",
  EM_ATRASO: "em_atraso",
} as const satisfies Record<string, TStatus>;
export type TransactionStatus = TStatus;

export const TransactionType = {
  INCOME: "income",
  EXPENSE: "expense",
} as const satisfies Record<string, TType>;
export type TransactionType = TType;

export const RecurrenceType = {
  NONE: "none",
  FIFTH_BUSINESS_DAY: "fifth_business_day",
  DAY_15: "day_15",
  LAST_DAY: "last_day",
  CUSTOM: "custom",
} as const satisfies Record<string, TRecurrence>;
export type RecurrenceType = TRecurrence;

export interface ICreditCard {
  id: string;
  tenant_id: string;
  user_id: string;
  name: string;
  last_four_digits: string;
  card_type: string;
  bank_name: string | null;
  credit_limit: number;
  closing_day: number;
  due_day: number;
  color: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface ICategoryIcon {
  name: string;
  emoji: string;
  value: string;
}

export interface ICategoryColor {
  name: string;
  value: string;
}

export interface IFinanceCategory {
  id: string;
  tenant_id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface IFinanceSubcategory {
  id: string;
  tenant_id: string;
  parent_category_id: string;
  name: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface IFinanceTransaction {
  id: string;
  tenant_id: string;
  user_id: string;
  category_id: string | null;
  subcategory_id: string | null;
  credit_card_id: string | null;
  description: string;
  amount: number;
  type: TransactionType;
  transaction_date: string;
  due_date: string | null;
  status: TransactionStatus;
  assigned_to: string | null;
  notes: string | null;
  installment_count: number;
  installment_current: number;
  is_recurring: boolean;
  recurring_type: string | null;
  recurring_day: number | null;
  recurring_months: number | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
  category?: IFinanceCategory | null;
  subcategory?: IFinanceSubcategory | null;
  creditCard?: ICreditCard | null;
}

export interface IFinanceSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  invested: number;
  availableBalance: number;
}

export interface ICategoryExpense {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface ICreateTransactionInput {
  description: string;
  amount: number;
  type: TransactionType;
  transaction_date: string;
  due_date?: string | null;
  credit_card_id?: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;
  status?: TransactionStatus;
  notes?: string | null;
  installment_count?: number;
  installment_current?: number;
  is_recurring?: boolean;
  recurring_type?: string | null;
  recurring_day?: number | null;
  recurring_months?: number | null;
  icon?: string | null;
}

export interface IUpdateTransactionInput extends Partial<ICreateTransactionInput> {
  id: string;
  category_id?: string | null;
}

export interface ICreateCategoryInput {
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
}

export interface IUpdateCategoryInput extends Partial<ICreateCategoryInput> {
  id: string;
}

export interface ICreateSubcategoryInput {
  parent_category_id: string;
  name: string;
  icon?: string;
}

export interface IUpdateSubcategoryInput extends Partial<ICreateSubcategoryInput> {
  id: string;
}

export interface ICreateCreditCardInput {
  name: string;
  last_four_digits: string;
  card_type: string;
  bank_name?: string;
  credit_limit: number;
  closing_day: number;
  due_day: number;
  color?: string;
  icon?: string;
}

export interface IUpdateCreditCardInput extends Partial<ICreateCreditCardInput> {
  id: string;
}

export interface ICreditCardSummary {
  monthlyValue: number;
  remainingLimit: number;
  totalLimit: number;
}
