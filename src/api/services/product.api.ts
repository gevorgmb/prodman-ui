import apiClient from '../client';

export interface Product {
  id: number;
  apartmentId: number;
  name: string;
  importance: number;
  categoryId: number | null;
  departmentId: number | null;
  description: string | null;
}

export interface StoreProductRequest {
  name: string;
  importance: number;
  categoryId?: number | null;
  departmentId?: number | null;
  description?: string | null;
}

export const productApi = {
  getProducts: async () => {
    const response = await apiClient.get('/api/products');
    return response.data;
  },
  getProduct: async (id: number) => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  },
  createProduct: async (data: StoreProductRequest) => {
    const response = await apiClient.post('/api/products', data);
    return response.data;
  },
  updateProduct: async (id: number, data: StoreProductRequest) => {
    const response = await apiClient.patch(`/api/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id: number) => {
    const response = await apiClient.delete(`/api/products/${id}`);
    return response.data;
  },
};
