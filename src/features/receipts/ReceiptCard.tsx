import { formatCurrency, formatDate } from "@/lib/format";
import { numberToIndianWords } from "@/lib/numberToWords";
import type { Donation } from "@/types/donation";

const paymentModeLabels: Record<string, string> = {
  CASH: "Cash",
  UPI: "UPI",
  OTHER: "Other",
};

export function ReceiptCard({ donation }: { donation: Donation }) {
  return (
    <div
      id="receipt-print-area"
      className="mx-auto w-full max-w-md rounded-2xl border-2 border-[#c9a227] bg-white p-6 shadow-sm"
    >
      {/* Header */}
      <div className="border-b-2 border-dashed border-[#e8ddd0] pb-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7a1f2b] text-2xl text-white">
          🕉️
        </div>
        <h1 className="mt-2 text-base font-bold text-[#7a1f2b]">
          श्री पवनारा गणपती गणेश मंडळ
        </h1>
        <p className="text-sm text-muted-foreground">धाराशिव</p>
        <p className="text-xs text-muted-foreground">स्थापना - १९९५</p>
      </div>

      {/* Receipt meta */}
      <div className="flex items-center justify-between py-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Receipt No.</p>
          <p className="font-semibold text-[#7a1f2b]">
            {donation.receiptNumber}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Date</p>
          <p className="font-medium">{formatDate(donation.paymentDate)}</p>
        </div>
      </div>

      {/* Donor details */}
      <div className="space-y-2 rounded-xl bg-[#fdf8f3] p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Donor Name</span>
          <span className="font-medium">{donation.donorName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Mobile</span>
          <span className="font-medium">{donation.mobile}</span>
        </div>
        {donation.address && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Address</span>
            <span className="text-right font-medium">{donation.address}</span>
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="mt-4 rounded-xl border border-[#c9a227]/40 bg-[#fdf6e8] p-4 text-center">
        <p className="text-xs text-muted-foreground">Amount Received</p>
        <p className="text-2xl font-bold text-[#7a1f2b]">
          {formatCurrency(donation.receivedAmount)}
        </p>
        <p className="mt-1 text-xs italic text-muted-foreground">
          {numberToIndianWords(donation.receivedAmount)}
        </p>
      </div>

      {/* Payment details */}
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment Mode</span>
          <span className="font-medium">
            {donation.paymentMode
              ? paymentModeLabels[donation.paymentMode]
              : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Collected By</span>
          <span className="font-medium">
            {donation.collectedBy?.name ?? "—"}
          </span>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-6 flex items-end justify-between border-t border-dashed border-[#e8ddd0] pt-4 text-xs text-muted-foreground">
        <span>Volunteer Signature</span>
        <span>Authorized Signature</span>
      </div>

      <p className="mt-4 text-center text-sm font-medium text-[#7a1f2b]">
        गणपती बाप्पा मोरया 🙏
      </p>
    </div>
  );
}
