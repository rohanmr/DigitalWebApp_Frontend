import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DonationsFilterBar } from "@/features/donations/DonationsFilterBar";
import { DonationsTable } from "@/features/donations/DonationsTable";
import { DonationsCards } from "@/features/donations/DonationsCards";
import { AppPagination } from "@/components/AppPagination";
import { useDebounce } from "@/hooks/useDebounce";
import { getDonationsApi } from "@/api/donationApi";
import type { Donation, PaymentStatus } from "@/types/donation";

interface DonationsListPageProps {
  basePath: string; // "/admin/donations" | "/volunteer/donations"
  addDonationUrl: string;
}

const PAGE_SIZE = 10;

export function DonationsListPage({
  basePath,
  addDonationUrl,
}: DonationsListPageProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getDonationsApi({
          search: debouncedSearch || undefined,
          status: status === "ALL" ? undefined : status,
          page,
          limit: PAGE_SIZE,
        });
        setDonations(res.data);
        setTotalPages(res.pagination.totalPages);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load donations");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [debouncedSearch, status, page]);

  return (
    <div className="space-y-4">
      <DonationsFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        addDonationUrl={addDonationUrl}
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <DonationsTable donations={donations} basePath={basePath} />
              </div>
              <div className="block md:hidden">
                <DonationsCards donations={donations} basePath={basePath} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {!isLoading && (
        <div className="flex justify-center">
          <AppPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
