"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function RulCalculator() {
  const [eolThreshold, setEolThreshold] = useState(80);
  const [currentCycle, setCurrentCycle] = useState(100);
  const [calculatedRul, setCalculatedRul] = useState<number | null>(null);

  const calculateRul = () => {
    // Simulated RUL calculation
    const estimatedRul = Math.max(0, 500 - currentCycle - (100 - eolThreshold) * 10);
    setCalculatedRul(estimatedRul);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">RUL Calculator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            End-of-Life Threshold (% of initial capacity)
          </label>
          <Input
            type="number"
            value={eolThreshold}
            onChange={(e) => setEolThreshold(Number(e.target.value))}
            min={50}
            max={90}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Current Cycle Number
          </label>
          <Input
            type="number"
            value={currentCycle}
            onChange={(e) => setCurrentCycle(Number(e.target.value))}
            min={1}
          />
        </div>

        <Button onClick={calculateRul} className="w-full">
          Calculate RUL
        </Button>

        {calculatedRul !== null && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Estimated Remaining Useful Life</p>
            <p className="text-2xl font-semibold text-blue-600">
              {calculatedRul} cycles
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
