import apiClient from '../client';

export const userApi = {
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/current-user');
    return response.data;
  },
  updateProfile: async (data: { name: string; phone: string }) => {
    const response = await apiClient.patch('/api/current-user', data);
    return response.data;
  },
  sendVerification: async (type: 'email' | 'phone') => {
    const response = await apiClient.post(`/api/send-${type}-verification`);
    return response.data;
  },
  verifyCode: async (type: 'email' | 'phone', code: string) => {
    const response = await apiClient.post(`/api/verify-${type}-code`, { code });
    return response.data;
  },
};
