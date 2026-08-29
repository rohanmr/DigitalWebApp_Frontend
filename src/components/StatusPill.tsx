import { Badge } from "@/components/ui/badge";

export function StatusPill({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant="outline"
      className={isActive ? "status-active" : "status-inactive"}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}
