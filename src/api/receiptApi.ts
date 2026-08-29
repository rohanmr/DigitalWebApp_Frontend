import axiosInstance from "./axiosInstance";
import type { Donation } from "@/types/donation";

export interface GenerateReceiptResponse {
  success: boolean;
  message: string;
  data: {
    donation: Donation;
    receiptNumber: string;
    receiptGeneratedAt: string;
  };
}

export const generateReceiptApi = async (
  donationId: string,
): Promise<GenerateReceiptResponse> => {
  const { data } = await axiosInstance.post<GenerateReceiptResponse>(
    `/receipts/generate/${donationId}`,
  );
  return data;
};

export interface GetReceiptResponse {
  success: boolean;
  message: string;
  data: Donation;
}

export const getReceiptByDonationApi = async (
  donationId: string,
): Promise<GetReceiptResponse> => {
  const { data } = await axiosInstance.get<GetReceiptResponse>(
    `/receipts/donation/${donationId}`,
  );
  return data;
};
