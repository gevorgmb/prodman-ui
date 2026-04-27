import apiClient from '../client';

export interface Department {
  id: number;
  apartmentId: number;
  name: string;
}

export interface StoreDepartmentRequest {
  name: string;
}

export const departmentApi = {
  getDepartments: async () => {
    const response = await apiClient.get('/api/departments');
    return response.data;
  },
  getDepartment: async (id: number) => {
    const response = await apiClient.get(`/api/departments/${id}`);
    return response.data;
  },
  createDepartment: async (data: StoreDepartmentRequest) => {
    const response = await apiClient.post('/api/departments', data);
    return response.data;
  },
  updateDepartment: async (id: number, data: StoreDepartmentRequest) => {
    const response = await apiClient.patch(`/api/departments/${id}`, data);
    return response.data;
  },
  deleteDepartment: async (id: number) => {
    const response = await apiClient.delete(`/api/departments/${id}`);
    return response.data;
  },
};
