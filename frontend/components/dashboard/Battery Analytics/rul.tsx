import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Battery, Calendar, CheckCircle, Clock, Zap, Activity } from "lucide-react";
import type { FlaskApiResponse } from "@/lib/types";

interface RulProps {
  analyticsData: FlaskApiResponse | null;
}

const models = [
  { id: "bi_lstm", label: "CP Bi LSTM", color: "from-[#10a37f] to-[#0ea46f]" },
  { id: "transform", label: "CP Transform", color: "from-blue-500 to-blue-600" },
  { id: "mlp", label: "CPMLP", color: "from-orange-500 to-orange-600" },
  { id: "bogru", label: "CPBiGRU", color: "from-purple-500 to-purple-600" }
];

const modelPredictions: Record<string, { 
  eol: string; 
  cycles: number; 
  days: number; 
  confidence: number;
  performance: string;
  riskLevel: string;
}> = {
  bi_lstm: { eol: "2026-11-15", cycles: 1247, days: 365, confidence: 92, performance: "High", riskLevel: "Low" },
  transform: { eol: "2026-08-10", cycles: 1180, days: 320, confidence: 89, performance: "Medium", riskLevel: "Medium" },
  mlp: { eol: "2026-05-22", cycles: 1102, days: 270, confidence: 85, performance: "Medium", riskLevel: "High" },
  bogru: { eol: "2026-12-01", cycles: 1300, days: 390, confidence: 94, performance: "Very High", riskLevel: "Very Low" }
};

const Rul: React.FC<RulProps> = ({ analyticsData }) => {
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const prediction = modelPredictions[selectedModel];
  const selectedModelInfo = models.find(m => m.id === selectedModel);

  // Use real data from analyticsData if available
  const realPrediction = analyticsData?.statistical_metrics?.cycle_life_projection;
  const realHealthData = analyticsData?.battery_health;

  // Override prediction with real data if available
  const displayPrediction = realPrediction ? {
    ...prediction,
    cycles: realPrediction.projected_eol_cycle || prediction.cycles,
    confidence: Math.round((realPrediction.confidence || 0.92) * 100),
    eol: realPrediction.projected_eol_cycle 
      ? new Date(Date.now() + (realPrediction.projected_eol_cycle - (analyticsData?.metadata.total_cycles || 0)) * 24 * 60 * 60 * 1000).toLocaleDateString()
      : prediction.eol
  } : prediction;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left Sidebar - Model Selection */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-slate-800/60 border-slate-600/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">Select Model</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="bg-slate-900/80 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800/60 border-slate-600/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-gradient-to-r from-[#10a37f] to-[#0ea46f] text-white text-xs py-2">
                Export Report
              </Button>
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 text-xs py-2">
                Compare Models
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Center - Main Prediction Display */}
        <div className="lg:col-span-3">
          <Card className="bg-slate-800/60 border-slate-600/50 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#10a37f]" />
                {selectedModelInfo?.label} Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Large EOL Display */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2">{displayPrediction.eol}</div>
                <div className="text-lg text-slate-400">Predicted End of Life Date</div>
                
                {/* Confidence Ring */}
                <div className="relative w-24 h-24 mx-auto mt-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-700" />
                    <circle 
                      cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                      className={`text-[#10a37f]`}
                      strokeDasharray={`${displayPrediction.confidence * 2.51} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{displayPrediction.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Horizontal Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-slate-900/60 rounded-lg">
                  <Battery className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-white">{Math.round(displayPrediction.days / 30)}</div>
                  <div className="text-xs text-slate-400">Months Left</div>
                </div>
                <div className="text-center p-3 bg-slate-900/60 rounded-lg">
                  <Activity className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-white">{displayPrediction.performance}</div>
                  <div className="text-xs text-slate-400">Performance</div>
                </div>
                <div className="text-center p-3 bg-slate-900/60 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-white">{displayPrediction.riskLevel}</div>
                  <div className="text-xs text-slate-400">Risk Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Model Performance */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-slate-800/60 border-slate-600/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Accuracy</span>
                <span className="text-sm font-medium text-[#10a37f]">{displayPrediction.confidence}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Risk</span>
                <span className="text-sm font-medium text-orange-400">{displayPrediction.riskLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Status</span>
                <span className="text-sm font-medium text-green-400">Active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-600/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-slate-400">Current Date</div>
              <div className="text-sm text-white font-medium">Sep 10, 2025</div>
              <div className="text-xs text-slate-400 mt-2">Days Remaining</div>
              <div className="text-lg text-[#10a37f] font-bold">{displayPrediction.days}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="bg-slate-800/60 border border-slate-600/50 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#10a37f]" />
              <span className="text-sm text-white">Model: {selectedModelInfo?.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Updated: 2 minutes ago</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Next Update: </span>
            <span className="text-sm text-white">In 30 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rul;
