"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Play, Settings } from "lucide-react";

export function PredictionPanel() {
  const [selectedBattery, setSelectedBattery] = useState("");
  const [predictionType, setPredictionType] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRunPrediction = async () => {
    setIsRunning(true);
    // Simulate API call
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Prediction Configuration</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Battery</label>
          <Select value={selectedBattery} onValueChange={setSelectedBattery}>
            <SelectTrigger>
              <SelectValue placeholder="Choose battery..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="B0005">Battery B0005</SelectItem>
              <SelectItem value="B0045">Battery B0045</SelectItem>
              <SelectItem value="B0046">Battery B0046</SelectItem>
              <SelectItem value="B0047">Battery B0047</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prediction Type</label>
          <Select value={predictionType} onValueChange={setPredictionType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose prediction type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="capacity">Capacity Degradation</SelectItem>
              <SelectItem value="rul">Remaining Useful Life</SelectItem>
              <SelectItem value="hybrid">Hybrid Model Prediction</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleRunPrediction}
            disabled={!selectedBattery || !predictionType || isRunning}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? "Running..." : "Run Prediction"}
          </Button>
          
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
