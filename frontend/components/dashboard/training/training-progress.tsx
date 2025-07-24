"use client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TrainingData {
  epoch: number;
  loss: number;
  valLoss: number;
  mae: number;
  valMae: number;
}

interface TrainingProgressProps {
  data: TrainingData[];
}

export function TrainingProgress({ data }: TrainingProgressProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Training Progress</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Loss</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="loss" stroke="#2563eb" name="Training Loss" />
                <Line type="monotone" dataKey="valLoss" stroke="#dc2626" name="Validation Loss" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Mean Absolute Error</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="mae" stroke="#059669" name="Training MAE" />
                <Line type="monotone" dataKey="valMae" stroke="#f59e0b" name="Validation MAE" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
