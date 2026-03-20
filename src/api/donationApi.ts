import api from './axios';
import type { ApiResponse } from '../types';

interface InitiateDonationDto {
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  donationType: string;
  eventId?: number;
  eventTitle?: string;
}

interface DonationInitResponse {
  paymentUrl: string;
}

export const donationApi = {
  initiatePaystack: (dto: InitiateDonationDto) =>
    api.post<ApiResponse<DonationInitResponse>>(
      '/api/ministry/donations/paystack', dto),

  initiateFlutterwave: (dto: InitiateDonationDto) =>
    api.post<ApiResponse<DonationInitResponse>>(
      '/api/ministry/donations/flutterwave', dto),
};