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
  editVolunteerSchema,
  type EditVolunteerFormValues,
} from "@/features/volunteers/volunteerSchema";
import { updateVolunteerApi } from "@/api/volunteerApi";
import type { Volunteer } from "@/types/volunteer";

interface EditVolunteerFormProps {
  volunteer: Volunteer;
  onSuccess: () => void;
}

export function EditVolunteerForm({
  volunteer,
  onSuccess,
}: EditVolunteerFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditVolunteerFormValues>({
    resolver: zodResolver(editVolunteerSchema),
    defaultValues: {
      name: volunteer.name,
      email: volunteer.email,
      mobile: volunteer.mobile,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: EditVolunteerFormValues) => {
    setServerError(null);
    try {
      const res = await updateVolunteerApi(volunteer._id, {
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        ...(values.password ? { password: values.password } : {}),
      });
      toast.success(res.message || "Volunteer updated successfully");
      onSuccess();
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message || "Failed to update volunteer",
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
        <Input id="name" className="h-11" {...register("name")} />
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
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input id="mobile" className="h-11" {...register("mobile")} />
        {errors.mobile && (
          <p className="text-sm text-destructive">{errors.mobile.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          New Password (leave blank to keep current)
        </Label>
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
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
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

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}
