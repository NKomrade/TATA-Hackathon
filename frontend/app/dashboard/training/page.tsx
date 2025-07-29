"use client";
import { ModelTrainer } from "@/components/dashboard/training/model-trainer";
import { TrainingProgress } from "@/components/dashboard/training/training-progress";
import { ModelComparison } from "@/components/dashboard/training/model-comparison";

export default function TrainingPage() {
  const trainingData = [
    { epoch: 1, loss: 0.1, valLoss: 0.12, mae: 0.08, valMae: 0.09 },
    { epoch: 10, loss: 0.05, valLoss: 0.06, mae: 0.04, valMae: 0.045 },
    { epoch: 20, loss: 0.03, valLoss: 0.035, mae: 0.025, valMae: 0.028 },
    { epoch: 30, loss: 0.02, valLoss: 0.025, mae: 0.018, valMae: 0.02 },
  ];

  const models = [
    { name: "LSTM", mae: 0.004, rmse: 0.008, r2: 0.96, trainingTime: 120, status: "trained" as const },
    { name: "XGBoost", mae: 0.006, rmse: 0.01, r2: 0.94, trainingTime: 45, status: "trained" as const },
    { name: "Simulated annealing", mae: 0.008, rmse: 0.012, r2: 0.92, trainingTime: 30, status: "trained" as const },
    { name: "AdaBoost", mae: 0.003, rmse: 0.006, r2: 0.98, trainingTime: 180, status: "training" as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Model Training</h1>
        <p className="text-gray-600">Train and compare different machine learning models for battery analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ModelTrainer />
        <div className="lg:col-span-2">
          <TrainingProgress data={trainingData} />
        </div>
        <div className="lg:col-span-3">
          <ModelComparison models={models} />
        </div>
      </div>
    </div>
  );
}
