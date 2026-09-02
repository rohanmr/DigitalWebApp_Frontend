// import { useEffect, useState, useCallback } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   Download,
//   Printer,
//   Share2,
//   MessageCircle,
//   ArrowLeft,
// } from "lucide-react";
// import { toast } from "sonner";
// import { FaWhatsapp } from "react-icons/fa";

// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// import { ReceiptCard } from "@/features/receipts/ReceiptCard";
// import { getReceiptByDonationApi } from "@/api/receiptApi";
// import { formatCurrency } from "@/lib/format";
// import type { Donation } from "@/types/donation";
// import { captureReceiptAsBlob } from "@/lib/receiptImage";
// import { isMobileDevice } from "@/lib/isMobileDevice";

// interface ReceiptPreviewPageProps {
//   basePath: string; // "/admin/donations" | "/volunteer/donations"
// }

// export function ReceiptPreviewPage({ basePath }: ReceiptPreviewPageProps) {
//   const { id } = useParams<{ id: string }>();
//   const [donation, setDonation] = useState<Donation | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     if (!id) return;
//     setIsLoading(true);
//     setError(null);
//     try {
//       const res = await getReceiptByDonationApi(id);
//       setDonation(res.data);
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Failed to load receipt");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const handlePrint = () => {
//     window.print();
//   };

//   // const handleWhatsApp = () => {
//   //   if (!donation) return;
//   //   const text = `🙏 गणपती बाप्पा मोरया\n\nश्री पवनारा गणपती गणेश मंडळ, धाराशिव\n\nReceipt No: ${donation.receiptNumber}\nDonor: ${donation.donorName}\nAmount: ${formatCurrency(donation.receivedAmount)}\nDate: ${donation.paymentDate ? new Date(donation.paymentDate).toLocaleDateString("en-IN") : ""}\n\nThank you for your generous donation!`;
//   //   const phone = donation.mobile ? `91${donation.mobile}` : "";
//   //   const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
//   //   window.open(url, "_blank");
//   // };
//   const handleWhatsApp = async () => {
//     if (!donation) return;

//     const text = `🙏 गणपती बाप्पा मोरया\n\nश्री पावणारा गणपती गणेश मंडळ, धाराशिव\n\nReceipt No: ${donation.receiptNumber}\nDonor: ${donation.donorName}\nAmount: ${formatCurrency(donation.receivedAmount)}\nDate: ${donation.paymentDate ? new Date(donation.paymentDate).toLocaleDateString("en-IN") : ""}\n\nThank you for your generous donation!`;

//     // Mobile path — unchanged, this one genuinely works end-to-end
//     if (isMobileDevice()) {
//       try {
//         const blob = await captureReceiptAsBlob();
//         if (!blob) throw new Error("Could not capture receipt");
//         const file = new File([blob], `receipt-${donation.receiptNumber}.png`, {
//           type: "image/png",
//         });
//         if (navigator.canShare?.({ files: [file] })) {
//           await navigator.share({
//             files: [file],
//             title: "Donation Receipt",
//             text,
//           });
//           return;
//         }
//       } catch (err) {
//         if ((err as Error)?.name !== "AbortError") {
//           toast.error("Failed to prepare receipt for sharing");
//         }
//         return;
//       }
//     }

//     // Desktop path — open the WhatsApp Web tab FIRST, synchronously,
//     // while we still have a trusted user-gesture. Do the slow screenshot
//     // + clipboard work AFTER, using the already-open window reference.
//     const phone = donation.mobile ? `91${donation.mobile}` : "";
//     const waWindow = window.open(
//       `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
//       "_blank",
//     );

//     if (!waWindow) {
//       toast.error(
//         "Popup blocked — please allow popups for this site and try again.",
//       );
//       return;
//     }

//     try {
//       const blob = await captureReceiptAsBlob();
//       if (!blob) throw new Error("Could not capture receipt");

//       if (
//         navigator.clipboard &&
//         "write" in navigator.clipboard &&
//         typeof ClipboardItem !== "undefined"
//       ) {
//         await navigator.clipboard.write([
//           new ClipboardItem({ "image/png": blob }),
//         ]);
//         toast.success("✅ Receipt image copied to clipboard!", {
//           description:
//             "In the WhatsApp tab: click INSIDE the message box, then press Ctrl+V (or Cmd+V on Mac) to attach it.",
//           duration: 10000,
//         });
//       } else {
//         throw new Error("Clipboard image write not supported");
//       }
//     } catch (err) {
//       console.error("Clipboard copy failed:", err);
//       toast.error("Couldn't copy the image automatically.", {
//         description:
//           "Use the Image button below to download it, then attach manually in WhatsApp.",
//         duration: 8000,
//       });
//     }
//   };

//   const handleDownloadImage = async () => {
//     if (!donation) return;
//     try {
//       const blob = await captureReceiptAsBlob();
//       if (!blob) throw new Error("Could not capture receipt");
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `receipt-${donation.receiptNumber}.png`;
//       link.click();
//       URL.revokeObjectURL(url);
//     } catch {
//       toast.error("Failed to download receipt image");
//     }
//   };

//   const handleShare = async () => {
//     if (!donation) return;
//     const shareText = `Receipt ${donation.receiptNumber} — ${donation.donorName} — ${formatCurrency(donation.receivedAmount)}`;
//     if (navigator.share) {
//       try {
//         await navigator.share({ title: "Donation Receipt", text: shareText });
//       } catch {
//         // user cancelled share — no action needed
//       }
//     } else {
//       await navigator.clipboard.writeText(shareText);
//       toast.success("Receipt details copied to clipboard");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="mx-auto max-w-md space-y-4">
//         <Skeleton className="h-8 w-32" />
//         <Skeleton className="h-[520px] rounded-2xl" />
//       </div>
//     );
//   }

