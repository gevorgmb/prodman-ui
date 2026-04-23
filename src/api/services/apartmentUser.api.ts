import apiClient from '../client';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  emailVerifiedAt?: string;
  phoneVerifiedAt?: string;
}

export interface ApartmentUser {
  membershipId: number;
  role: string;
  user: User;
}

export interface ApartmentUserLookupResponse {
  user: User;
  alreadyInApartment: boolean;
}

export const apartmentUserApi = {
  getUsers: async (apartmentId: number) => {
    const response = await apiClient.get('/api/apartment-users', {
      headers: { apartment: apartmentId }
    });
    return response.data;
  },

  findByEmail: async (apartmentId: number, email: string) => {
    const response = await apiClient.get('/api/apartment-users/find-by-email', {
      params: { email },
      headers: { apartment: apartmentId }
    });
    return response.data;
  },

  findByPhone: async (apartmentId: number, phone: string) => {
    const response = await apiClient.get('/api/apartment-users/find-by-phone', {
      params: { phone },
      headers: { apartment: apartmentId }
    });
    return response.data;
  },

  addUser: async (apartmentId: number, userId: number, role: string) => {
    const response = await apiClient.post('/api/apartment-users', {
      user_id: userId,
      role
    }, {
      headers: { apartment: apartmentId }
    });
    return response.data;
  },

  removeUser: async (apartmentId: number, userId: number) => {
    const response = await apiClient.delete(`/api/apartment-users/${userId}`, {
      headers: { apartment: apartmentId }
    });
    return response.data;
  }
};
