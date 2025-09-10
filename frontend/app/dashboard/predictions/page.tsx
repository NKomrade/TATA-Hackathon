"use client";

import { ModelAccuracy } from "@/components/dashboard/predictions/model-accuracy";
import { ForecastCharts } from "@/components/dashboard/predictions/forecast-charts";
import { RulCalculator } from "@/components/dashboard/predictions/rul-calculator";
import { EolPredictions } from "@/components/dashboard/predictions/eol-predictions";
import { RulTrends } from "@/components/dashboard/predictions/rul-trends";

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

  const rulData = [
    { cycle: 150, rul: 350 },
    { cycle: 200, rul: 300 },
    { cycle: 250, rul: 250 },
    { cycle: 300, rul: 200 },
    { cycle: 350, rul: 150 },
    { cycle: 400, rul: 100 },
    { cycle: 450, rul: 50 },
    { cycle: 500, rul: 0 },
  ];

  const eolPrediction = {
    predictedCycle: 500,
    currentCycle: 150,
    daysRemaining: 175,
    confidence: 85
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Predictions</h1>
        <p className="text-gray-600">AI-powered battery lifecycle predictions, forecasting, and remaining useful life analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RulCalculator />
        <EolPredictions prediction={eolPrediction} />
        <ModelAccuracy accuracy={accuracyData} />
        <div className="lg:col-span-4">
          <ForecastCharts data={forecastData} />
        </div>
        <div className="lg:col-span-4">
          <RulTrends data={rulData} />
        </div>
      </div>
    </div>
  );
}
