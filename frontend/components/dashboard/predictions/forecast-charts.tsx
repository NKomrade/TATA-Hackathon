"use client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface ForecastData {
  cycle: number;
  predicted: number;
  upperBound: number;
  lowerBound: number;
}

interface ForecastChartsProps {
  data: ForecastData[];
}

export function ForecastCharts({ data }: ForecastChartsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Capacity Forecast with Confidence Intervals</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="upperBound"
              stackId="1"
              stroke="none"
              fill="#ddd6fe"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="lowerBound"
              stackId="1"
              stroke="none"
              fill="#ffffff"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#7c3aed"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
