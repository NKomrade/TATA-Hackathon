"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalyticsSummaryData {
  totalBatteries: number;
  averageSoH: number;
  predictionsGenerated: number;
  modelsTrained: number;
  lastUpdated: string;
}

interface AnalyticsSummaryProps {
  data: AnalyticsSummaryData;
}

export function AnalyticsSummary({ data }: AnalyticsSummaryProps) {
  const summaryItems = [
    {
      label: "Total Batteries Analyzed",
      value: data.totalBatteries,
      unit: "",
      color: "bg-blue-500"
    },
    {
      label: "Average State of Health",
      value: data.averageSoH,
      unit: "%",
      color: data.averageSoH > 80 ? "bg-green-500" : "bg-yellow-500"
    },
    {
      label: "Predictions Generated",
      value: data.predictionsGenerated,
      unit: "",
      color: "bg-purple-500"
    },
    {
      label: "Models Trained",
      value: data.modelsTrained,
      unit: "",
      color: "bg-orange-500"
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Analytics Summary</h3>
        <Badge variant="outline">
          Last updated: {data.lastUpdated}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {summaryItems.map((item, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`w-12 h-12 ${item.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">
                {item.value}
              </span>
            </div>
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="text-lg font-semibold">
              {item.value}{item.unit}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Key Insights</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Battery performance is within expected parameters</li>
          <li>• 3 batteries recommended for second-life applications</li>
          <li>• Model accuracy improved by 15% in last training cycle</li>
        </ul>
      </div>
    </Card>
  );
}
