import { useEffect, useState } from "react";
import { Wallet, Clock, HandCoins, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatCard } from "@/components/StatCard";
import { RecentDonationsTable } from "@/features/dashboard/RecentDonationsTable";
import { RecentDonationsCards } from "@/features/dashboard/RecentDonationsCards";
import { getDashboardSummaryApi } from "@/api/dashboardApi";
import { getDonationsApi } from "@/api/donationApi";
import { formatCurrency } from "@/lib/format";
import { useAuth } from "@/features/auth/AuthContext";
import type { DashboardSummary } from "@/types/dashboard";
import type { Donation } from "@/types/donation";

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [summaryRes, donationsRes] = await Promise.all([
          getDashboardSummaryApi(),
          getDonationsApi({ page: 1, limit: 6 }),
        ]);
        setSummary(summaryRes.data);
        setDonations(donationsRes.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Welcome, {user?.name}</h2>
        <p className="text-sm text-muted-foreground">
          Here's what's happening with donations today.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[76px] rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              label="Total Received"
              value={formatCurrency(summary?.totalReceived ?? 0)}
              icon={Wallet}
              iconBg="bg-green-100 text-green-700"
            />
            <StatCard
              label="Pending Amount"
              value={formatCurrency(summary?.pendingAmount ?? 0)}
              icon={Clock}
              iconBg="bg-amber-100 text-amber-700"
            />
            <StatCard
              label="Total Donations"
              value={String(summary?.totalDonations ?? 0)}
              icon={HandCoins}
              iconBg="bg-primary/10 text-primary"
            />
            <StatCard
              label="Active Volunteers"
              value={String(summary?.volunteerCount ?? 0)}
              icon={Users}
              iconBg="bg-secondary/10 text-secondary"
            />
          </>
        )}
      </div>

      {/* Recent donations */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <RecentDonationsTable donations={donations} />
              </div>
              {/* Mobile cards */}
              <div className="block md:hidden">
                <RecentDonationsCards donations={donations} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
