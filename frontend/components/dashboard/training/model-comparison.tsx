"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ModelMetrics {
  name: string;
  mae: number;
  rmse: number;
  r2: number;
  trainingTime: number;
  status: 'trained' | 'training' | 'failed';
}

interface ModelComparisonProps {
  models: ModelMetrics[];
}

export function ModelComparison({ models }: ModelComparisonProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trained': return 'bg-green-500';
      case 'training': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Model Comparison</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Model</th>
              <th className="text-left p-3">MAE</th>
              <th className="text-left p-3">RMSE</th>
              <th className="text-left p-3">R²</th>
              <th className="text-left p-3">Training Time</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{model.name}</td>
                <td className="p-3">{model.mae.toFixed(4)}</td>
                <td className="p-3">{model.rmse.toFixed(4)}</td>
                <td className="p-3">{model.r2.toFixed(4)}</td>
                <td className="p-3">{model.trainingTime}s</td>
                <td className="p-3">
                  <Badge className={getStatusColor(model.status)}>
                    {model.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
