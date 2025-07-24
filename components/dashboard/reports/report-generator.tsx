"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download } from "lucide-react";
import { useState } from "react";

export function ReportGenerator() {
  const [reportType, setReportType] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

  const reportSections = [
    { id: "overview", label: "Executive Summary" },
    { id: "analytics", label: "Battery Analytics" },
    { id: "predictions", label: "Prediction Results" },
    { id: "rul", label: "RUL Analysis" },
    { id: "reuse", label: "Reuse Recommendations" },
    { id: "economic", label: "Economic Analysis" }
  ];

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const generateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 3000);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Report Generator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="executive">Executive Report</SelectItem>
              <SelectItem value="technical">Technical Analysis</SelectItem>
              <SelectItem value="maintenance">Maintenance Report</SelectItem>
              <SelectItem value="custom">Custom Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Include Sections</label>
          <div className="space-y-2">
            {reportSections.map((section) => (
              <div key={section.id} className="flex items-center space-x-2">
                <Checkbox
                  id={section.id}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => handleSectionToggle(section.id)}
                />
                <label htmlFor={section.id} className="text-sm">
                  {section.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={generateReport}
          disabled={!reportType || selectedSections.length === 0 || generating}
          className="w-full"
        >
          <FileText className="h-4 w-4 mr-2" />
          {generating ? "Generating..." : "Generate Report"}
        </Button>

        {generating && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Generating report...</p>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
