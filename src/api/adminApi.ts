import api from './axios';
import type { ApiResponse, UserDto, DashboardStatsDto } from '../types';

export const adminApi = {
  getUsers: (params?: {
    pageNumber?: number;
    pageSize?: number;
    email?: string;
    fullName?: string;
  }) =>
    api.get<ApiResponse<UserDto[]>>('/api/admin/users', { params }),
    
    getUserById: (id: string) =>
    api.get<ApiResponse<UserDto>>(`/api/admin/users/${id}`),
  // Add this to your existing adminApi.ts
    getDashboardStats: () =>
    api.get<ApiResponse<DashboardStatsDto>>('/api/admin/dashboard'),

    deleteUser: (id: string) =>
    api.delete<ApiResponse<null>>(`/api/admin/users/${id}`),

    assignRole: (userId: string, role: string) =>
    api.post<ApiResponse<null>>('/api/admin/users/assign-role', { userId, role }),
};