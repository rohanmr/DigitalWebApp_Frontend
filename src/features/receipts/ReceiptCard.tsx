import { formatCurrency, formatDate } from "@/lib/format";
import { numberToIndianWords } from "@/lib/numberToWords";
import type { Donation } from "@/types/donation";

const paymentModeLabels: Record<string, string> = {
  CASH: "रोख",
  UPI: "UPI",
  OTHER: "इतर",
};

export function ReceiptCard({ donation }: { donation: Donation }) {
  return (
    <div
      id="receipt-print-area"
      className="ornate-border temple-pattern mx-auto w-full max-w-md rounded-lg bg-[#fdf8ec] p-1 shadow-md"
    >
      <div className="relative overflow-hidden rounded-md border border-[#c9a227]/50 bg-[#fdf8ec] p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <img
            src="/images/logo-image.png"
            alt="श्री पावणारा गणपती"
            className="h-12 w-12 shrink-0 rounded-full border-2 border-[#c9a227] object-cover"
          />
          <div className="flex-1 px-2 text-center">
            <h1 className="text-base font-extrabold text-[#7a1f2b]">
              श्री पावणारा गणपती गणेश मंडळ, धाराशिव
            </h1>
            <p className="text-xs font-medium text-[#c9880a]">स्थापना - १९६५</p>
          </div>
          <img
            src="/images/ganpati-logo.jpeg"
            alt=""
            className="h-12 w-12 shrink-0 rounded-full border-2 border-[#c9a227] object-cover"
          />
        </div>

        <div className="mt-3 flex items-center justify-between border-b border-dashed border-[#c9a227]/50 pb-2 text-xs">
          <span className="font-medium text-[#7a1f2b]">
            क. पावती क.:{" "}
            <span className="font-bold">{donation.receiptNumber}</span>
          </span>
          <span className="text-muted-foreground">
            दि. {formatDate(donation.paymentDate)}
          </span>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">श्री./सौ. </span>
            <span className="font-semibold text-[#7a1f2b]">
              {donation.donorName}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            यांनी श्री गणपती मंडळाकरिता दिलेली देणगी
          </p>
          <p className="text-xs text-muted-foreground">
            मो. {donation.mobile}
            {donation.address ? ` | ${donation.address}` : ""}
          </p>

          <div className="mt-3 inline-block rounded-lg border-2 border-[#7a1f2b] bg-white px-4 py-2">
            <p className="text-xl font-extrabold text-[#7a1f2b]">
              रु. {donation.receivedAmount}/-
            </p>
          </div>
          <p className="text-xs italic text-muted-foreground">
            अक्षरी रु. {numberToIndianWords(donation.receivedAmount)}
          </p>

          <p className="pt-1 text-xs text-muted-foreground">
            {/* भरणा पद्धत:{" "}
            <span className="font-medium">
              {donation.paymentMode
                ? paymentModeLabels[donation.paymentMode]
                : "—"}
            </span>{" "} */}
            संकलक:{" "}
            <span className="font-medium">
              {donation.collectedBy?.name ?? "—"}
            </span>
          </p>
        </div>

        <p className="mt-4 text-center text-sm font-semibold text-[#7a1f2b]">
          धन्यवाद !
        </p>
        <p className="text-center text-sm font-bold text-[#7a1f2b]">
          || गणपती बाप्पा मोरया ||
        </p>
      </div>
    </div>
  );
}
