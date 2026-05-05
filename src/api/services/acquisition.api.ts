import apiClient from '../client';

export interface AcquisitionItem {
  id: number;
  acquisitionId: number;
  productId: number | null;
  productName: string;
  description: string | null;
  expirationDate: string | null;
  quantity: number;
  price: number;
  total: number;
}

export interface Acquisition {
  id: number;
  apartmentId: number;
  storeName: string;
  description: string | null;
  status: 'draft' | 'complete' | 'cancelled';
  userId: number;
  items?: AcquisitionItem[]; // Added items here if returned by GET /acquisitions/{id}
}

export interface StoreAcquisitionItemRequest {
  productId: number | null;
  productName: string;
  description?: string | null;
  expirationDate?: string | null;
  quantity: number;
  price: number;
}

export interface StoreAcquisitionRequest {
  storeName: string;
  description?: string | null;
  status?: 'draft' | 'complete' | null;
  items: StoreAcquisitionItemRequest[];
}

export interface UpdateAcquisitionItemRequest {
  action: 'create' | 'update' | 'delete' | null;
  itemId?: number | null;
  productId?: number | null;
  productName?: string | null;
  description?: string | null;
  expirationDate?: string | null;
  quantity?: number | null;
  price?: number | null;
}

export interface UpdateAcquisitionRequest {
  storeName?: string;
  description?: string | null;
  status?: 'draft' | 'complete' | 'cancelled' | null;
  items?: UpdateAcquisitionItemRequest[];
}

export interface AcquisitionsResponse {
  acquisitions: Acquisition[];
}

export interface AcquisitionResponse {
  acquisition: Acquisition;
}

export interface AcquisitionItemsResponse {
  items: AcquisitionItem[];
}

export const acquisitionApi = {
  getAcquisitions: async (): Promise<AcquisitionsResponse> => {
    const response = await apiClient.get<AcquisitionsResponse>('/api/acquisitions');
    return response.data;
  },

  getAcquisition: async (id: number): Promise<AcquisitionResponse> => {
    const response = await apiClient.get<AcquisitionResponse>(`/api/acquisitions/${id}`);
    return response.data;
  },

  createAcquisition: async (data: StoreAcquisitionRequest): Promise<AcquisitionResponse> => {
    const response = await apiClient.post<AcquisitionResponse>('/api/acquisitions', data);
    return response.data;
  },

  updateAcquisition: async (id: number, data: UpdateAcquisitionRequest): Promise<AcquisitionResponse> => {
    const response = await apiClient.patch<AcquisitionResponse>(`/api/acquisitions/${id}`, data);
    return response.data;
  },

  deleteAcquisition: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/acquisitions/${id}`);
  },

  // Separate item endpoints if needed (though user said to use acquisitions API for bulk)
  getAcquisitionItems: async (acquisitionId: number): Promise<AcquisitionItemsResponse> => {
    const response = await apiClient.get<AcquisitionItemsResponse>(`/api/acquisitions/${acquisitionId}/items`);
    return response.data;
  },
};
