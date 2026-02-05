import { financeClient } from "@gaqno-development/frontcore/utils/api";
import {
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

export const api = {
  transactions: {
    getAll: async (
      startDate?: string,
      endDate?: string
    ): Promise<IFinanceTransaction[]> => {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await financeClient.get<IFinanceTransaction[]>(
        "/transactions",
        { params }
      );
      return response.data;
    },

    getById: async (id: string): Promise<IFinanceTransaction> => {
      const response = await financeClient.get<IFinanceTransaction>(
        `/transactions/${id}`
      );
      return response.data;
    },

    create: async (
      data: ICreateTransactionInput
    ): Promise<IFinanceTransaction> => {
      const response = await financeClient.post<IFinanceTransaction>(
        "/transactions",
        data
      );
      return response.data;
    },

    update: async (
      id: string,
      data: IUpdateTransactionInput
    ): Promise<IFinanceTransaction> => {
      const response = await financeClient.patch<IFinanceTransaction>(
        `/transactions/${id}`,
        data
      );
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await financeClient.delete(`/transactions/${id}`);
    },
  },

  categories: {
    getAll: async (type?: TransactionType): Promise<IFinanceCategory[]> => {
      const params = type ? { type } : {};
      const response = await financeClient.get<IFinanceCategory[]>(
        "/categories",
        { params }
      );
      return response.data;
    },

    getById: async (id: string): Promise<IFinanceCategory> => {
      const response = await financeClient.get<IFinanceCategory>(
        `/categories/${id}`
      );
      return response.data;
    },

    create: async (data: ICreateCategoryInput): Promise<IFinanceCategory> => {
      const response = await financeClient.post<IFinanceCategory>(
        "/categories",
        data
      );
      return response.data;
    },

    update: async (
      id: string,
      data: IUpdateCategoryInput
    ): Promise<IFinanceCategory> => {
      const response = await financeClient.patch<IFinanceCategory>(
        `/categories/${id}`,
        data
      );
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await financeClient.delete(`/categories/${id}`);
    },
  },

  subcategories: {
    getAll: async (
      parentCategoryId: string
    ): Promise<IFinanceSubcategory[]> => {
      const response = await financeClient.get<IFinanceSubcategory[]>(
        "/subcategories",
        {
          params: { parentCategoryId },
        }
      );
      return response.data;
    },

    getById: async (id: string): Promise<IFinanceSubcategory> => {
      const response = await financeClient.get<IFinanceSubcategory>(
        `/subcategories/${id}`
      );
      return response.data;
    },

    create: async (
      data: ICreateSubcategoryInput
    ): Promise<IFinanceSubcategory> => {
      const response = await financeClient.post<IFinanceSubcategory>(
        "/subcategories",
        data
      );
      return response.data;
    },

    update: async (
      id: string,
      data: IUpdateSubcategoryInput
    ): Promise<IFinanceSubcategory> => {
      const response = await financeClient.patch<IFinanceSubcategory>(
        `/subcategories/${id}`,
        data
      );
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await financeClient.delete(`/subcategories/${id}`);
    },
  },

  creditCards: {
    getAll: async (): Promise<ICreditCard[]> => {
      const response = await financeClient.get<ICreditCard[]>("/credit-cards");
      return response.data;
    },

    getById: async (id: string): Promise<ICreditCard> => {
      const response = await financeClient.get<ICreditCard>(
        `/credit-cards/${id}`
      );
      return response.data;
    },

    create: async (data: ICreateCreditCardInput): Promise<ICreditCard> => {
      const response = await financeClient.post<ICreditCard>(
        "/credit-cards",
        data
      );
      return response.data;
    },

    update: async (
      id: string,
      data: IUpdateCreditCardInput
    ): Promise<ICreditCard> => {
      const response = await financeClient.patch<ICreditCard>(
        `/credit-cards/${id}`,
        data
      );
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await financeClient.delete(`/credit-cards/${id}`);
    },
  },
};
