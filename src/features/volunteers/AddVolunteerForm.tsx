import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  addVolunteerSchema,
  type AddVolunteerFormValues,
} from "@/features/volunteers/volunteerSchema";
import { createVolunteerApi } from "@/api/volunteerApi";

function passwordStrength(password: string): {
  label: string;
  className: string;
} {
  if (!password) return { label: "", className: "" };
  if (password.length < 6)
    return { label: "Too short", className: "text-destructive" };
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [hasNumber, hasUpper, hasSpecial].filter(Boolean).length;
  if (score >= 2) return { label: "Strong", className: "text-green-600" };
  if (score === 1) return { label: "Medium", className: "text-amber-600" };
  return { label: "Weak", className: "text-destructive" };
}

interface AddVolunteerFormProps {
  onSuccess: () => void;
}

export function AddVolunteerForm({ onSuccess }: AddVolunteerFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddVolunteerFormValues>({
    resolver: zodResolver(addVolunteerSchema),
  });

  const password = watch("password") || "";
  const strength = passwordStrength(password);

  const onSubmit = async (values: AddVolunteerFormValues) => {
    setServerError(null);
    try {
      const res = await createVolunteerApi({
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
      });
      toast.success(res.message || "Volunteer created successfully");
      onSuccess();
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message || "Failed to create volunteer",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          className="h-11"
          placeholder="e.g. Mahesh Patil"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          className="h-11"
          placeholder="mahesh@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input
          id="mobile"
          className="h-11"
          placeholder="9876543210"
          {...register("mobile")}
        />
        {errors.mobile && (
          <p className="text-sm text-destructive">{errors.mobile.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="h-11 pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {password && (
          <p className={`text-xs font-medium ${strength.className}`}>
            {strength.label}
          </p>
        )}
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          className="h-11"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
          </>
        ) : (
          "Create Volunteer"
        )}
      </Button>
    </form>
  );
}
