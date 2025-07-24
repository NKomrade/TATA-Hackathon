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
      <h3 className="text-lg font-semibold mb-4">Capacity Analysis - Model Comparison</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#2563eb" 
              strokeWidth={2}
              name="Experimental Data"
            />
            <Line 
              type="monotone" 
              dataKey="physicsModel" 
              stroke="#059669" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Physics Model"
            />
            <Line 
              type="monotone" 
              dataKey="hybridTwin" 
              stroke="#dc2626" 
              strokeWidth={2}
              name="Hybrid Digital Twin"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
