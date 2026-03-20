import api from './axios';
import type { ApiResponse, CreateTestimonyDto, TestimonyDto } from '../types';

export const testimonyApi = {
  // Public — submit a testimony (works anonymous or logged in)
  create: (dto: CreateTestimonyDto) =>
    api.post<ApiResponse<TestimonyDto>>('/api/Testimony', dto),

  // Public — get approved testimonies
  getApproved: (params?: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    isDescending?: boolean;
  }) =>
    api.get<ApiResponse<{ items: TestimonyDto[]; totalCount: number }>>(
      '/api/admin/testimonies', { params }
    ),

  // Admin only
  getAll: (params?: {
    fullName?: string;
    status?: number;
    fromDate?: string;
    toDate?: string;
    pageNumber?: number;
    pageSize?: number;
  }) =>
    api.get<ApiResponse<{ items: TestimonyDto[]; totalCount: number }>>(
      '/api/admin/testimonies/all', { params }
    ),

  getById: (id: number) =>
    api.get<ApiResponse<TestimonyDto>>(`/api/admin/testimonies/${id}`),

  updateStatus: (id: number, status: number) =>
    api.patch<ApiResponse<TestimonyDto>>(`/api/admin/testimonies/${id}/status`, { status }),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/api/admin/testimonies/${id}`),
};