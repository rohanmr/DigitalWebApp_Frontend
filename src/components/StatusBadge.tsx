import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@/types/donation";

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  PAID: { label: "Paid", className: "status-paid" },
  PENDING: { label: "Pending", className: "status-pending" },
  PARTIALLY_PAID: { label: "Partially Paid", className: "status-partial" },
  CANCELLED: { label: "Cancelled", className: "status-cancelled" },
};

export function StatusBadge({ status }: { status: PaymentStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
