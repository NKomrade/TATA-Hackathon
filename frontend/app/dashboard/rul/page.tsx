"use client";
import { RulCalculator } from "@/components/dashboard/rul/rul-calculator";
import { RulTrends } from "@/components/dashboard/rul/rul-trends";
import { EolPredictions } from "@/components/dashboard/rul/eol-predictions";

export default function RulPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Remaining Useful Life</h1>
        <p className="text-gray-600">Predict and analyze battery remaining useful life and end-of-life scenarios</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RulCalculator />
        <EolPredictions prediction={eolPrediction} />
        <div className="lg:col-span-3">
          <RulTrends data={rulData} />
        </div>
      </div>
    </div>
  );
}
