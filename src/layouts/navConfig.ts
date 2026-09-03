import {
  LayoutDashboard,
  HandCoins,
  PlusCircle,
  Users,
  Settings,
  User,
  type LucideIcon,
  ReceiptText,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const adminNavItems: NavItem[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Donations", url: "/admin/donations", icon: HandCoins },
  { title: "Add Donation", url: "/admin/donations/add", icon: PlusCircle },
  { title: "Volunteers", url: "/admin/volunteers", icon: Users },
  { title: "Receipts", url: "/admin/receipts", icon: ReceiptText },
  // { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export const volunteerNavItems: NavItem[] = [
  { title: "Dashboard", url: "/volunteer/dashboard", icon: LayoutDashboard },
  { title: "Add Donation", url: "/volunteer/donations/add", icon: PlusCircle },
  { title: "My Donations", url: "/volunteer/donations", icon: HandCoins },
  { title: "Receipts", url: "/volunteer/receipts", icon: ReceiptText },
  { title: "Profile", url: "/volunteer/profile", icon: User },
];

// Bottom nav is a curated subset (max 5 items fit comfortably on mobile)
export const volunteerBottomNavItems: NavItem[] = [
  { title: "Home", url: "/volunteer/dashboard", icon: LayoutDashboard },
  { title: "Add", url: "/volunteer/donations/add", icon: PlusCircle },
  { title: "My Donations", url: "/volunteer/donations", icon: HandCoins },
  { title: "Profile", url: "/volunteer/profile", icon: User },
];

export const adminBottomNavItems: NavItem[] = [
  { title: "Home", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Donations", url: "/admin/donations", icon: HandCoins },
  { title: "Add", url: "/admin/donations/add", icon: PlusCircle },
  { title: "Profile", url: "/admin/profile", icon: User },

  // { title: "Reports", url: "/admin/reports", icon: BarChart3 },
];
