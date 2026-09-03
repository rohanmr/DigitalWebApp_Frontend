import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import { getDonationsApi } from "@/api/donationApi";
import type { Donation } from "@/types/donation";

interface ReceiptsListPageProps {
  basePath: string; // "/admin/receipts" | "/volunteer/receipts"
  donationsBasePath: string; // "/admin/donations" | "/volunteer/donations"
}

export function ReceiptsListPage({ basePath }: ReceiptsListPageProps) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Workaround: no dedicated receipts endpoint yet — pull PAID donations
      // and filter to those that actually have a receipt generated.
      const res = await getDonationsApi({ status: "PAID", limit: 100 });
      setDonations(res.data.filter((d) => d.receiptGenerated));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load receipts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return donations;
    return donations.filter(
      (d) =>
        d.receiptNumber?.toLowerCase().includes(q) ||
        d.donorName.toLowerCase().includes(q) ||
        d.mobile.includes(q) ||
        d.collectedBy?.name?.toLowerCase().includes(q),
    );
  }, [donations, search]);

  return (
    <div className="space-y-4">
      <div className="relative sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 pl-9"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center text-sm text-muted-foreground">
              No receipts found.
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt No.</TableHead>
                      <TableHead>Donor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Collected By</TableHead>
                      <TableHead>Generated Date</TableHead>
                      {/* <TableHead className="text-right">Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((d) => (
                      <TableRow key={d._id}>
                        <TableCell className="font-medium text-primary">
                          {d.receiptNumber}
                        </TableCell>
                        <TableCell>{d.donorName}</TableCell>
                        <TableCell>
                          {formatCurrency(d.receivedAmount)}
                        </TableCell>
                        <TableCell>{formatDate(d.paymentDate)}</TableCell>
                        <TableCell>{d.collectedBy?.name ?? "—"}</TableCell>
                        <TableCell>
                          {formatDate((d as any).receiptGeneratedAt)}
                        </TableCell>
                        {/* <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Link
                              to={`${basePath}/${d._id}`}
                              className="flex items-center"
                            >
                              <Eye className="mr-1.5 h-4 w-4" /> View
                            </Link>
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-3 md:hidden">
                {filtered.map((d) => (
                  <Card key={d._id} className="border shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{d.donorName}</p>
                          <p className="text-xs font-medium text-primary">
                            {d.receiptNumber}
                          </p>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatCurrency(d.receivedAmount)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{d.collectedBy?.name ?? "—"}</span>
                        <span>{formatDate(d.paymentDate)}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="lg"
                        className="mt-3 w-1/2"
                      >
                        <Link
                          to={`${basePath}/${d._id}`}
                          className="flex items-center"
                        >
                          <Eye className="mr-1.5 h-3.5 w-2" /> View Receipt
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
