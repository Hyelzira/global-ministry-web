import api from './axios';
import type {
  ApiResponse,
  UserDto,
  DashboardStatsDto,
  PagedResult,
  DonationResponseDto,
  DonationStatsDto,
  BookDto,
  CreateBookDto,
  UpdateBookDto,
} from '../types';

// ─── HELPER ────────────────────────────────────────────────────────────────────
// Converts empty strings to null for URL/optional fields before sending to API.
// This prevents [Url] validation errors on the backend for empty inputs.
const sanitizeBookDto = <T extends CreateBookDto | UpdateBookDto>(dto: T): T => ({
  ...dto,
  amazonUrl:     dto.amazonUrl?.trim()      || null,
  selarUrl:      dto.selarUrl?.trim()       || null,
  coverImageUrl: dto.coverImageUrl?.trim()  || null,
  description:   dto.description?.trim()    || null,
});

export const adminApi = {
  // ── USERS ──────────────────────────────────────────────────────────────────
  getUsers: (params?: {
    pageNumber?: number;
    pageSize?: number;
    email?: string;
    fullName?: string;
  }) =>
    api.get<ApiResponse<UserDto[]>>('/api/admin/users', { params }),

  getUserById: (id: string) =>
    api.get<ApiResponse<UserDto>>(`/api/admin/users/${id}`),

  deleteUser: (id: string) =>
    api.delete<ApiResponse<null>>(`/api/admin/users/${id}`),

  assignRole: (userId: string, role: string) =>
    api.post<ApiResponse<null>>('/api/admin/users/assign-role', { userId, role }),

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  getDashboardStats: () =>
    api.get<ApiResponse<DashboardStatsDto>>('/api/admin/dashboard'),

  // ── DONATIONS ──────────────────────────────────────────────────────────────
  getDonations: (params?: {
    pageNumber?: number;
    pageSize?: number;
    donorName?: string;
    donorEmail?: string;
    status?: string;
    donationType?: string;
    paymentMethod?: string;
    currency?: string;
    fromDate?: string;
    toDate?: string;
    sortBy?: string;
    isDescending?: boolean;
  }) =>
    api.get<ApiResponse<PagedResult<DonationResponseDto>>>('/api/admin/donations', { params }),

  getDonationById: (id: number) =>
    api.get<ApiResponse<DonationResponseDto>>(`/api/admin/donations/${id}`),

  getDonationStats: () =>
    api.get<ApiResponse<DonationStatsDto>>('/api/admin/donations/stats'),

  // ── BOOKS ──────────────────────────────────────────────────────────────────
  getBooks: (params?: {
    pageNumber?: number;
    pageSize?: number;
    title?: string;
    author?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    sortBy?: string;
    isDescending?: boolean;
  }) =>
    api.get<ApiResponse<PagedResult<BookDto>>>('/api/admin/books', { params }),

  getBookById: (id: number) =>
    api.get<ApiResponse<BookDto>>(`/api/admin/books/${id}`),

  createBook: (dto: CreateBookDto) =>
    api.post<ApiResponse<BookDto>>('/api/admin/books', sanitizeBookDto(dto)),

  updateBook: (id: number, dto: UpdateBookDto) =>
    api.put<ApiResponse<BookDto>>(`/api/admin/books/${id}`, sanitizeBookDto(dto)),

  deleteBook: (id: number) =>
    api.delete<ApiResponse<null>>(`/api/admin/books/${id}`),
};