"use client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CapacityChartData {
  cycle: number;
  actual: number;
  physicsModel: number;
  hybridTwin: number;
}

interface CapacityChartProps {
  data: CapacityChartData[];
}

export function CapacityChart({ data }: CapacityChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cycle vs RUL Analysis - Model Comparison</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle" />
            <YAxis label={{ value: 'Remaining Useful Life (cycles)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#2563eb" 
              strokeWidth={2}
              name="Experimental RUL"
            />
            <Line 
              type="monotone" 
              dataKey="physicsModel" 
              stroke="#059669" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Physics Model RUL"
            />
            <Line 
              type="monotone" 
              dataKey="hybridTwin" 
              stroke="#dc2626" 
              strokeWidth={2}
              name="Hybrid Digital Twin RUL"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
