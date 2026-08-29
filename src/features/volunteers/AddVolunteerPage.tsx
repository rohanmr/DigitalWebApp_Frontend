import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddVolunteerForm } from "@/features/volunteers/AddVolunteerForm";

export function AddVolunteerPage() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-md">
      <Card className="border-none shadow-sm sm:border sm:shadow-none">
        <CardHeader>
          <CardTitle>Add Volunteer</CardTitle>
        </CardHeader>
        <CardContent>
          <AddVolunteerForm onSuccess={() => navigate("/admin/volunteers")} />
        </CardContent>
      </Card>
    </div>
  );
}
