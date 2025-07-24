"use client";
import { CapacityChart } from "@/components/dashboard/analytics/capacity-chart";
import { TemperatureTrends } from "@/components/dashboard/analytics/temperature-trends";
import { VoltageAnalysis } from "@/components/dashboard/analytics/voltage-analysis";
import { DegradationPatterns } from "@/components/dashboard/analytics/degradation-patterns";

export default function AnalyticsPage() {
  // Mock data - replace with real API calls
  const capacityData = [
    { cycle: 1, actual: 2.0, physicsModel: 2.0, hybridTwin: 2.0 },
    { cycle: 50, actual: 1.95, physicsModel: 1.93, hybridTwin: 1.94 },
    { cycle: 100, actual: 1.88, physicsModel: 1.85, hybridTwin: 1.87 },
    { cycle: 150, actual: 1.82, physicsModel: 1.78, hybridTwin: 1.81 },
  ];

  const temperatureData = [
    { cycle: 1, temperature: 25, ambient: 24 },
    { cycle: 50, temperature: 26, ambient: 24 },
    { cycle: 100, temperature: 27, ambient: 25 },
    { cycle: 150, temperature: 28, ambient: 25 },
  ];

  const voltageData = [
    { cycle: 1, voltage: 4.2, current: -2.0 },
    { cycle: 50, voltage: 4.1, current: -2.1 },
    { cycle: 100, voltage: 4.0, current: -2.2 },
    { cycle: 150, voltage: 3.9, current: -2.3 },
  ];

  const degradationData = [
    { cycle: 50, degradationRate: 0.1, capacity: 1.95 },
    { cycle: 100, degradationRate: 0.15, capacity: 1.88 },
    { cycle: 150, degradationRate: 0.2, capacity: 1.82 },
    { cycle: 200, degradationRate: 0.25, capacity: 1.75 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Battery Analytics</h1>
        <p className="text-gray-600">Detailed analysis of battery performance and degradation patterns</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CapacityChart data={capacityData} />
        <TemperatureTrends data={temperatureData} />
        <VoltageAnalysis data={voltageData} />
        <DegradationPatterns data={degradationData} />
      </div>
    </div>
  );
}
