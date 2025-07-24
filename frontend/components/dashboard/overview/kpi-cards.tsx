"use client";
import { Card } from "@/components/ui/card";
import { Battery, Clock, Thermometer, TrendingDown } from "lucide-react";

interface KpiData {
  capacity: number;
  soh: number;
  rul: number;
  temperature: number;
}

interface KpiCardsProps {
  data: KpiData;
}

export function KpiCards({ data }: KpiCardsProps) {
  const cards = [
    {
      title: "Current Capacity",
      value: `${data.capacity.toFixed(2)} Ah`,
      icon: Battery,
      trend: "stable",
      color: "bg-blue-500"
    },
    {
      title: "State of Health",
      value: `${data.soh.toFixed(1)}%`,
      icon: TrendingDown,
      trend: data.soh > 80 ? "good" : "warning",
      color: data.soh > 80 ? "bg-green-500" : "bg-yellow-500"
    },
    {
      title: "Remaining Useful Life",
      value: `${data.rul} cycles`,
      icon: Clock,
      trend: "declining",
      color: "bg-orange-500"
    },
    {
      title: "Avg Temperature",
      value: `${data.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      trend: "stable",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
