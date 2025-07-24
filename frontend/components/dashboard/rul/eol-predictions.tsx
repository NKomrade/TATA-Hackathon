"use client";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, AlertTriangle } from "lucide-react";

interface EolPrediction {
  predictedCycle: number;
  currentCycle: number;
  daysRemaining: number;
  confidence: number;
}

interface EolPredictionsProps {
  prediction: EolPrediction;
}

export function EolPredictions({ prediction }: EolPredictionsProps) {
  const cyclesRemaining = prediction.predictedCycle - prediction.currentCycle;
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">End-of-Life Predictions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Cycles Remaining</p>
          <p className="text-2xl font-semibold text-orange-600">
            {cyclesRemaining}
          </p>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Days Remaining</p>
          <p className="text-2xl font-semibold text-blue-600">
            {prediction.daysRemaining}
          </p>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Confidence</p>
          <p className="text-2xl font-semibold text-green-600">
            {prediction.confidence}%
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Predictions based on current usage patterns and hybrid digital twin model. 
          Actual EOL may vary depending on operating conditions.
        </p>
      </div>
    </Card>
  );
}
