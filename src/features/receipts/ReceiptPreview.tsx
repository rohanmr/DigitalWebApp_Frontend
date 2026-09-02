import type { ReceiptData } from "@/types/receipt";

// Percentage-based coordinates, tuned by eye against receipt-template.png.
// Adjust these numbers to nudge text into the blank areas of your template.
const layout = {
  receiptNo: { top: "30.8%", left: "19%" },
  date: { top: "30.8%", right: "8%" },
  donorName: { top: "37.5%", left: "20.5%" },
  mobile: { top: "48.5%", left: "16%" },
  location: { top: "55.5%", left: "8%" },
  amount: { top: "65%", left: "16.5%" },
  amountWords: { top: "78%", left: "6%" },
  collectedBy: { top: "86%", left: "10%" },
};

export function ReceiptPreview({ data }: { data: ReceiptData }) {
  return (
    <div
      id="receipt-print-area"
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl shadow-lg"
      style={{ aspectRatio: "1200 / 1350" }} // match your template's real W/H ratio
    >
      <img
        src="/images/receipt-template.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      <span
        className="absolute text-xs font-bold text-[#7a1f2b] sm:text-sm"
        style={layout.receiptNo}
      >
        {data.receiptNumber}
      </span>
      <span
        className="absolute text-xs font-bold text-[#7a1f2b] sm:text-sm"
        style={layout.date}
      >
        {data.date}
      </span>
      <span
        className="absolute font-semibold text-[#7a1f2b] sm:text-base"
        style={layout.donorName}
      >
        {data.donorName}
      </span>
      <span className="absolute text-xs sm:text-sm" style={layout.mobile}>
        {data.mobile}
      </span>
      {/* {data.location && (
        <span className="absolute text-xs sm:text-sm" style={layout.location}>
          {data.location}
        </span>
      )} */}
      <span
        className="absolute text-xl font-medium text-white sm:text-3xl"
        style={layout.amount}
      >
        ₹ {data.amount}/-
      </span>
      <span
        className="absolute text-[10px] italic text-[#7a1f2b] sm:text-sm"
        style={layout.amountWords}
      >
        {data.amountInWords}
      </span>
      <span
        className="absolute text-xs font-medium sm:text-sm"
        style={layout.collectedBy}
      >
        {data.collectedBy}
      </span>
    </div>
  );
}
