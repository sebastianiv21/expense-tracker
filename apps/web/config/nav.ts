import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Tag,
  BarChart3,
  User,
} from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Budgets",
    href: "/budgets",
    icon: PieChart,
  },
  {
    label: "Insights",
    href: "/insights",
    icon: BarChart3,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
] as const;

export const bottomNavItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Budgets",
    href: "/budgets",
    icon: PieChart,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
] as const;
