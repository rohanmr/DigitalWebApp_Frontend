export type PaymentStatus = "PENDING" | "PARTIALLY_PAID" | "PAID" | "CANCELLED";
export type PaymentMode = "CASH" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | null;

export interface CollectedByUser {
  _id: string;
  name: string;
  mobile: string;
  role: string;
}

export interface Donation {
  _id: string;
  donorName: string;
  mobile: string;
  address?: string;
  promisedAmount: number;
  receivedAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  entryDate: string;
  expectedPaymentDate: string | null;
  paymentDate: string | null;
  remarks?: string;
  receiptGenerated?: boolean;
  receiptNumber?: string;
  collectedBy: CollectedByUser;
  createdBy: CollectedByUser;
  createdAt: string;
}

export interface PaginatedDonations {
  success: boolean;
  message: string;
  data: Donation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
