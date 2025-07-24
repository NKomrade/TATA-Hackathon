"use client";
import { usePathname } from "next/navigation";

interface Breadcrumb {
  label: string;
  href: string;
  isLast?: boolean;
}

export function useActiveRoute() {
  const pathname = usePathname();
  
  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard Overview";
      case "/dashboard/analytics":
        return "Battery Analytics";
      case "/dashboard/predictions":
        return "Predictions";
      case "/dashboard/rul":
        return "RUL Modeling";
      case "/dashboard/reuse":
        return "Reuse Recommendations";
      case "/dashboard/data":
        return "Data Management";
      case "/dashboard/training":
        return "Model Training";
      case "/dashboard/reports":
        return "Reports";
      case "/dashboard/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [{ label: "Home", href: "/" }];
    
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        label,
        href: currentPath,
        isLast: index === segments.length - 1
      });
    });

    return breadcrumbs;
  };

  return {
    isActiveRoute,
    getPageTitle,
    getBreadcrumbs,
    currentPath: pathname
  };
}

export function formatRoute(route: string): string {
  return route
    .split("/")
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" > ");
}

export function getRouteIcon(route: string) {
  const iconMap: Record<string, string> = {
    "/dashboard": "LayoutDashboard",
    "/dashboard/analytics": "Battery",
    "/dashboard/predictions": "TrendingUp",
    "/dashboard/rul": "Clock",
    "/dashboard/reuse": "Recycle",
    "/dashboard/data": "Database",
    "/dashboard/training": "Brain",
    "/dashboard/reports": "FileText",
    "/dashboard/settings": "Settings"
  };
  
  return iconMap[route] || "Circle";
}
