import { financeClient } from "@gaqno-development/frontcore/utils/api";
import type {
  IFinanceTransaction,
  IFinanceCategory,
  IFinanceSubcategory,
  ICreditCard,
  ICreateTransactionInput,
  IUpdateTransactionInput,
  ICreateCategoryInput,
  IUpdateCategoryInput,
  ICreateSubcategoryInput,
  IUpdateSubcategoryInput,
  ICreateCreditCardInput,
  IUpdateCreditCardInput,
  TransactionType,
} from "@/types/finance/finance";

export const financeApi = {
  transactions: {
    getAll: async (
      startDate?: string,
      endDate?: string
    ): Promise<IFinanceTransaction[]> => {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const { data } = await financeClient.get<IFinanceTransaction[]>(
        "/transactions",
        { params }
      );
      return data;
    },
    getById: async (id: string): Promise<IFinanceTransaction> => {
      const { data } = await financeClient.get<IFinanceTransaction>(
        `/transactions/${id}`
      );
      return data;
    },
    create: async (
      payload: ICreateTransactionInput
    ): Promise<IFinanceTransaction> => {
      const { data } = await financeClient.post<IFinanceTransaction>(
        "/transactions",
        payload
      );
      return data;
    },
    update: async (
      id: string,
      payload: IUpdateTransactionInput
    ): Promise<IFinanceTransaction> => {
      const { data } = await financeClient.patch<IFinanceTransaction>(
        `/transactions/${id}`,
        payload
      );
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await financeClient.delete(`/transactions/${id}`);
    },
  },
  categories: {
    getAll: async (type?: TransactionType): Promise<IFinanceCategory[]> => {
      const params = type ? { type } : {};
      const { data } = await financeClient.get<IFinanceCategory[]>(
        "/categories",
        { params }
      );
      return data;
    },
    getById: async (id: string): Promise<IFinanceCategory> => {
      const { data } = await financeClient.get<IFinanceCategory>(
        `/categories/${id}`
      );
      return data;
    },
    create: async (
      payload: ICreateCategoryInput
    ): Promise<IFinanceCategory> => {
      const { data } = await financeClient.post<IFinanceCategory>(
        "/categories",
        payload
      );
      return data;
    },
    update: async (
      id: string,
      payload: IUpdateCategoryInput
    ): Promise<IFinanceCategory> => {
      const { data } = await financeClient.patch<IFinanceCategory>(
        `/categories/${id}`,
        payload
      );
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await financeClient.delete(`/categories/${id}`);
    },
  },
  subcategories: {
    getAll: async (
      parentCategoryId: string
    ): Promise<IFinanceSubcategory[]> => {
      const { data } = await financeClient.get<IFinanceSubcategory[]>(
        "/subcategories",
        {
          params: { parentCategoryId },
        }
      );
      return data;
    },
    getById: async (id: string): Promise<IFinanceSubcategory> => {
      const { data } = await financeClient.get<IFinanceSubcategory>(
        `/subcategories/${id}`
      );
      return data;
    },
    create: async (
      payload: ICreateSubcategoryInput
    ): Promise<IFinanceSubcategory> => {
      const { data } = await financeClient.post<IFinanceSubcategory>(
        "/subcategories",
        payload
      );
      return data;
    },
    update: async (
      id: string,
      payload: IUpdateSubcategoryInput
    ): Promise<IFinanceSubcategory> => {
      const { data } = await financeClient.patch<IFinanceSubcategory>(
        `/subcategories/${id}`,
        payload
      );
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await financeClient.delete(`/subcategories/${id}`);
    },
  },
  creditCards: {
    getAll: async (): Promise<ICreditCard[]> => {
      const { data } = await financeClient.get<ICreditCard[]>("/credit-cards");
      return data;
    },
    getById: async (id: string): Promise<ICreditCard> => {
      const { data } = await financeClient.get<ICreditCard>(
        `/credit-cards/${id}`
      );
      return data;
    },
    create: async (payload: ICreateCreditCardInput): Promise<ICreditCard> => {
      const { data } = await financeClient.post<ICreditCard>(
        "/credit-cards",
        payload
      );
      return data;
    },
    update: async (
      id: string,
      payload: IUpdateCreditCardInput
    ): Promise<ICreditCard> => {
      const { data } = await financeClient.patch<ICreditCard>(
        `/credit-cards/${id}`,
        payload
      );
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await financeClient.delete(`/credit-cards/${id}`);
    },
  },
};
