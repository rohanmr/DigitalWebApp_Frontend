import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EditVolunteerForm } from "@/features/volunteers/EditVolunteerForm";
import { getVolunteerByIdApi } from "@/api/volunteerApi";
import type { Volunteer } from "@/types/volunteer";

export function EditVolunteerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getVolunteerByIdApi(id);
      setVolunteer(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load volunteer");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (error || !volunteer) {
    return (
      <div className="mx-auto max-w-md">
        <Alert variant="destructive">
          <AlertDescription>{error || "Volunteer not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="border-none shadow-sm sm:border sm:shadow-none">
        <CardHeader>
          <CardTitle>Edit Volunteer</CardTitle>
        </CardHeader>
        <CardContent>
          <EditVolunteerForm
            volunteer={volunteer}
            onSuccess={() => navigate("/admin/volunteers")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
