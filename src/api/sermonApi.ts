import api from './axios';
import type { ApiResponse, PagedResult, SermonDto } from '../types';

export const sermonApi = {
  getAll: (params?: {
    pageNumber?: number;
    pageSize?: number;
    title?: string;
    speaker?: string;
    series?: string;
  }) =>
    api.get<ApiResponse<PagedResult<SermonDto>>>('/api/ministry/sermons', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<SermonDto>>(`/api/ministry/sermons/${id}`),
};