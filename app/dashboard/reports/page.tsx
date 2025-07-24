"use client";
import { ReportGenerator } from "@/components/dashboard/reports/report-generator";
import { PdfExporter } from "@/components/dashboard/reports/pdf-exporter";
import { AnalyticsSummary } from "@/components/dashboard/reports/analytics-summary";

export default function ReportsPage() {
  const summaryData = {
    totalBatteries: 24,
    averageSoH: 87.3,
    predictionsGenerated: 156,
    modelsTrained: 8,
    lastUpdated: "2 hours ago"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Generate comprehensive reports and export data for stakeholders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReportGenerator />
        <PdfExporter />
        <AnalyticsSummary data={summaryData} />
      </div>
    </div>
  );
}
