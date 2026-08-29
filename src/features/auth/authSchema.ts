import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or mobile number is required")
    .refine(
      (val) => /^\S+@\S+\.\S+$/.test(val) || /^[6-9]\d{9}$/.test(val),
      "Enter a valid email or 10-digit mobile number",
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
