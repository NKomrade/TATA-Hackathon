"use client";
import { RecommendationEngine } from "@/components/dashboard/reuse/recommendation-engine";
import { ApplicationMatcher } from "@/components/dashboard/reuse/application-matcher";
import { EconomicAnalysis } from "@/components/dashboard/reuse/economic-analysis";

export default function ReusePage() {
  const economicData = [
    { application: "EV Storage", value: 25000, cost: 5000, profit: 20000 },
    { application: "Home UPS", value: 15000, cost: 3000, profit: 12000 },
    { application: "Solar Light", value: 8000, cost: 2000, profit: 6000 },
    { application: "Recycle", value: 2000, cost: 1000, profit: 1000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reuse Recommendations</h1>
        <p className="text-gray-600">Smart recommendations for battery second-life applications and circular economy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecommendationEngine currentCapacity={1.65} initialCapacity={2.0} />
        <ApplicationMatcher />
        <div className="lg:col-span-2">
          <EconomicAnalysis data={economicData} />
        </div>
      </div>
    </div>
  );
}
