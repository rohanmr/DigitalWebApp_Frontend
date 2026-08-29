import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Pencil, Trash2, FileCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MarkPaidDialog } from "@/features/donations/MarkPaidDialog";
import { formatCurrency, formatDate } from "@/lib/format";
import { getDonationByIdApi, deleteDonationApi } from "@/api/donationApi";
import { generateReceiptApi } from "@/api/receiptApi";
import { useAuth } from "@/features/auth/AuthContext";
import type { Donation } from "@/types/donation";

interface DonationDetailsPageProps {
  basePath: string; // "/admin/donations" | "/volunteer/donations"
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function DonationDetailsPage({ basePath }: DonationDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [markPaidOpen, setMarkPaidOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);

  const loadDonation = useCallback(async () => {
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
    loadDonation();
  }, [loadDonation]);

  const handleDelete = async () => {
    if (!donation) return;
    setIsDeleting(true);
    try {
      await deleteDonationApi(donation._id);
      toast.success("Donation deleted successfully");
      navigate(basePath);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete donation");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleGenerateReceipt = async () => {
    if (!donation) return;
    setIsGeneratingReceipt(true);
    try {
      const res = await generateReceiptApi(donation._id);
      toast.success(res.message || "Receipt generated successfully");
      setDonation(res.data.donation);
      navigate(
        `${basePath.replace("/donations", "/receipts")}/${donation._id}`,
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to generate receipt");
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 rounded-xl" />
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

  const isAdmin = user?.role === "admin";

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{donation.donorName}</h2>
          <p className="text-sm text-muted-foreground">{donation.mobile}</p>
        </div>
        <StatusBadge status={donation.paymentStatus} />
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Donation Information</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <InfoRow
            label="Promised Amount"
            value={formatCurrency(donation.promisedAmount)}
          />
          <InfoRow
            label="Received Amount"
            value={formatCurrency(donation.receivedAmount)}
          />
          {donation.remainingAmount > 0 && (
            <InfoRow
              label="Remaining Amount"
              value={
                <span className="text-amber-700">
                  {formatCurrency(donation.remainingAmount)}
                </span>
              }
            />
          )}
          <InfoRow label="Payment Mode" value={donation.paymentMode || "—"} />
          <InfoRow label="Entry Date" value={formatDate(donation.entryDate)} />
          {donation.paymentStatus === "PENDING" && (
            <InfoRow
              label="Expected Payment Date"
              value={formatDate(donation.expectedPaymentDate)}
            />
          )}
          {donation.paymentDate && (
            <InfoRow
              label="Payment Date"
              value={formatDate(donation.paymentDate)}
            />
          )}
          {donation.address && (
            <InfoRow label="Address" value={donation.address} />
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Collection Details</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <InfoRow
            label="Collected By"
            value={donation.collectedBy?.name ?? "—"}
          />
          <InfoRow label="Created By" value={donation.createdBy?.name ?? "—"} />
          {donation.receiptGenerated && (
            <InfoRow
              label="Receipt Number"
              value={
                <span className="text-primary">{donation.receiptNumber}</span>
              }
            />
          )}
        </CardContent>
      </Card>

      {donation.remarks && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{donation.remarks}</p>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Conditional actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          className="h-11 flex-1 items-center cursor-pointer"
        >
          <Link
            to={`${basePath}/${donation._id}/edit`}
            className="flex items-center"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>

        {(donation.paymentStatus === "PENDING" ||
          donation.paymentStatus === "PARTIALLY_PAID") && (
          <Button
            className="h-11 flex-1 cursor-pointer"
            onClick={() => setMarkPaidOpen(true)}
          >
            {donation.paymentStatus === "PENDING"
              ? "Mark as Paid"
              : "Add Payment"}
          </Button>
        )}

        {donation.paymentStatus === "PAID" && (
          <Button
            className="h-11 flex-1 cursor-pointer"
            onClick={handleGenerateReceipt}
            disabled={isGeneratingReceipt}
          >
            {isGeneratingReceipt ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <FileCheck className="mr-2 h-4 w-4" />
                {donation.receiptGenerated
                  ? "View Receipt"
                  : "Generate Receipt"}
              </>
            )}
          </Button>
        )}

        {isAdmin && !donation.receiptGenerated && (
          <Button
            variant="outline"
            className="h-11 border-destructive text-destructive hover:bg-destructive/10 cursor-pointer"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <MarkPaidDialog
        donation={donation}
        open={markPaidOpen}
        onOpenChange={setMarkPaidOpen}
        onSuccess={loadDonation}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Donation?"
        description="This will permanently remove this donation entry. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
