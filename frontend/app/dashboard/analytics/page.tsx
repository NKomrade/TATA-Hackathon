"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function AnalyticsPage() {
  const graphs = [
    {
      src: "/g1.jpeg",
      title: "RUL Analysis",
      description: "Remaining Useful Life prediction comparison",
    },
    {
      src: "/g2.jpeg",
      title: "Temperature Trends",
      description: "Min voltage charge analysis over cycles",
    },
    {
      src: "/g3.jpeg",
      title: "Voltage Analysis",
      description: "Max voltage charge patterns",
    },
    {
      src: "/g4.jpeg",
      title: "Degradation Patterns",
      description: "Capacity degradation rate analysis",
    },
  ];

  return (
    <div className="w-full space-y-2 min-h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {graphs.map((graph, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="relative w-full h-79 bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={graph.src}
                  alt={graph.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                {/* <h3 className="font-semibold text-gray-900">{graph.title}</h3>
                <p className="text-sm text-gray-600">{graph.description}</p> */}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
