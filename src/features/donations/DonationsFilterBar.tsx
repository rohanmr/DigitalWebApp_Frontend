import { Search, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentStatus } from "@/types/donation";

interface DonationsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: PaymentStatus | "ALL";
  onStatusChange: (value: PaymentStatus | "ALL") => void;
  addDonationUrl: string;
}

export function DonationsFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  addDonationUrl,
}: DonationsFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-9"
          />
        </div>

        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as PaymentStatus | "ALL")}
        >
          <SelectTrigger className="h-10 sm:w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="h-10 shrink-0">
        <Link to={addDonationUrl} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          <h2>Add Donation</h2>
        </Link>
      </Button>
    </div>
  );
}
