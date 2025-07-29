"use client";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TemperatureData {
  cycle: number;
  temperature: number;
  ambient: number;
}

interface TemperatureTrendsProps {
  data: TemperatureData[];
}

export function TemperatureTrends({ data }: TemperatureTrendsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cycle vs Min Voltage Charge</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle" />
            <YAxis label={{ value: 'Min Voltage (V)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="temperature" 
              stackId="1"
              stroke="#f59e0b" 
              fill="#fbbf24"
              name="Min Voltage (Measured)"
            />
            <Area 
              type="monotone" 
              dataKey="ambient" 
              stackId="2"
              stroke="#6b7280" 
              fill="#9ca3af"
              name="Min Voltage (Predicted)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
