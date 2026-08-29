import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { adminNavItems, adminBottomNavItems } from "@/layouts/navConfig";
import { UserMenu } from "@/components/UserMenu";
import { getActiveNavUrl } from "@/lib/navActive";

const adminNavUrls = adminNavItems.map((i) => i.url);
const adminBottomNavUrls = adminBottomNavItems.map((i) => i.url);

// Rendered as a child of SidebarProvider so it can call useSidebar()
function AdminSidebarNav({ activeUrl }: { activeUrl: string | null }) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
            🕉️
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold leading-tight">पवनारा गणपती</p>
            <p className="text-xs text-sidebar-foreground/70">
              गणेश मंडळ, धाराशिव
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.url} className="my-1">
                  <SidebarMenuButton
                    isActive={item.url === activeUrl}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      className={"flex items-center gap-2"}
                      onClick={handleNavClick}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function AdminLayout() {
  const location = useLocation();

  const activeUrl = getActiveNavUrl(location.pathname, adminNavUrls);
  const activeBottomUrl = getActiveNavUrl(
    location.pathname,
    adminBottomNavUrls,
  );

  const pageTitle =
    adminNavItems.find((item) => item.url === activeUrl)?.title ?? "Dashboard";

  return (
    <SidebarProvider>
      <AdminSidebarNav activeUrl={activeUrl} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          </div>
          <UserMenu />
        </header>

        <main className="flex-1 overflow-y-auto bg-background p-4 pb-20 md:pb-4">
          <Outlet />
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t bg-card md:hidden">
          {adminBottomNavItems.map((item) => {
            const isActive = item.url === activeBottomUrl;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon size={20} />
                {item.title}
              </NavLink>
            );
          })}
        </nav>
      </SidebarInset>
    </SidebarProvider>
  );
}
