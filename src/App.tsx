import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { LoginPage } from "@/features/auth/LoginPage";
import { AdminLayout } from "@/layouts/AdminLayout";
import { VolunteerLayout } from "@/layouts/VolunteerLayout";
import { AdminDashboardPage } from "./features/dashboard/AdminDashboardPage";
import { DonationsListPage } from "./features/donations/DonationsListPage";
import { AddDonationPage } from "./features/donations/AddDonationPage";
import { DonationDetailsPage } from "./features/donations/DonationDetailsPage";
import { EditDonationPage } from "./features/donations/EditDonationPage";
import { VolunteersListPage } from "./features/volunteers/VolunteersListPage";
import { AddVolunteerPage } from "./features/volunteers/AddVolunteerPage";
import { EditVolunteerPage } from "./features/volunteers/EditVolunteerPage";
import { ReceiptsListPage } from "./features/receipts/ReceiptsListPage";
import { ReceiptPreviewPage } from "./features/receipts/ReceiptPreviewPage";
import { ProfilePage } from "./features/profile/ProfilePage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { VolunteerDashboardPage } from "./features/dashboard/VolunteerDashboardPage";

// Temporary placeholders — replaced page by page in upcoming steps
function Placeholder({ label }: { label: string }) {
  return <div className="p-4 text-muted-foreground">{label} — coming soon</div>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route
                path="/admin/donations"
                element={
                  <DonationsListPage
                    basePath="/admin/donations"
                    addDonationUrl="/admin/donations/add"
                  />
                }
              />
              <Route
                path="/admin/donations/add"
                element={<AddDonationPage redirectTo="/admin/donations" />}
              />
              <Route
                path="/admin/donations/:id"
                element={<DonationDetailsPage basePath="/admin/donations" />}
              />
              <Route
                path="/admin/donations/:id/edit"
                element={<EditDonationPage basePath="/admin/donations" />}
              />
              <Route
                path="/admin/volunteers"
                element={<VolunteersListPage />}
              />
              <Route
                path="/admin/volunteers/add"
                element={<AddVolunteerPage />}
              />
              <Route
                path="/admin/volunteers/:id/edit"
                element={<EditVolunteerPage />}
              />
              <Route
                path="/admin/receipts"
                element={
                  <ReceiptsListPage
                    basePath="/admin/receipts"
                    donationsBasePath="/admin/donations"
                  />
                }
              />
              <Route
                path="/admin/receipts/:id"
                element={<ReceiptPreviewPage basePath="/admin/donations" />}
              />
              <Route path="/admin/profile" element={<ProfilePage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Volunteer */}
          <Route element={<ProtectedRoute allowedRoles={["volunteer"]} />}>
            <Route element={<VolunteerLayout />}>
              <Route
                path="/volunteer/dashboard"
                element={<VolunteerDashboardPage />}
              />
              <Route
                path="/volunteer/donations"
                element={
                  <DonationsListPage
                    basePath="/volunteer/donations"
                    addDonationUrl="/volunteer/donations/add"
                  />
                }
              />
              <Route
                path="/volunteer/donations/add"
                element={<AddDonationPage redirectTo="/volunteer/donations" />}
              />
              <Route
                path="/volunteer/donations/:id"
                element={
                  <DonationDetailsPage basePath="/volunteer/donations" />
                }
              />
              <Route
                path="/volunteer/donations/:id/edit"
                element={<EditDonationPage basePath="/volunteer/donations" />}
              />
              <Route
                path="/volunteer/receipts"
                element={
                  <ReceiptsListPage
                    basePath="/volunteer/receipts"
                    donationsBasePath="/volunteer/donations"
                  />
                }
              />
              <Route
                path="/volunteer/receipts/:id"
                element={<ReceiptPreviewPage basePath="/volunteer/donations" />}
              />
              <Route path="/volunteer/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route
            path="/unauthorized"
            element={<div className="p-8">Unauthorized</div>}
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
