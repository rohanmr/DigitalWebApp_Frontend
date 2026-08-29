import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { markDonationAsPaidApi } from "@/api/donationApi";
import { formatCurrency } from "@/lib/format";
import type { Donation } from "@/types/donation";

const markPaidSchema = z.object({
  receivedAmount: z.coerce.number().positive("Enter a valid amount"),
  paymentMode: z.enum(["CASH", "UPI", "OTHER"], {
    error: "Select a payment mode",
  }),
  paymentDate: z.string().min(1, "Payment date is required"),
});

type MarkPaidFormInput = z.input<typeof markPaidSchema>;
type MarkPaidFormValues = z.output<typeof markPaidSchema>;

const today = new Date().toISOString().split("T")[0];

interface MarkPaidDialogProps {
  donation: Donation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function MarkPaidDialog({
  donation,
  open,
  onOpenChange,
  onSuccess,
}: MarkPaidDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MarkPaidFormInput, unknown, MarkPaidFormValues>({
    resolver: zodResolver(markPaidSchema),
    defaultValues: {
      receivedAmount: donation.remainingAmount,
      paymentDate: today,
    },
  });

  const receivedAmount = Number(watch("receivedAmount") || 0);
  const newTotal =
    donation.receivedAmount +
    (Number.isFinite(receivedAmount) ? receivedAmount : 0);
  const newRemaining = Math.max(donation.promisedAmount - newTotal, 0);

  const onSubmit = async (values: MarkPaidFormValues) => {
    try {
      await markDonationAsPaidApi(donation._id, values);
      toast.success(
        newRemaining === 0
          ? "Donation marked as fully paid"
          : "Payment updated successfully",
      );
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update payment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {donation.paymentStatus === "PENDING"
              ? "Mark as Paid"
              : "Add Payment"}
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-lg bg-muted p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Promised</span>
            <span className="font-medium">
              {formatCurrency(donation.promisedAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Already Received</span>
            <span className="font-medium">
              {formatCurrency(donation.receivedAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-medium text-amber-700">
              {formatCurrency(donation.remainingAmount)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receivedAmount">Received Now</Label>
            <Input
              id="receivedAmount"
              type="number"
              inputMode="numeric"
              className="h-11"
              {...register("receivedAmount")}
            />
            {errors.receivedAmount && (
              <p className="text-sm text-destructive">
                {errors.receivedAmount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select
              onValueChange={(v) =>
                setValue("paymentMode", v as any, { shouldValidate: true })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.paymentMode && (
              <p className="text-sm text-destructive">
                {errors.paymentMode.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input
              id="paymentDate"
              type="date"
              className="h-11"
              {...register("paymentDate")}
            />
          </div>

          <div className="rounded-lg border p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">New Received</span>
              <span className="font-medium">{formatCurrency(newTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">New Remaining</span>
              <span
                className={`font-medium ${newRemaining === 0 ? "text-green-700" : "text-amber-700"}`}
              >
                {formatCurrency(newRemaining)}
              </span>
            </div>
            {newRemaining === 0 && (
              <p className="mt-1 text-xs font-medium text-green-700">
                Donation Fully Paid → Receipt Available
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Mark as Paid"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
