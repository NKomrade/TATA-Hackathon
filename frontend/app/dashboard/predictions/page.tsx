"use client";
import { PredictionPanel } from "@/components/dashboard/predictions/prediction-panel";
import { ModelAccuracy } from "@/components/dashboard/predictions/model-accuracy";
import { ForecastCharts } from "@/components/dashboard/predictions/forecast-charts";

export default function PredictionsPage() {
  const accuracyData = {
    mae: 0.004,
    rmse: 0.008,
    r2: 0.96,
    mape: 2.1
  };

  const forecastData = [
    { cycle: 200, predicted: 1.7, upperBound: 1.8, lowerBound: 1.6 },
    { cycle: 250, predicted: 1.6, upperBound: 1.7, lowerBound: 1.5 },
    { cycle: 300, predicted: 1.5, upperBound: 1.6, lowerBound: 1.4 },
    { cycle: 350, predicted: 1.4, upperBound: 1.5, lowerBound: 1.3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Predictions</h1>
        <p className="text-gray-600">AI-powered battery lifecycle predictions and forecasting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PredictionPanel />
        <ModelAccuracy accuracy={accuracyData} />
        <div className="lg:col-span-3">
          <ForecastCharts data={forecastData} />
        </div>
      </div>
    </div>
  );
}
