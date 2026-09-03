import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  KeyRound,
  LogOut,
  Wallet,
  Clock,
  HandCoins,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { StatCard } from "@/components/StatCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EditProfileDialog } from "@/features/profile/EditProfileDialog";
import { ChangePasswordDialog } from "@/features/profile/ChangePasswordDialog";
import { useAuth } from "@/features/auth/AuthContext";
import { getDonationsApi } from "@/api/donationApi";
import { formatCurrency, formatDate } from "@/lib/format";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const [stats, setStats] = useState<{
    received: number;
    pending: number;
    count: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== "volunteer") return;
    setStatsLoading(true);
    getDonationsApi({ limit: 1000 })
      .then((res) => {
        const received = res.data.reduce((sum, d) => sum + d.receivedAmount, 0);
        const pending = res.data.reduce((sum, d) => sum + d.remainingAmount, 0);
        setStats({ received, pending, count: res.pagination.total });
      })
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, [user?.role]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mx-auto max-w-xl space-y-4 pb-6">
      <Card className="border-none shadow-sm">
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm capitalize text-muted-foreground">
              {user.role}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="flex justify-between py-2 text-sm">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-muted-foreground">Mobile</span>
            <span className="font-medium">{user.mobile}</span>
          </div>
          {user.createdAt && (
            <div className="flex justify-between py-2 text-sm">
              <span className="text-muted-foreground">Joined</span>
              <span className="font-medium">{formatDate(user.createdAt)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {user.role === "volunteer" && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
            My Collection
          </h3>
          {statsLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[76px] rounded-xl" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                label="Received"
                value={formatCurrency(stats.received)}
                icon={Wallet}
                iconBg="bg-green-100 text-green-700"
              />
              <StatCard
                label="Pending"
                value={formatCurrency(stats.pending)}
                icon={Clock}
                iconBg="bg-amber-100 text-amber-700"
              />
              <StatCard
                label="Donations"
                value={String(stats.count)}
                icon={HandCoins}
              />
            </div>
          ) : null}
        </div>
      )}

      <div className="space-y-2">
        <Button
          variant="outline"
          className="h-11 w-full justify-start cursor-pointer"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
        <Button
          variant="outline"
          className="h-11 w-full justify-start cursor-pointer"
          onClick={() => setPasswordOpen(true)}
        >
          <KeyRound className="mr-2 h-4 w-4" /> Change Password
        </Button>
        <Button
          variant="outline"
          className="h-11 w-full justify-start border-destructive cursor-pointer text-destructive hover:bg-destructive/10"
          onClick={() => setLogoutOpen(true)}
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      <EditProfileDialog
        user={user}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={(updatedUser) => {
          localStorage.setItem("gvms_user", JSON.stringify(updatedUser));
          window.location.reload(); // simplest reliable refresh of AuthContext's cached state
        }}
      />
      <ChangePasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
      />
      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Logout?"
        description="You'll need to log in again to access your account."
        confirmLabel="Logout"
        destructive
        onConfirm={handleLogout}
      />
    </div>
  );
}
