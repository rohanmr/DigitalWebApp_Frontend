import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  PlusCircle,
  Pencil,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatDate } from "@/lib/format";
import { getVolunteersApi, updateVolunteerStatusApi } from "@/api/volunteerApi";
import type { Volunteer } from "@/types/volunteer";

export function VolunteersListPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusTarget, setStatusTarget] = useState<Volunteer | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getVolunteersApi();
      setVolunteers(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load volunteers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return volunteers;
    return volunteers.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.mobile.includes(q),
    );
  }, [volunteers, search]);

  const stats = useMemo(
    () => ({
      total: volunteers.length,
      active: volunteers.filter((v) => v.isActive).length,
      inactive: volunteers.filter((v) => !v.isActive).length,
    }),
    [volunteers],
  );

  const handleToggleStatus = async () => {
    if (!statusTarget) return;
    setIsUpdatingStatus(true);
    try {
      const res = await updateVolunteerStatusApi(
        statusTarget._id,
        !statusTarget.isActive,
      );
      toast.success(res.message);
      setVolunteers((prev) =>
        prev.map((v) =>
          v._id === statusTarget._id ? { ...v, isActive: !v.isActive } : v,
        ),
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
      setStatusTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Volunteers" value={String(stats.total)} icon={Users} />
        <StatCard
          label="Active"
          value={String(stats.active)}
          icon={UserCheck}
          iconBg="bg-green-100 text-green-700"
        />
        <StatCard
          label="Inactive"
          value={String(stats.inactive)}
          icon={UserX}
          iconBg="bg-gray-100 text-gray-600"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9"
          />
        </div>
        <Button className="h-10">
          <Link to="/admin/volunteers/add" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Volunteer
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center text-sm text-muted-foreground">
              No volunteers found.
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((v) => (
                      <TableRow key={v._id}>
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell>{v.email}</TableCell>
                        <TableCell>{v.mobile}</TableCell>
                        <TableCell>
                          <StatusPill isActive={v.isActive} />
                        </TableCell>
                        <TableCell>{formatDate(v.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-3">
                            <Switch
                              checked={v.isActive}
                              onCheckedChange={() => setStatusTarget(v)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Link to={`/admin/volunteers/${v._id}/edit`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 md:hidden">
                {filtered.map((v) => (
                  <Card key={v._id} className="border shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{v.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {v.mobile}
                          </p>
                        </div>
                        <StatusPill isActive={v.isActive} />
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {v.email}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Active
                          </span>
                          <Switch
                            checked={v.isActive}
                            onCheckedChange={() => setStatusTarget(v)}
                          />
                        </div>
                        <Button variant="outline" size="default">
                          <Link
                            to={`/admin/volunteers/${v._id}/edit`}
                            className="flex items-center"
                          >
                            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!statusTarget}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        title={
          statusTarget?.isActive
            ? "Deactivate Volunteer?"
            : "Activate Volunteer?"
        }
        description={
          statusTarget?.isActive
            ? `${statusTarget?.name} will no longer be able to log in or collect donations.`
            : `${statusTarget?.name} will regain access to log in and collect donations.`
        }
        confirmLabel={statusTarget?.isActive ? "Deactivate" : "Activate"}
        destructive={statusTarget?.isActive}
        isLoading={isUpdatingStatus}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
}
