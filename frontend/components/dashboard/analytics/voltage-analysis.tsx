"use client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface VoltageData {
  cycle: number;
  voltage: number;
  current: number;
}

interface VoltageAnalysisProps {
  data: VoltageData[];
}

export function VoltageAnalysis({ data }: VoltageAnalysisProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cycle vs Max Voltage Charge</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle" />
            <YAxis label={{ value: 'Max Voltage (V)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="voltage" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Max Voltage (Measured)"
            />
            <Line 
              type="monotone" 
              dataKey="current" 
              stroke="#f59e0b" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Max Voltage (Predicted)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
