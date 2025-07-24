"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Settings } from "lucide-react";
import { useState } from "react";

export function PdfExporter() {
  const [template, setTemplate] = useState("");
  const [orientation, setOrientation] = useState("portrait");

  const handleExport = () => {
    console.log("Exporting PDF...");
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">PDF Export</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Template</label>
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Select template..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Report</SelectItem>
              <SelectItem value="detailed">Detailed Analysis</SelectItem>
              <SelectItem value="summary">Executive Summary</SelectItem>
              <SelectItem value="presentation">Presentation Format</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Orientation</label>
          <Select value={orientation} onValueChange={setOrientation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleExport} disabled={!template} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 border rounded-lg text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-xs text-gray-600">Preview</p>
          </div>
          <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-xs text-gray-500">Template preview will appear here</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
