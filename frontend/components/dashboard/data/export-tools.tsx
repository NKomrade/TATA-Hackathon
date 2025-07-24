"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Image } from "lucide-react";
import { useState } from "react";

export function ExportTools() {
  const [exportFormat, setExportFormat] = useState("");
  const [exportType, setExportType] = useState("");

  const handleExport = () => {
    console.log(`Exporting ${exportType} as ${exportFormat}`);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Export Tools</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Export Type</label>
          <Select value={exportType} onValueChange={setExportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select what to export..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="data">Raw Data</SelectItem>
              <SelectItem value="predictions">Predictions</SelectItem>
              <SelectItem value="charts">Charts</SelectItem>
              <SelectItem value="report">Full Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Format</label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleExport}
          disabled={!exportType || !exportFormat}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            CSV
          </Button>
          <Button variant="outline" size="sm">
            <Image className="h-4 w-4 mr-1" />
            PNG
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>
        </div>
      </div>
    </Card>
  );
}
