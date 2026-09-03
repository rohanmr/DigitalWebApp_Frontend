import { Outlet, NavLink, useLocation } from "react-router-dom";
import { volunteerBottomNavItems } from "@/layouts/navConfig";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/features/auth/AuthContext";
import { getActiveNavUrl } from "@/lib/navActive";

const volunteerBottomNavUrls = volunteerBottomNavItems.map((i) => i.url);

export function VolunteerLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const activeUrl = getActiveNavUrl(location.pathname, volunteerBottomNavUrls);

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-primary px-4 text-primary-foreground">
        <div>
          <p className="text-sm text-primary-foreground/80">Welcome,</p>
          <p className="font-semibold leading-tight">{user?.name}</p>
        </div>
        <UserMenu />
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto p-4 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex w-full max-w-2xl border-t bg-card">
        {volunteerBottomNavItems.map((item) => {
          const isActive = item.url === activeUrl;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs ${
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              <item.icon size={22} />
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
