"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Play, Square } from "lucide-react";
import { useState } from "react";

export function ModelTrainer() {
  const [modelType, setModelType] = useState("");
  const [epochs, setEpochs] = useState(100);
  const [isTraining, setIsTraining] = useState(false);

  const handleStartTraining = () => {
    setIsTraining(true);
    // Simulate training
    setTimeout(() => {
      setIsTraining(false);
    }, 5000);
  };

  const handleStopTraining = () => {
    setIsTraining(false);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Model Training</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Model Type</label>
          <Select value={modelType} onValueChange={setModelType}>
            <SelectTrigger>
              <SelectValue placeholder="Select model type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lstm">LSTM</SelectItem>
              <SelectItem value="xgboost">XGBoost</SelectItem>
              <SelectItem value="simulated_annealing">Simulated Annealing</SelectItem>
              <SelectItem value="ada_boost">AdaBoost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Training Epochs</label>
          <Input
            type="number"
            value={epochs}
            onChange={(e) => setEpochs(Number(e.target.value))}
            min={10}
            max={1000}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleStartTraining}
            disabled={!modelType || isTraining}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            {isTraining ? "Training..." : "Start Training"}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleStopTraining}
            disabled={!isTraining}
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>

        {isTraining && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Training in progress...</p>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
