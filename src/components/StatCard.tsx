import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBg?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconBg = "bg-primary/10 text-primary",
}: StatCardProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="flex flex-col items-center gap-1.5 p-1 text-center sm:flex-row sm:items-center sm:gap-3 sm:p-4 sm:text-left">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconBg}`}
        >
          <Icon size={16} className="sm:hidden" />
          <Icon size={20} className="hidden sm:block" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] leading-tight text-muted-foreground sm:text-xs">
            {label}
          </p>
          <p className="truncate text-base font-semibold leading-tight sm:text-lg">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
