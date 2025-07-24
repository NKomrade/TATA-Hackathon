"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Download, Upload, RefreshCw } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      label: "Run Prediction",
      icon: Play,
      onClick: () => console.log("Running prediction..."),
      variant: "default" as const
    },
    {
      label: "Upload Data",
      icon: Upload,
      onClick: () => console.log("Uploading data..."),
      variant: "outline" as const
    },
    {
      label: "Export Report",
      icon: Download,
      onClick: () => console.log("Exporting report..."),
      variant: "outline" as const
    },
    {
      label: "Refresh Model",
      icon: RefreshCw,
      onClick: () => console.log("Refreshing model..."),
      variant: "outline" as const
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            onClick={action.onClick}
            className="flex items-center gap-2"
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
