export interface ReceiptData {
  receiptNumber: string;
  date: string; // display-ready, e.g. "28 Aug 2026"
  donorName: string;
  mobile: string;
  address?: string;
  location?: string;
  amount: number;
  amountInWords: string;
  paymentMode: string;
  collectedBy: string;
  mandalNameMarathi: string;
  establishedYear: string;
}
