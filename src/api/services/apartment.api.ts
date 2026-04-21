import apiClient from '../client';

export interface ApartmentData {
  name: string;
  description: string;
  is_default?: boolean;
}

export const apartmentApi = {
  getApartments: async () => {
    const response = await apiClient.get('/api/apartments');
    return response.data;
  },
  createApartment: async (data: ApartmentData) => {
    const response = await apiClient.post('/api/apartments', data);
    return response.data;
  },
  updateApartment: async (id: number, data: ApartmentData) => {
    const response = await apiClient.put(`/api/apartments/${id}`, data);
    return response.data;
  },
  deleteApartment: async (id: number) => {
    const response = await apiClient.delete(`/api/apartments/${id}`);
    return response.data;
  },
};
