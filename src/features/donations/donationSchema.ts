import { z } from "zod";

export const paymentModeEnum = ["CASH", "UPI", "OTHER"] as const;
export const paymentStatusEnum = ["PAID", "PENDING", "PARTIALLY_PAID"] as const;

export const donationSchema = z
  .object({
    donorName: z.string().min(2, "Donor name is required"),
    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    address: z.string().optional(),
    promisedAmount: z.coerce
      .number({ error: "Amount is required" })
      .positive("Amount must be greater than 0"),
    paymentStatus: z.enum(paymentStatusEnum),
    receivedAmount: z.coerce.number().optional(),
    paymentMode: z.enum(paymentModeEnum).optional(),
    entryDate: z.string().min(1, "Entry date is required"),
    expectedPaymentDate: z.string().optional(),
    paymentDate: z.string().optional(),
    remarks: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const promised = data.promisedAmount;

    if (data.paymentStatus === "PAID") {
      if (!data.paymentMode) {
        ctx.addIssue({
          code: "custom",
          path: ["paymentMode"],
          message: "Payment mode is required",
        });
      }
      if (
        data.receivedAmount !== undefined &&
        data.receivedAmount !== promised
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["receivedAmount"],
          message: "Paid donation must have full received amount",
        });
      }
    }

    if (data.paymentStatus === "PARTIALLY_PAID") {
      if (data.receivedAmount === undefined || data.receivedAmount <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["receivedAmount"],
          message: "Received amount is required",
        });
      } else if (data.receivedAmount >= promised) {
        ctx.addIssue({
          code: "custom",
          path: ["receivedAmount"],
          message: "Received amount must be less than promised amount",
        });
      }
      if (!data.paymentMode) {
        ctx.addIssue({
          code: "custom",
          path: ["paymentMode"],
          message: "Payment mode is required",
        });
      }
    }

    if (data.paymentStatus === "PENDING") {
      if (!data.expectedPaymentDate) {
        ctx.addIssue({
          code: "custom",
          path: ["expectedPaymentDate"],
          message: "Expected payment date is required",
        });
      }
    }
  });

export type DonationFormInput = z.input<typeof donationSchema>;
export type DonationFormValues = z.output<typeof donationSchema>;
