'use client';
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  TrendingUp,
  BarChart,
  Play,
  CheckCircle,
  Timer,
  Clock,
  Loader2,
  Trophy,
  Activity,
  AlertTriangle
} from "lucide-react";

const modelOptions = [
  { id: "cptransformer", label: "CPTransformer", description: "Transformer-based model" },
  { id: "cpbigru", label: "CPBiGRU", description: "Gated Recurrent Unit" },
  { id: "cpbilstm", label: "CPBiLSTM", description: "Bidirectional Long Short-Term Memory Network" },
  { id: "cplstm", label: "CPLSTM", description: "Long Short-Term Memory Network" },
  { id: "cpmlp", label: "CPMLP", description: "Multi-Layer Perceptron" },
];

const epochOptions = [10, 50, 100, 200, 500];

const modelComparison = [
  {
    model: "CPTransformer",
    mae: 0.748,
    rmse: 0.882,
    mape: 0.0804,
    accuracy10: "0.788",
    accuracy15: "0.90",
    time: "4.433s",
    status: "Completed"
  },
    {
    model: "CPMLP",
    mae: 0.715,
    rmse: 0.901,
    mape: 0.0906,
    accuracy10: "0.586",
    accuracy15: "0.862",
    time: "2.418s",
    status: "Completed"
  },
  {
    model: "CPLSTM",
    mae: 0.696,
    rmse: 0.832,
    mape: 0.0760,
    accuracy10: "0.712",
    accuracy15: "0.752",
    time: "5.21s",
    status: "Completed"
  },
  {
    model: "CPBiGRU",
    mae: null,
    rmse: null,
    mape: null,
    accuracy10: null,
    accuracy15: null,
    time: null,
    status: "Pending"
  },
  {
    model: "CPBiLSTM",
    mae: null,
    rmse: null,
    mape: null,
    accuracy10: null,
    accuracy15: null,
    time: null,
    status: "Pending"
  }
];

const Predictions: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState(modelOptions[0].id);
  const [selectedEpoch, setSelectedEpoch] = useState(epochOptions[0]);
  const [isTraining, setIsTraining] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const selectedModelInfo = modelOptions.find(m => m.id === selectedModel);

  // Simulate training progress
  useEffect(() => {
    if (isTraining && trainingProgress < 100) {
      const interval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 100) {
            setIsTraining(false);
            return 100;
          }
          return prev + 2;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isTraining, trainingProgress]);

  const handleStartTraining = () => {
    setIsTraining(true);
    setShowGraphs(true);
    setTrainingProgress(0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-[#10a37f]" />;
      case "Training":
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-orange-400" />;
      case "Failed":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-[#10a37f] bg-[#10a37f]/10";
      case "Training": return "text-blue-400 bg-blue-400/10";
      case "Pending": return "text-orange-400 bg-orange-400/10";
      case "Failed": return "text-red-400 bg-red-400/10";
      default: return "text-slate-400 bg-slate-400/10";
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-[#10a37f] to-[#0ea46f] rounded-xl">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Predictions Dashboard</h2>
        </div>
        <p className="text-slate-400">Train and compare battery prediction models</p>
      </div>

      {/* Training Configuration */}
      <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart className="w-5 h-5 text-[#10a37f]" />
            Training Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Model Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Select Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="bg-slate-900/80 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {modelOptions.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400">{selectedModelInfo?.description}</p>
            </div>

            {/* Epoch Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Training Epochs</label>
              <Select value={String(selectedEpoch)} onValueChange={(v) => setSelectedEpoch(Number(v))}>
                <SelectTrigger className="bg-slate-900/80 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {epochOptions.map((epoch) => (
                    <SelectItem key={epoch} value={String(epoch)}>
                      {epoch} epochs
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400">Higher epochs = better accuracy</p>
            </div>

            {/* Training Control */}
            <div className="flex flex-col justify-end space-y-2">
              <Button
                className="bg-gradient-to-r from-[#10a37f] to-[#0ea46f] hover:from-[#0ea46f] hover:to-[#10a37f] text-white disabled:opacity-50"
                // onClick={handleStartTraining}
                disabled={isTraining}
              >
                {isTraining ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Training
                  </>
                )}
              </Button>
              {isTraining && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Progress</span>
                    <span>{trainingProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#10a37f] to-[#0ea46f] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${trainingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Graphs */}
      {showGraphs && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#10a37f]" />
                Training Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-slate-900/60 rounded-lg p-4 relative overflow-hidden">
                {/* Mock Loss Curve */}
                <div className="absolute inset-4">
                  <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lossGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#10a37f', stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: '#10a37f', stopOpacity: 0.1 }} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,120 Q50,100 100,80 Q150,70 200,65 Q250,62 300,60"
                      stroke="#10a37f"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M0,120 Q50,100 100,80 Q150,70 200,65 Q250,62 300,60 L300,150 L0,150 Z"
                      fill="url(#lossGradient)"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-2 left-4 text-xs text-slate-400">
                  Epochs: 0 → {selectedEpoch}
                </div>
                <div className="absolute top-2 right-4 text-sm font-semibold text-[#10a37f]">
                  Loss: 0.12
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-400" />
                Model Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-slate-900/60 rounded-lg p-4 relative overflow-hidden">
                {/* Mock Accuracy Curve */}
                <div className="absolute inset-4">
                  <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.1 }} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,130 Q50,120 100,90 Q150,70 200,50 Q250,40 300,35"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M0,130 Q50,120 100,90 Q150,70 200,50 Q250,40 300,35 L300,150 L0,150 Z"
                      fill="url(#accuracyGradient)"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-2 left-4 text-xs text-slate-400">
                  Epochs: 0 → {selectedEpoch}
                </div>
                <div className="absolute top-2 right-4 text-sm font-semibold text-blue-400">
                  Accuracy: 91.2%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Model Comparison Table */}
      <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#10a37f]" />
            Model Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Model</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">MAE</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">MAPE</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">RMSE</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Accuracy(10%)</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Accuracy(15%)</th>
                </tr>
              </thead>
              <tbody>
                {modelComparison.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{row.model}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                        {getStatusIcon(row.status)}
                        {row.status}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{row.mae}</td>
                    <td className="py-3 px-4 text-slate-300">{row.mape}</td>
                    <td className="py-3 px-4 text-slate-300">{row.rmse}</td>
                    <td className="py-3 px-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-slate-400" />
                        {row.time}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{row.accuracy10}</td>
                    <td className="py-3 px-4">{row.accuracy15}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Predictions;
