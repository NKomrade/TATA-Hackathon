"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

interface DataRow {
  cycle: number;
  capacity: number;
  voltage: number;
  current: number;
  temperature: number;
}

interface DataViewerProps {
  data: DataRow[];
}

export function DataViewer({ data }: DataViewerProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Data Viewer</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Cycle</th>
              <th className="text-left p-2">Capacity (Ah)</th>
              <th className="text-left p-2">Voltage (V)</th>
              <th className="text-left p-2">Current (A)</th>
              <th className="text-left p-2">Temperature (°C)</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2">{row.cycle}</td>
                <td className="p-2">{row.capacity.toFixed(3)}</td>
                <td className="p-2">{row.voltage.toFixed(3)}</td>
                <td className="p-2">{row.current.toFixed(3)}</td>
                <td className="p-2">{row.temperature.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length > 10 && (
        <p className="text-sm text-gray-500 mt-2">
          Showing 10 of {data.length} rows. Click "View All" to see more.
        </p>
      )}
    </Card>
  );
}
