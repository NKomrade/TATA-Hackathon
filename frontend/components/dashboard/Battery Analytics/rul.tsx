import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Battery, 
  TrendingDown, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap, 
  Activity, 
  Gauge, 
  BarChart3, 
  Target, 
  Thermometer,
  Shield,
  ArrowDown,
  ArrowUp,
  Minus
} from "lucide-react";

const Rul: React.FC = () => {
  const [selectedPrediction, setSelectedPrediction] = useState("conservative");

  const predictionModels = [
    {
      id: "optimistic",
      title: "Optimistic Model",
      description: "Best-case scenario under optimal conditions",
      remainingCycles: 1850,
      remainingTime: "18 months",
      confidence: 78,
      color: "from-[#10a37f] to-[#0ea46f]",
      icon: ArrowUp
    },
    {
      id: "conservative",
      title: "Conservative Model", 
      description: "Realistic prediction based on current trends",
      remainingCycles: 1247,
      remainingTime: "12 months",
      confidence: 92,
      color: "from-blue-500 to-blue-600",
      icon: Minus
    },
    {
      id: "pessimistic",
      title: "Pessimistic Model",
      description: "Worst-case scenario with degraded conditions",
      remainingCycles: 856,
      remainingTime: "8 months",
      confidence: 85,
      color: "from-orange-500 to-red-500",
      icon: ArrowDown
    }
  ];

  const healthMetrics = [
    { 
      label: "Current Capacity", 
      value: "68.4 kWh", 
      percentage: 80.5, 
      status: "good",
      icon: Battery,
      trend: "stable"
    },
    { 
      label: "Voltage Retention", 
      value: "3.85V", 
      percentage: 96.2, 
      status: "excellent",
      icon: Zap,
      trend: "improving"
    },
    { 
      label: "Internal Resistance", 
      value: "1.2 mΩ", 
      percentage: 75.0, 
      status: "fair",
      icon: Activity,
      trend: "declining"
    },
    { 
      label: "Temperature Control", 
      value: "28°C", 
      percentage: 88.7, 
      status: "good",
      icon: Thermometer,
      trend: "stable"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-[#10a37f]";
      case "good": return "text-blue-400";
      case "fair": return "text-orange-400";
      case "poor": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <ArrowUp className="w-3 h-3 text-[#10a37f]" />;
      case "declining": return <ArrowDown className="w-3 h-3 text-red-400" />;
      default: return <Minus className="w-3 h-3 text-slate-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <CheckCircle className="w-4 h-4 text-[#10a37f]" />;
      case "good": return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case "fair": return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-[#10a37f] to-[#0ea46f] rounded-xl">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Remaining Useful Life Prediction</h2>
        </div>
        <p className="text-slate-400">AI-powered battery lifecycle analysis and forecasting</p>
      </div>

      {/* Current Health Overview */}
      <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Gauge className="w-5 h-5 text-[#10a37f]" />
            Battery Health Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">{metric.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(metric.trend)}
                      {getStatusIcon(metric.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-lg font-semibold ${getStatusColor(metric.status)}`}>
                      {metric.value}
                    </span>
                    <span className="text-sm text-slate-500">{metric.percentage}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metric.status === 'excellent' ? 'bg-gradient-to-r from-[#10a37f] to-[#0ea46f]' :
                        metric.status === 'good' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        metric.status === 'fair' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                        'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${metric.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Prediction Models */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {predictionModels.map((model) => {
          const IconComponent = model.icon;
          return (
            <Card 
              key={model.id}
              className={`cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                selectedPrediction === model.id
                  ? "bg-slate-700/80 border-[#10a37f] shadow-lg shadow-[#10a37f]/20 scale-[1.02]"
                  : "bg-slate-800/60 border-slate-600/50 hover:bg-slate-800/80 hover:scale-[1.01]"
              }`}
              onClick={() => setSelectedPrediction(model.id)}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    {model.title}
                  </div>
                </CardTitle>
                <p className="text-xs text-slate-400">{model.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Remaining Cycles */}
                  <div className="text-center">
                    <div className={`text-3xl font-bold bg-gradient-to-r ${model.color} bg-clip-text text-transparent mb-1`}>
                      {model.remainingCycles.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">Remaining Cycles</div>
                  </div>
                  
                  {/* Time Estimate */}
                  <div className="flex items-center justify-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{model.remainingTime}</span>
                  </div>
                  
                  {/* Confidence */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Confidence</span>
                      <span>{model.confidence}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full bg-gradient-to-r ${model.color} transition-all duration-500`}
                        style={{ width: `${model.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Analysis */}
      <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-[#10a37f]" />
            Detailed RUL Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Degradation Factors */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-orange-400" />
                Key Degradation Factors
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Capacity Fade Rate</span>
                  <span className="text-orange-400 font-medium">2.3% per year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Temperature Stress</span>
                  <span className="text-orange-400 font-medium">Moderate</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Cycle Depth Impact</span>
                  <span className="text-red-400 font-medium">High (85% DOD)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Calendar Aging</span>
                  <span className="text-yellow-400 font-medium">3.2 years</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#10a37f]" />
                Life Extension Recommendations
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#10a37f] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-white">Optimize Charging Pattern</div>
                    <div className="text-xs text-slate-400">Reduce DOD to 70% for +15% life extension</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#10a37f] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-white">Temperature Management</div>
                    <div className="text-xs text-slate-400">Keep operating temp below 35°C</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#10a37f] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-white">Maintenance Schedule</div>
                    <div className="text-xs text-slate-400">Quarterly cell balancing recommended</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 text-center">
            <Button className="bg-gradient-to-r from-[#10a37f] to-[#0ea46f] hover:from-[#0ea46f] hover:to-[#10a37f] text-white px-8 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto">
              <Target className="w-4 h-4" />
              Generate RUL Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-[#10a37f] mb-1 flex items-center justify-center gap-1">
            <Battery className="w-6 h-6" />
            1,247
          </div>
          <div className="text-xs text-slate-400">Est. Cycles Left</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-400 mb-1 flex items-center justify-center gap-1">
            <Clock className="w-6 h-6" />
            12M
          </div>
          <div className="text-xs text-slate-400">Time Remaining</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-orange-400 mb-1">92%</div>
          <div className="text-xs text-slate-400">Prediction Confidence</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-green-400 mb-1">80.5%</div>
          <div className="text-xs text-slate-400">Current Health</div>
        </div>
      </div>
    </div>
  );
};

export default Rul;
