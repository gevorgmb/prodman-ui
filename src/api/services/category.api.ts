import apiClient from '../client';

export interface Category {
  id: number;
  apartmentId: number;
  name: string;
}

export interface StoreCategoryRequest {
  name: string;
}

export const categoryApi = {
  getCategories: async () => {
    const response = await apiClient.get('/api/categories');
    return response.data;
  },
  getCategory: async (id: number) => {
    const response = await apiClient.get(`/api/categories/${id}`);
    return response.data;
  },
  createCategory: async (data: StoreCategoryRequest) => {
    const response = await apiClient.post('/api/categories', data);
    return response.data;
  },
  updateCategory: async (id: number, data: StoreCategoryRequest) => {
    const response = await apiClient.patch(`/api/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: number) => {
    const response = await apiClient.delete(`/api/categories/${id}`);
    return response.data;
  },
};
