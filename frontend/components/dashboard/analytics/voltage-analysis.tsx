"use client";
import { Card } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
      <h3 className="text-lg font-semibold mb-4">Voltage-Current Analysis</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="voltage" name="Voltage (V)" />
            <YAxis dataKey="current" name="Current (A)" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter dataKey="current" fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
