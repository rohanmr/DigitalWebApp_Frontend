import axiosInstance from "./axiosInstance";
import type { PaginatedDonations, Donation } from "@/types/donation";
import type { DonationFormValues } from "@/features/donations/donationSchema";

export interface GetDonationsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getDonationsApi = async (
  params: GetDonationsParams = {},
): Promise<PaginatedDonations> => {
  const { data } = await axiosInstance.get<PaginatedDonations>(
    "/donations/get-all-donations",
    { params },
  );
  return data;
};

export interface DonationResponse {
  success: boolean;
  message: string;
  data: Donation;
}

export const createDonationApi = async (
  payload: DonationFormValues,
): Promise<DonationResponse> => {
  const { data } = await axiosInstance.post<DonationResponse>(
    "/donations/create",
    payload,
  );
  return data;
};

export const getDonationByIdApi = async (
  id: string,
): Promise<DonationResponse> => {
  const { data } = await axiosInstance.get<DonationResponse>(
    `/donations/${id}`,
  );
  return data;
};

export const updateDonationApi = async (
  id: string,
  payload: Partial<DonationFormValues>,
): Promise<DonationResponse> => {
  const { data } = await axiosInstance.put<DonationResponse>(
    `/donations/${id}`,
    payload,
  );
  return data;
};

export interface MarkPaidPayload {
  receivedAmount?: number;
  paymentMode?: string;
  paymentDate?: string;
}

export const markDonationAsPaidApi = async (
  id: string,
  payload: MarkPaidPayload,
): Promise<DonationResponse> => {
  const { data } = await axiosInstance.patch<DonationResponse>(
    `/donations/${id}/mark-paid`,
    payload,
  );
  return data;
};

export const deleteDonationApi = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const { data } = await axiosInstance.delete(`/donations/${id}`);
  return data;
};
