import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Download,
  Printer,
  Share2,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { ReceiptCard } from "@/features/receipts/ReceiptCard";
import { getReceiptByDonationApi } from "@/api/receiptApi";
import { formatCurrency } from "@/lib/format";
import type { Donation } from "@/types/donation";

interface ReceiptPreviewPageProps {
  basePath: string; // "/admin/donations" | "/volunteer/donations"
}

export function ReceiptPreviewPage({ basePath }: ReceiptPreviewPageProps) {
  const { id } = useParams<{ id: string }>();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getReceiptByDonationApi(id);
      setDonation(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load receipt");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    if (!donation) return;
    const text = `🙏 गणपती बाप्पा मोरया\n\nश्री पवनारा गणपती गणेश मंडळ, धाराशिव\n\nReceipt No: ${donation.receiptNumber}\nDonor: ${donation.donorName}\nAmount: ${formatCurrency(donation.receivedAmount)}\nDate: ${donation.paymentDate ? new Date(donation.paymentDate).toLocaleDateString("en-IN") : ""}\n\nThank you for your generous donation!`;
    const phone = donation.mobile ? `91${donation.mobile}` : "";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleShare = async () => {
    if (!donation) return;
    const shareText = `Receipt ${donation.receiptNumber} — ${donation.donorName} — ${formatCurrency(donation.receivedAmount)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Donation Receipt", text: shareText });
      } catch {
        // user cancelled share — no action needed
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Receipt details copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[520px] rounded-2xl" />
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="mx-auto max-w-md">
        <Alert variant="destructive">
          <AlertDescription>{error || "Receipt not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4 pb-6">
      <div className="no-print flex items-center justify-between">
        <Button variant="ghost" size="sm">
          <Link
            to={`${basePath}/${donation._id}`}
            className="flex items-center"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Link>
        </Button>
      </div>

      <ReceiptCard donation={donation} />

      <div className="no-print grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button variant="outline" className="h-11" onClick={handlePrint}>
          <Download className="mr-1.5 h-4 w-4" /> PDF
        </Button>
        <Button variant="outline" className="h-11" onClick={handlePrint}>
          <Printer className="mr-1.5 h-4 w-4" /> Print
        </Button>
        <Button
          variant="outline"
          className="h-11 text-green-700"
          onClick={handleWhatsApp}
        >
          <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp
        </Button>
        <Button variant="outline" className="h-11" onClick={handleShare}>
          <Share2 className="mr-1.5 h-4 w-4" /> Share
        </Button>
      </div>
    </div>
  );
}
