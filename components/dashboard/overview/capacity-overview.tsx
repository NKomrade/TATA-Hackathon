"use client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CapacityData {
  cycle: number;
  capacity: number;
  predicted: number;
}

interface CapacityOverviewProps {
  data: CapacityData[];
}

export function CapacityOverview({ data }: CapacityOverviewProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Capacity Degradation Overview</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="capacity" 
              stroke="#2563eb" 
              strokeWidth={2}
              name="Actual Capacity"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#dc2626" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted Capacity"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
