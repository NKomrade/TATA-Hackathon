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
      <h3 className="text-lg font-semibold mb-4">Temperature Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="temperature" 
              stackId="1"
              stroke="#f59e0b" 
              fill="#fbbf24"
              name="Battery Temperature"
            />
            <Area 
              type="monotone" 
              dataKey="ambient" 
              stackId="2"
              stroke="#6b7280" 
              fill="#9ca3af"
              name="Ambient Temperature"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
