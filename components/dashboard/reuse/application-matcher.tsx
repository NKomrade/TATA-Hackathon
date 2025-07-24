"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Application {
  name: string;
  minCapacity: number;
  maxCapacity: number;
  value: number;
}

export function ApplicationMatcher() {
  const [capacity, setCapacity] = useState("");
  const [matches, setMatches] = useState<Application[]>([]);

  const applications: Application[] = [
    { name: "Electric Vehicle", minCapacity: 1.8, maxCapacity: 2.5, value: 25000 },
    { name: "Home Energy Storage", minCapacity: 1.6, maxCapacity: 2.0, value: 18000 },
    { name: "UPS System", minCapacity: 1.4, maxCapacity: 1.8, value: 12000 },
    { name: "Solar Street Light", minCapacity: 1.2, maxCapacity: 1.6, value: 8000 },
    { name: "Emergency Lighting", minCapacity: 1.0, maxCapacity: 1.4, value: 5000 },
  ];

  const findMatches = () => {
    const cap = parseFloat(capacity);
    if (isNaN(cap)) return;

    const matchedApps = applications.filter(
      app => cap >= app.minCapacity && cap <= app.maxCapacity
    );
    setMatches(matchedApps);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Application Matcher</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Battery Capacity (Ah)
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Enter capacity..."
            />
            <Button onClick={findMatches}>Find Matches</Button>
          </div>
        </div>

        {matches.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Suitable Applications</h4>
            <div className="space-y-2">
              {matches.map((app, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{app.name}</span>
                    <span className="text-sm text-green-600">
                      ₹{app.value.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Capacity range: {app.minCapacity} - {app.maxCapacity} Ah
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
