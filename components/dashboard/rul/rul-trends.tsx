"use client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface RulTrendData {
  cycle: number;
  rul: number;
}

interface RulTrendsProps {
  data: RulTrendData[];
}

export function RulTrends({ data }: RulTrendsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">RUL Trend Analysis</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle" />
            <YAxis />
            <Tooltip />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="5 5" />
            <Line 
              type="monotone" 
              dataKey="rul" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Remaining Useful Life"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
