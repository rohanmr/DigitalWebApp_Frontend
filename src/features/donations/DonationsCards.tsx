import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Donation } from "@/types/donation";

interface DonationsCardsProps {
  donations: Donation[];
  basePath: string;
}

export function DonationsCards({ donations, basePath }: DonationsCardsProps) {
  if (donations.length === 0) {
    return (
      <div className="py-14 text-center text-sm text-muted-foreground">
        No donations found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {donations.map((d) => (
        <Card key={d._id} className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{d.donorName}</p>
                <p className="text-xs text-muted-foreground">{d.mobile}</p>
              </div>
              <StatusBadge status={d.paymentStatus} />
            </div>

            <div className="mt-3 flex gap-10 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Promised</p>
                <p className="font-medium">
                  {formatCurrency(d.promisedAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Received</p>
                <p className="font-medium">
                  {formatCurrency(d.receivedAmount)}
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{d.collectedBy?.name ?? "—"}</span>
              <span>{formatDate(d.paymentDate || d.entryDate)}</span>
            </div>

            <div className="mt-3 flex gap-2 border-t pt-3">
              <Button variant="outline" size="sm" className="flex-1">
                <Link to={`${basePath}/${d._id}`} className="flex items-center">
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Link
                  to={`${basePath}/${d._id}/edit`}
                  className="flex items-center"
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
