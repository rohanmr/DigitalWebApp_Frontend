import { Outlet, NavLink, useLocation } from "react-router-dom";
import { volunteerBottomNavItems } from "@/layouts/navConfig";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/features/auth/AuthContext";

export function VolunteerLayout() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-primary px-4 text-primary-foreground">
        <div>
          <p className="text-sm text-primary-foreground/80">नमस्कार,</p>
          <p className="font-semibold leading-tight">{user?.name}</p>
        </div>
        <UserMenu />
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto p-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex w-full max-w-2xl border-t bg-card">
        {volunteerBottomNavItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs ${
                isActive ? "text-primary" : "text-muted-foreground"
              } ${location.pathname.startsWith(item.url) ? "font-medium" : ""}`
            }
          >
            <item.icon size={22} />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
