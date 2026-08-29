import { Link } from "react-router-dom";
import { MoreHorizontal, Eye, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Donation } from "@/types/donation";

interface DonationsTableProps {
  donations: Donation[];
  basePath: string; // "/admin/donations" or "/volunteer/donations"
}

export function DonationsTable({ donations, basePath }: DonationsTableProps) {
  if (donations.length === 0) {
    return (
      <div className="py-14 text-center text-sm text-muted-foreground">
        No donations found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Donor Name</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>Promised</TableHead>
          <TableHead>Received</TableHead>
          <TableHead>Remaining</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Volunteer</TableHead>
          <TableHead>Receipt</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {donations.map((d) => (
          <TableRow key={d._id} className="hover:bg-muted/50">
            <TableCell className="font-medium">{d.donorName}</TableCell>
            <TableCell>{d.mobile}</TableCell>
            <TableCell>{formatCurrency(d.promisedAmount)}</TableCell>
            <TableCell>{formatCurrency(d.receivedAmount)}</TableCell>
            <TableCell>
              {d.remainingAmount > 0 ? (
                <span className="text-amber-700">
                  {formatCurrency(d.remainingAmount)}
                </span>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell>
              <StatusBadge status={d.paymentStatus} />
            </TableCell>
            <TableCell>{formatDate(d.paymentDate || d.entryDate)}</TableCell>
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
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link
                      to={`${basePath}/${d._id}`}
                      className="flex items-center"
                    >
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to={`${basePath}/${d._id}/edit`}
                      className="flex items-center"
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
