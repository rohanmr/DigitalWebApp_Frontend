import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { PaymentStatusTabs } from "@/features/donations/PaymentStatusTabs";
import {
  donationSchema,
  paymentModeEnum,
  type DonationFormInput,
  type DonationFormValues,
} from "@/features/donations/donationSchema";
import { createDonationApi } from "@/api/donationApi";

const today = new Date().toISOString().split("T")[0];

const paymentModeLabels: Record<(typeof paymentModeEnum)[number], string> = {
  CASH: "Cash",
  UPI: "UPI",
  OTHER: "Other",
};

interface AddDonationFormProps {
  onSuccess?: () => void;
}

export function AddDonationForm({ onSuccess }: AddDonationFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormInput, unknown, DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      paymentStatus: "PENDING",
      entryDate: today,
    },
  });

  const paymentStatus = watch("paymentStatus");
  const promisedAmount = watch("promisedAmount");

  const onSubmit = async (values: DonationFormValues) => {
    try {
      const res = await createDonationApi(values);
      toast.success(res.message || "Donation added successfully");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(-1);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save donation");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Donor Information */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Donor Information
        </h3>

        <div className="space-y-2">
          <Label htmlFor="donorName">Donor Name</Label>
          <Input
            id="donorName"
            className="h-11"
            placeholder="e.g. Ajay Patil"
            {...register("donorName")}
          />
          {errors.donorName && (
            <p className="text-sm text-destructive">
              {errors.donorName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              className="h-11"
              placeholder="9876543210"
              {...register("mobile")}
            />
            {errors.mobile && (
              <p className="text-sm text-destructive">
                {errors.mobile.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address (optional)</Label>
            <Input
              id="address"
              className="h-11"
              placeholder="Area, Dharashiv"
              {...register("address")}
            />
          </div>
        </div>
      </section>

      {/* Donation Information */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Donation Information
        </h3>

        <div className="space-y-2">
          <Label htmlFor="promisedAmount">Amount (₹)</Label>
          <Input
            id="promisedAmount"
            type="number"
            inputMode="numeric"
            className="h-11"
            placeholder="2001"
            {...register("promisedAmount")}
          />
          {errors.promisedAmount && (
            <p className="text-sm text-destructive">
              {errors.promisedAmount.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Payment Status</Label>
          <PaymentStatusTabs
            value={paymentStatus}
            onChange={(v) =>
              setValue("paymentStatus", v, { shouldValidate: true })
            }
          />
        </div>

        {/* Dynamic fields */}
        {paymentStatus === "PAID" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="receivedAmount">Received Amount</Label>
              <Input
                id="receivedAmount"
                type="number"
                inputMode="numeric"
                className="h-11"
                placeholder={
                  promisedAmount ? String(promisedAmount) : "Same as amount"
                }
                {...register("receivedAmount")}
              />
              {errors.receivedAmount && (
                <p className="text-sm text-destructive">
                  {errors.receivedAmount.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                type="date"
                className="h-11"
                defaultValue={today}
                {...register("paymentDate")}
              />
            </div>
          </div>
        )}

        {paymentStatus === "PENDING" && (
          <div className="space-y-2">
            <Label htmlFor="expectedPaymentDate">Expected Payment Date</Label>
            <Input
              id="expectedPaymentDate"
              type="date"
              className="h-11"
              {...register("expectedPaymentDate")}
            />
            {errors.expectedPaymentDate && (
              <p className="text-sm text-destructive">
                {errors.expectedPaymentDate.message}
              </p>
            )}
          </div>
        )}

        {paymentStatus === "PARTIALLY_PAID" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="receivedAmount">Received Amount</Label>
              <Input
                id="receivedAmount"
                type="number"
                inputMode="numeric"
                className="h-11"
                placeholder="1001"
                {...register("receivedAmount")}
              />
              {errors.receivedAmount && (
                <p className="text-sm text-destructive">
                  {errors.receivedAmount.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedPaymentDate">Next Expected Date</Label>
              <Input
                id="expectedPaymentDate"
                type="date"
                className="h-11"
                {...register("expectedPaymentDate")}
              />
            </div>
          </div>
        )}

        {(paymentStatus === "PAID" || paymentStatus === "PARTIALLY_PAID") && (
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
                {paymentModeEnum.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {paymentModeLabels[mode]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMode && (
              <p className="text-sm text-destructive">
                {errors.paymentMode.message}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Remarks */}
      <section className="space-y-2">
        <Label htmlFor="remarks">Remarks (optional)</Label>
        <Textarea
          id="remarks"
          rows={3}
          placeholder="Any notes about this donation..."
          {...register("remarks")}
        />
      </section>

      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            Please fix the highlighted fields before saving.
          </AlertDescription>
        </Alert>
      )}

      {/* Desktop save button (mobile uses sticky bar in the page wrapper) */}
      <div className="hidden sm:block">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Donation"
          )}
        </Button>
      </div>

      {/* Mobile sticky save button */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card p-4 sm:hidden">
        <Button type="submit" disabled={isSubmitting} className="h-12 w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Donation"
          )}
        </Button>
      </div>

      {/* Spacer so content isn't hidden behind sticky bar on mobile */}
      <div className="h-16 sm:hidden" />
    </form>
  );
}