//   if (error || !donation) {
//     return (
//       <div className="mx-auto max-w-md">
//         <Alert variant="destructive">
//           <AlertDescription>{error || "Receipt not found"}</AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-md space-y-4 pb-6">
//       <div className="no-print flex items-center justify-between">
//         <Button variant="ghost" size="sm">
//           <Link
//             to={`${basePath}/${donation._id}`}
//             className="flex items-center"
//           >
//             <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
//           </Link>
//         </Button>
//       </div>

//       <ReceiptCard donation={donation} />

//       <div className="no-print grid grid-cols-2 gap-2 sm:grid-cols-4">
//         <Button variant="outline" className="h-11" onClick={handlePrint}>
//           <Download className="mr-1.5 h-4 w-4" /> PDF
//         </Button>
//         <Button
//           variant="outline"
//           className="h-11"
//           onClick={handleDownloadImage}
//         >
//           <Download className="mr-1.5 h-4 w-4" /> Image
//         </Button>
//         <Button
//           variant="outline"
//           className="h-11 text-green-700 cursor-pointer"
//           onClick={handleWhatsApp}
//         >
//           <FaWhatsapp className="ml-1.5 h-4 w-4" /> WhatsApp
//         </Button>
//         <Button variant="outline" className="h-11" onClick={handleShare}>
//           <Share2 className="mr-1.5 h-4 w-4" /> Share
//         </Button>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Share2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { ReceiptPreview } from "@/features/receipts/ReceiptPreview";
import { getReceiptByDonationApi } from "@/api/receiptApi";
import { captureReceiptAsBlob } from "@/lib/receiptImage";
import { donationToReceiptData } from "@/lib/receiptAdapter";
import { isMobileDevice } from "@/lib/isMobileDevice";
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

  const handleDownloadImage = async () => {
    if (!donation) return;
    try {
      const blob = await captureReceiptAsBlob();
      if (!blob) throw new Error("Could not capture receipt");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${donation.receiptNumber}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download receipt image");
    }
  };

  const handleWhatsApp = async () => {
    if (!donation) return;

    const text = `🙏 गणपती बाप्पा मोरया\n\nश्री पावणारा गणपती गणेश मंडळ, धाराशिव\n\nReceipt No: ${donation.receiptNumber}\nDonor: ${donation.donorName}\nAmount: ${formatCurrency(donation.receivedAmount)}\nDate: ${donation.paymentDate ? new Date(donation.paymentDate).toLocaleDateString("en-IN") : ""}\n\nThank you for your generous donation!`;

    // Mobile — native share sheet with the image attached
    if (isMobileDevice()) {
      try {
        const blob = await captureReceiptAsBlob();
        if (!blob) throw new Error("Could not capture receipt");
        const file = new File([blob], `receipt-${donation.receiptNumber}.png`, {
          type: "image/png",
        });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Donation Receipt",
            text,
          });
          return;
        }
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          toast.error("Failed to prepare receipt for sharing");
        }
        return;
      }
    }

    // Desktop — open WhatsApp Web synchronously first (trusted click),
    // then copy the image to clipboard so the user can paste it in.
    const phone = donation.mobile ? `91${donation.mobile}` : "";
    const waWindow = window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
      "_blank",
    );

    if (!waWindow) {
      toast.error(
        "Popup blocked — please allow popups for this site and try again.",
      );
      return;
    }

    try {
      const blob = await captureReceiptAsBlob();
      if (!blob) throw new Error("Could not capture receipt");

      if (
        navigator.clipboard &&
        "write" in navigator.clipboard &&
        typeof ClipboardItem !== "undefined"
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success("✅ Receipt image copied to clipboard!", {
          description:
            "In the WhatsApp tab: click INSIDE the message box, then press Ctrl+V to attach it.",
          duration: 10000,
        });
      } else {
        throw new Error("Clipboard image write not supported");
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      toast.error("Couldn't copy the image automatically.", {
        description:
          "Use the Image button below to download it, then attach manually in WhatsApp.",
        duration: 8000,
      });
    }
  };

  const handleShare = async () => {
    if (!donation) return;
    const shareText = `Receipt ${donation.receiptNumber} — ${donation.donorName} — ${formatCurrency(donation.receivedAmount)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Donation Receipt", text: shareText });
      } catch {
        // user cancelled — no action needed
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

  if (donation.paymentStatus !== "PAID" || !donation.receiptGenerated) {
    return (
      <div className="mx-auto max-w-md">
        <Alert variant="destructive">
          <AlertDescription>
            A receipt is only available once this donation is fully Paid and a
            receipt has been generated.
          </AlertDescription>
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

      <ReceiptPreview data={donationToReceiptData(donation)} />

      <div className="no-print grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button variant="outline" className="h-11" onClick={handlePrint}>
          <Download className="mr-1.5 h-4 w-4" /> PDF
        </Button>
        <Button
          variant="outline"
          className="h-11"
          onClick={handleDownloadImage}
        >
          <Download className="mr-1.5 h-4 w-4" /> Image
        </Button>
        <Button
          variant="outline"
          className="h-11 text-green-700"
          onClick={handleWhatsApp}
        >
          <FaWhatsapp className="mr-1.5 h-4 w-4" /> WhatsApp
        </Button>
        <Button variant="outline" className="h-11" onClick={handleShare}>
          <Share2 className="mr-1.5 h-4 w-4" /> Share
        </Button>
      </div>
    </div>
  );
}
