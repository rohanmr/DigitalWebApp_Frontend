import { CheckCircle2, Clock, CircleDollarSign } from "lucide-react";
import type { DonationFormValues } from "@/features/donations/donationSchema";

const options: {
  value: DonationFormValues["paymentStatus"];
  label: string;
  icon: typeof CheckCircle2;
  activeClass: string;
}[] = [
  {
    value: "PAID",
    label: "Paid",
    icon: CheckCircle2,
    activeClass: "border-green-500 bg-green-50 text-green-700",
  },
  {
    value: "PENDING",
    label: "Pending",
    icon: Clock,
    activeClass: "border-amber-500 bg-amber-50 text-amber-700",
  },
  {
    value: "PARTIALLY_PAID",
    label: "Partially Paid",
    icon: CircleDollarSign,
    activeClass: "border-orange-500 bg-orange-50 text-orange-700",
  },
];

interface PaymentStatusTabsProps {
  value: DonationFormValues["paymentStatus"];
  onChange: (value: DonationFormValues["paymentStatus"]) => void;
  disabled?: boolean;
}

export function PaymentStatusTabs({
  value,
  onChange,
  disabled = false,
}: PaymentStatusTabsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`flex justify-center  items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-medium transition-colors ${
              isActive ? opt.activeClass : "border-border text-muted-foreground"
            } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <opt.icon size={20} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
