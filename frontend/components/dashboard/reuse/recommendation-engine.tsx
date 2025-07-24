"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recycle, Home, Zap, Sun } from "lucide-react";

interface ReuseRecommendation {
  application: string;
  minCapacity: number;
  estimatedValue: number;
  description: string;
  icon: React.ReactNode;
  suitable: boolean;
}

interface RecommendationEngineProps {
  currentCapacity: number;
  initialCapacity: number;
}

export function RecommendationEngine({ currentCapacity, initialCapacity }: RecommendationEngineProps) {
  const soh = (currentCapacity / initialCapacity) * 100;
  
  const recommendations: ReuseRecommendation[] = [
    {
      application: "EV/High Load Storage",
      minCapacity: initialCapacity * 0.9,
      estimatedValue: 25000,
      description: "Suitable for electric vehicles and high-demand applications",
      icon: <Zap className="h-5 w-5" />,
      suitable: currentCapacity >= initialCapacity * 0.9
    },
    {
      application: "Home Inverter/UPS",
      minCapacity: initialCapacity * 0.8,
      estimatedValue: 15000,
      description: "Perfect for home backup power and UPS systems",
      icon: <Home className="h-5 w-5" />,
      suitable: currentCapacity >= initialCapacity * 0.8
    },
    {
      application: "Solar Street Light",
      minCapacity: initialCapacity * 0.65,
      estimatedValue: 8000,
      description: "Ideal for solar lighting and low-power applications",
      icon: <Sun className="h-5 w-5" />,
      suitable: currentCapacity >= initialCapacity * 0.65
    },
    {
      application: "Recycle",
      minCapacity: 0,
      estimatedValue: 2000,
      description: "Material recovery and proper disposal",
      icon: <Recycle className="h-5 w-5" />,
      suitable: true
    }
  ];

  const bestRecommendation = recommendations.find(r => r.suitable);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Reuse Recommendations</h3>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Current State of Health</p>
        <p className="text-2xl font-semibold text-blue-600">{soh.toFixed(1)}%</p>
      </div>

      {bestRecommendation && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            {bestRecommendation.icon}
            <h4 className="font-semibold text-green-800">Recommended: {bestRecommendation.application}</h4>
          </div>
          <p className="text-sm text-green-700 mb-2">{bestRecommendation.description}</p>
          <p className="text-sm font-medium text-green-800">
            Estimated Value: ₹{bestRecommendation.estimatedValue.toLocaleString()}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-medium">All Applications</h4>
        {recommendations.map((rec, index) => (
          <div key={index} className={`p-3 rounded-lg border ${rec.suitable ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {rec.icon}
                <span className="font-medium">{rec.application}</span>
                <Badge variant={rec.suitable ? "default" : "secondary"}>
                  {rec.suitable ? "Suitable" : "Not Suitable"}
                </Badge>
              </div>
              <span className="text-sm text-gray-600">
                ₹{rec.estimatedValue.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
