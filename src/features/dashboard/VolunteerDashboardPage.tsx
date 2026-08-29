import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Wallet,
  Clock,
  CalendarCheck,
  HandCoins,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { StatCard } from "@/components/StatCard";
import { RecentDonationsCards } from "@/features/dashboard/RecentDonationsCards";
import { getDonationsApi } from "@/api/donationApi";
import { formatCurrency } from "@/lib/format";
import { isToday } from "@/lib/isToday";
import { useAuth } from "@/features/auth/AuthContext";
import type { Donation } from "@/types/donation";

export function VolunteerDashboardPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        // Auto-scoped to this volunteer server-side (see getDonations in donationController)
        const res = await getDonationsApi({ limit: 1000 });
        setDonations(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to load your donations",
        );
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const myCollection = donations.reduce((sum, d) => sum + d.receivedAmount, 0);
  const pendingAmount = donations.reduce(
    (sum, d) => sum + d.remainingAmount,
    0,
  );
  const todaysCollection = donations
    .filter((d) => isToday(d.paymentDate))
    .reduce((sum, d) => sum + d.receivedAmount, 0);
  const totalDonations = donations.length;

  const recent = [...donations]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">नमस्कार, {user?.name} 🙏</h2>
        <p className="text-sm text-muted-foreground">
          Here's your collection summary.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[76px] rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              label="My Collection"
              value={formatCurrency(myCollection)}
              icon={Wallet}
              iconBg="bg-green-100 text-green-700"
            />
            <StatCard
              label="Pending Amount"
              value={formatCurrency(pendingAmount)}
              icon={Clock}
              iconBg="bg-amber-100 text-amber-700"
            />
            <StatCard
              label="Today's Collection"
              value={formatCurrency(todaysCollection)}
              icon={CalendarCheck}
              iconBg="bg-primary/10 text-primary"
            />
            <StatCard
              label="My Donations"
              value={String(totalDonations)}
              icon={HandCoins}
              iconBg="bg-secondary/10 text-secondary"
            />
          </>
        )}
      </div>

      <Button className="h-12 w-full text-base">
        <Link to="/volunteer/donations/add" className="flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Donation
        </Link>
      </Button>

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
            <RecentDonationsCards
              donations={recent}
              basePath="/volunteer/donations"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
