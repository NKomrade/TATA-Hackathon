import React from "react";
import { 
  LayoutDashboard, 
  Battery, 
  TrendingUp, 
  Clock, 
  Recycle, 
  Database, 
  Brain, 
  FileText, 
  Settings 
} from "lucide-react";

export interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactElement;
}

export const sidebarLinks: SidebarLink[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: React.createElement(LayoutDashboard, { className: "h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" }),
  },
  {
    label: "Battery Analytics",
    href: "/dashboard/analytics",
    icon: React.createElement(Battery, { className: "h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" }),
  },
  {
    label: "Predictions",
    href: "/dashboard/predictions",
    icon: React.createElement(TrendingUp, { className: "h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" }),
  },
  {
    label: "RUL Modeling",
    href: "/dashboard/rul",
    icon: React.createElement(Clock, { className: "h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" }),
  },
  {
    label: "Reuse Recommendations",
    href: "/dashboard/reuse",
    icon: React.createElement(Recycle, { className: "h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" }),
  },
  {
    label: "Data Management",
    href: "/dashboard/data",
    icon: React.createElement(Database, { className: "h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" }),
  },
  {
    label: "Model Training",
    href: "/dashboard/training",
    icon: React.createElement(Brain, { className: "h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" }),
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: React.createElement(FileText, { className: "h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" }),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: React.createElement(Settings, { className: "h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" }),
  },
];

export const quickActions = [
  {
    label: "Upload Battery Data",
    href: "/dashboard/data",
    description: "Import new battery datasets"
  },
  {
    label: "Run Prediction",
    href: "/dashboard/predictions",
    description: "Generate new predictions"
  },
  {
    label: "Train Model",
    href: "/dashboard/training",
    description: "Start model training"
  },
  {
    label: "Generate Report",
    href: "/dashboard/reports",
    description: "Create analysis report"
  }
];
