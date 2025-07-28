"use client";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DegradationData {
  cycle: number;
  degradationRate: number;
  capacity: number;
}

interface DegradationPatternsProps {
  data: DegradationData[];
}

export function DegradationPatterns({ data }: DegradationPatternsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Degradation Rate Patterns</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="degradationRate" fill="#ef4444" name="Degradation Rate (%/cycle)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
