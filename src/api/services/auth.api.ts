import apiClient from '../client';

export const authApi = {
  login: async (data: any) => {
    const response = await apiClient.post('/api/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await apiClient.post('/api/register', data);
    return response.data;
  },
  logout: async () => {
    await apiClient.post('/api/logout');
  },
};
