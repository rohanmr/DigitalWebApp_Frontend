import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddVolunteerForm } from "@/features/volunteers/AddVolunteerForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function AddVolunteerPage() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-md">
      <div className="no-print flex items-center mb-2 justify-between">
        <Button variant="ghost" size="sm">
          <Link to="/admin/volunteers" className="flex items-center">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Link>
        </Button>
      </div>
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
