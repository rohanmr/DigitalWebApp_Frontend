import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddDonationForm } from "@/features/donations/AddDonationForm";

interface AddDonationPageProps {
  redirectTo: string; // "/admin/donations" | "/volunteer/donations"
}

export function AddDonationPage({ redirectTo }: AddDonationPageProps) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-none shadow-sm sm:border sm:shadow-none">
        <CardHeader className="hidden sm:block">
          <CardTitle>Add Donation</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:px-6">
          <AddDonationForm onSuccess={() => navigate(redirectTo)} />
        </CardContent>
      </Card>
    </div>
  );
}
