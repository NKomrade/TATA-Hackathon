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
import { LucideIcon } from "lucide-react";

export interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Battery Analytics",
    href: "/dashboard/analytics",
    icon: Battery,
  },
  {
    label: "Predictions",
    href: "/dashboard/predictions",
    icon: TrendingUp,
  },
  {
    label: "RUL Modeling",
    href: "/dashboard/rul",
    icon: Clock,
  },
  {
    label: "Reuse Recommendations",
    href: "/dashboard/reuse",
    icon: Recycle,
  },
  {
    label: "Data Management",
    href: "/dashboard/data",
    icon: Database,
  },
  {
    label: "Model Training",
    href: "/dashboard/training",
    icon: Brain,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
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
