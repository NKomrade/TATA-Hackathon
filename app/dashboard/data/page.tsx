"use client";
import { BatterySelector } from "@/components/dashboard/data/battery-selector";
import { DataUpload } from "@/components/dashboard/data/data-upload";
import { DataViewer } from "@/components/dashboard/data/data-viewer";
import { ExportTools } from "@/components/dashboard/data/export-tools";
import { useState } from "react";

export default function DataPage() {
  const [selectedBattery, setSelectedBattery] = useState("");

  const batteries = [
    { id: "B0005", name: "Battery B0005", status: "active" as const, capacity: 1.85, cycles: 150 },
    { id: "B0045", name: "Battery B0045", status: "degraded" as const, capacity: 1.62, cycles: 280 },
    { id: "B0046", name: "Battery B0046", status: "active" as const, capacity: 1.78, cycles: 120 },
    { id: "B0047", name: "Battery B0047", status: "eol" as const, capacity: 1.45, cycles: 450 },
  ];

  const sampleData = [
    { cycle: 1, capacity: 2.0, voltage: 4.2, current: -2.0, temperature: 25.0 },
    { cycle: 2, capacity: 1.998, voltage: 4.19, current: -2.01, temperature: 25.2 },
    { cycle: 3, capacity: 1.996, voltage: 4.18, current: -2.02, temperature: 25.1 },
    { cycle: 4, capacity: 1.994, voltage: 4.17, current: -2.01, temperature: 25.3 },
    { cycle: 5, capacity: 1.992, voltage: 4.16, current: -2.03, temperature: 25.2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
        <p className="text-gray-600">Upload, view, and manage battery datasets for analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BatterySelector 
          batteries={batteries}
          selectedBattery={selectedBattery}
          onSelectBattery={setSelectedBattery}
        />
        <DataUpload />
        <div className="lg:col-span-2">
          <DataViewer data={sampleData} />
        </div>
        <ExportTools />
      </div>
    </div>
  );
}
