import { numberToIndianWords } from "@/lib/numberToWords";
import { mandalConfig } from "@/config/mandalConfig";
import type { Donation } from "@/types/donation";
import type { ReceiptData } from "@/types/receipt";

const paymentModeLabels: Record<string, string> = {
  CASH: "रोकड (CASH)",
  UPI: "UPI",
  OTHER: "इतर (OTHER)",
};

export function donationToReceiptData(donation: Donation): ReceiptData {
  return {
    receiptNumber: donation.receiptNumber || "",
    date: donation.paymentDate
      ? new Date(donation.paymentDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—",
    donorName: donation.donorName,
    mobile: donation.mobile,
    address: donation.address,
    amount: donation.receivedAmount,
    amountInWords: numberToIndianWords(donation.receivedAmount),
    paymentMode: donation.paymentMode
      ? (paymentModeLabels[donation.paymentMode] ?? donation.paymentMode)
      : "—",
    collectedBy: donation.collectedBy?.name ?? "—",
    mandalNameMarathi: mandalConfig.fullNameMarathi,
    location: mandalConfig.location,
    establishedYear: mandalConfig.establishedYear,
  };
}
