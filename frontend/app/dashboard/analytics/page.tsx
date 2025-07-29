"use client";
import { CapacityChart } from "@/components/dashboard/analytics/capacity-chart";
import { TemperatureTrends } from "@/components/dashboard/analytics/temperature-trends";
import { VoltageAnalysis } from "@/components/dashboard/analytics/voltage-analysis";
import { DegradationPatterns } from "@/components/dashboard/analytics/degradation-patterns";

export default function AnalyticsPage() {
  // Mock data for RUL analysis
  const rulData = [
    { cycle: 1, actual: 500, physicsModel: 500, hybridTwin: 500 },
    { cycle: 50, actual: 450, physicsModel: 445, hybridTwin: 448 },
    { cycle: 100, actual: 400, physicsModel: 390, hybridTwin: 398 },
    { cycle: 150, actual: 350, physicsModel: 335, hybridTwin: 348 },
    { cycle: 200, actual: 300, physicsModel: 280, hybridTwin: 298 },
    { cycle: 250, actual: 250, physicsModel: 225, hybridTwin: 248 },
    { cycle: 300, actual: 200, physicsModel: 170, hybridTwin: 198 },
  ];

  // Mock data for min voltage charge analysis
  const minVoltageData = [
    { cycle: 1, temperature: 3.8, ambient: 3.75 },
    { cycle: 50, temperature: 3.78, ambient: 3.73 },
    { cycle: 100, temperature: 3.75, ambient: 3.7 },
    { cycle: 150, temperature: 3.72, ambient: 3.67 },
    { cycle: 200, temperature: 3.68, ambient: 3.63 },
    { cycle: 250, temperature: 3.65, ambient: 3.6 },
    { cycle: 300, temperature: 3.6, ambient: 3.55 },
  ];

  // Mock data for max voltage charge analysis
  const maxVoltageData = [
    { cycle: 1, voltage: 4.2, current: 4.18 },
    { cycle: 50, voltage: 4.19, current: 4.16 },
    { cycle: 100, voltage: 4.17, current: 4.14 },
    { cycle: 150, voltage: 4.15, current: 4.12 },
    { cycle: 200, voltage: 4.12, current: 4.09 },
    { cycle: 250, voltage: 4.1, current: 4.07 },
    { cycle: 300, voltage: 4.07, current: 4.04 },
  ];

  // Mock data for degradation rate
  const degradationData = [
    { cycle: 50, degradationRate: 0.1, capacity: 1.95 },
    { cycle: 100, degradationRate: 0.15, capacity: 1.88 },
    { cycle: 150, degradationRate: 0.2, capacity: 1.82 },
    { cycle: 200, degradationRate: 0.25, capacity: 1.75 },
    { cycle: 250, degradationRate: 0.3, capacity: 1.68 },
    { cycle: 300, degradationRate: 0.35, capacity: 1.6 },
  ];

  return (
    <div className="w-full space-y-4 min-h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CapacityChart data={rulData} />
        <TemperatureTrends data={minVoltageData} />
        <VoltageAnalysis data={maxVoltageData} />
        <DegradationPatterns data={degradationData} />
      </div>
    </div>
  );
}
