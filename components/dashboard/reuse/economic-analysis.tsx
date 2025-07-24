"use client";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface EconomicData {
  application: string;
  value: number;
  cost: number;
  profit: number;
}

interface EconomicAnalysisProps {
  data: EconomicData[];
}

export function EconomicAnalysis({ data }: EconomicAnalysisProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Economic Value Analysis</h3>
      
      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="application" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" name="Market Value" />
            <Bar dataKey="cost" fill="#ef4444" name="Processing Cost" />
            <Bar dataKey="profit" fill="#10b981" name="Net Profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Market Value</p>
          <p className="text-lg font-semibold text-blue-600">
            ₹{data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-gray-600">Processing Costs</p>
          <p className="text-lg font-semibold text-red-600">
            ₹{data.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Net Profit</p>
          <p className="text-lg font-semibold text-green-600">
            ₹{data.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}
