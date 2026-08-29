import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EditDonationForm } from "@/features/donations/EditDonationForm";
import { getDonationByIdApi } from "@/api/donationApi";
import { useAuth } from "@/features/auth/AuthContext";
import type { Donation } from "@/types/donation";

interface EditDonationPageProps {
  basePath: string; // "/admin/donations" | "/volunteer/donations"
}

export function EditDonationPage({ basePath }: EditDonationPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getDonationByIdApi(id);
      setDonation(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load donation");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="mx-auto max-w-2xl">
        <Alert variant="destructive">
          <AlertDescription>{error || "Donation not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isFieldsLocked =
    user?.role === "volunteer" && !!donation.receiptGenerated;

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-none shadow-sm sm:border sm:shadow-none">
        <CardHeader className="hidden sm:block">
          <CardTitle>Edit Donation</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <EditDonationForm
            donation={donation}
            isFieldsLocked={isFieldsLocked}
            onSuccess={() => navigate(`${basePath}/${donation._id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
