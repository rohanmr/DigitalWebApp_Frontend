import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Donation } from "@/types/donation";

interface RecentDonationsCardsProps {
  donations: Donation[];
  basePath?: string;
}

export function RecentDonationsCards({
  donations,
  basePath = "/admin/donations",
}: RecentDonationsCardsProps) {
  if (donations.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No donations yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {donations.map((d) => (
        <Link key={d._id} to={`${basePath}/${d._id}`}>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{d.donorName}</p>
                  <p className="text-xs text-muted-foreground">{d.mobile}</p>
                </div>
                <StatusBadge status={d.paymentStatus} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-primary">
                  {formatCurrency(d.receivedAmount || d.promisedAmount)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(d.paymentDate || d.entryDate)}
                </span>
              </div>
              {d.paymentStatus === "PENDING" && d.expectedPaymentDate && (
                <p className="mt-1 text-xs text-amber-700">
                  Expected: {formatDate(d.expectedPaymentDate)}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
