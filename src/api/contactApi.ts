import api from './axios';
import type { ApiResponse, PagedResult, CreateContactDto, ContactDto, UpdateContactStatusDto } from '../types';

export const contactApi = {
  // Public
  create: (dto: CreateContactDto) =>
    api.post<ApiResponse<ContactDto>>('/api/ministry/contacts', dto),

  // Admin
  getAll: (params?: {
    fullName?: string;
    email?: string;
    type?: number;
    status?: number;
    fromDate?: string;
    toDate?: string;
    sortBy?: string;
    isDescending?: boolean;
    pageNumber?: number;
    pageSize?: number;
  }) =>
    api.get<ApiResponse<PagedResult<ContactDto>>>('/api/admin/contacts', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<ContactDto>>(`/api/admin/contacts/${id}`),

  updateStatus: (id: number, dto: UpdateContactStatusDto) =>
  api.patch<ApiResponse<ContactDto>>(  `/api/admin/contacts/${id}/status`,dto),
  
  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/api/admin/contacts/${id}`),
};