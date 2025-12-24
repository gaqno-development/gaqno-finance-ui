import axios from 'axios'
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
  TransactionType
} from '../features/finance/types/finance';

const getViteEnv = (key: string, defaultValue: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key] as string;
  }
  return defaultValue;
};

const financeClient = axios.create({
  baseURL: getViteEnv('VITE_FINANCE_SERVICE_URL', 'http://localhost:3005'),
  withCredentials: true
})

export const api = {
  transactions: {
    getAll: async (startDate?: string, endDate?: string): Promise<IFinanceTransaction[]> => {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await financeClient.get('/transactions', { params });
      return response.data;
    },

    getById: async (id: string): Promise<IFinanceTransaction> => {
      const response = await financeClient.get(`/transactions/${id}`);
      return response.data;
    },

    create: async (data: ICreateTransactionInput): Promise<IFinanceTransaction> => {
      const response = await financeClient.post('/transactions', data);
      return response.data;
    },

    update: async (id: string, data: IUpdateTransactionInput): Promise<IFinanceTransaction> => {
      const response = await financeClient.patch(`/transactions/${id}`, data);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await financeClient.delete(`/transactions/${id}`);
    },
  },

  categories: {
    getAll: async (type?: TransactionType): Promise<IFinanceCategory[]> => {
      const params = type ? { type } : {};
      const response = await financeClient.get('/categories', { params });
      return response.data;
    },

    getById: async (id: string): Promise<IFinanceCategory> => {
      const response = await financeClient.get(`/categories/${id}`);
      return response.data;
    },

    create: async (data: ICreateCategoryInput): Promise<IFinanceCategory> => {
      const response = await financeClient.post('/categories', data);
      return response.data;
    },

    update: async (id: string, data: IUpdateCategoryInput): Promise<IFinanceCategory> => {
      const response = await financeClient.patch(`/categories/${id}`, data);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await financeClient.delete(`/categories/${id}`);
    },
  },

  subcategories: {
    getAll: async (parentCategoryId: string): Promise<IFinanceSubcategory[]> => {
      const response = await financeClient.get('/subcategories', {
        params: { parentCategoryId }
      });
      return response.data;
    },

    getById: async (id: string): Promise<IFinanceSubcategory> => {
      const response = await financeClient.get(`/subcategories/${id}`);
      return response.data;
    },

    create: async (data: ICreateSubcategoryInput): Promise<IFinanceSubcategory> => {
      const response = await financeClient.post('/subcategories', data);
      return response.data;
    },

    update: async (id: string, data: IUpdateSubcategoryInput): Promise<IFinanceSubcategory> => {
      const response = await financeClient.patch(`/subcategories/${id}`, data);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await financeClient.delete(`/subcategories/${id}`);
    },
  },

  creditCards: {
    getAll: async (): Promise<ICreditCard[]> => {
      const response = await financeClient.get('/credit-cards');
      return response.data;
    },

    getById: async (id: string): Promise<ICreditCard> => {
      const response = await financeClient.get(`/credit-cards/${id}`);
      return response.data;
    },

    create: async (data: ICreateCreditCardInput): Promise<ICreditCard> => {
      const response = await financeClient.post('/credit-cards', data);
      return response.data;
    },

    update: async (id: string, data: IUpdateCreditCardInput): Promise<ICreditCard> => {
      const response = await financeClient.patch(`/credit-cards/${id}`, data);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await financeClient.delete(`/credit-cards/${id}`);
    },
  },
};

