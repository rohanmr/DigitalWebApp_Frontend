import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Donation } from "@/types/donation";

export function RecentDonationsTable({ donations }: { donations: Donation[] }) {
  if (donations.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No donations yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Donor Name</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Date</TableHead>
          <TableHead>Collected By</TableHead>
          <TableHead>Receipt</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {donations.map((d) => (
          <TableRow key={d._id} className="cursor-pointer hover:bg-muted/50">
            <TableCell>
              <Link to={`/admin/donations/${d._id}`} className="font-medium">
                {d.donorName}
              </Link>
            </TableCell>
            <TableCell>{d.mobile}</TableCell>
            <TableCell>
              {formatCurrency(d.receivedAmount || d.promisedAmount)}
            </TableCell>
            <TableCell>
              <StatusBadge status={d.paymentStatus} />
            </TableCell>
            <TableCell>{formatDate(d.paymentDate)}</TableCell>
            <TableCell>{d.collectedBy?.name ?? "—"}</TableCell>
            <TableCell>
              {d.receiptGenerated ? (
                <span className="text-xs font-medium text-primary">
                  {d.receiptNumber}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
