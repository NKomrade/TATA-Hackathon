"use client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ModelAccuracyProps {
  accuracy: {
    mae: number;
    rmse: number;
    r2: number;
    mape: number;
  };
}

export function ModelAccuracy({ accuracy }: ModelAccuracyProps) {
  const metrics = [
    {
      name: "Mean Absolute Error (MAE)",
      value: accuracy.mae,
      unit: "Ah",
      progress: Math.max(0, 100 - (accuracy.mae * 100))
    },
    {
      name: "Root Mean Square Error (RMSE)",
      value: accuracy.rmse,
      unit: "Ah",
      progress: Math.max(0, 100 - (accuracy.rmse * 100))
    },
    {
      name: "R² Score",
      value: accuracy.r2,
      unit: "",
      progress: accuracy.r2 * 100
    },
    {
      name: "Mean Absolute Percentage Error (MAPE)",
      value: accuracy.mape,
      unit: "%",
      progress: Math.max(0, 100 - accuracy.mape)
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Model Accuracy Metrics</h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{metric.name}</span>
              <span className="text-sm text-gray-600">
                {metric.value.toFixed(4)} {metric.unit}
              </span>
            </div>
            <Progress value={metric.progress} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
}
