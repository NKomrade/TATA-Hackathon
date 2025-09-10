import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Reuse: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState("ess");

  const reuseScenarios = [
    {
      id: "ess",
      title: "Energy Storage System",
      description: "Grid-scale energy storage applications",
      suitability: 92,
      color: "from-[#10a37f] to-[#0ea46f]",
      icon: "⚡",
      benefits: ["Grid stabilization", "Peak shaving", "Renewable integration"]
    },
    {
      id: "residential",
      title: "Residential Storage",
      description: "Home energy backup systems",
      suitability: 87,
      color: "from-blue-500 to-blue-600",
      icon: "🏠",
      benefits: ["Backup power", "Solar storage", "Cost savings"]
    },
    {
      id: "transportation",
      title: "Low-Speed Vehicles",
      description: "Golf carts, e-bikes, scooters",
      suitability: 78,
      color: "from-orange-500 to-red-500",
      icon: "🚲",
      benefits: ["Extended range", "Cost effective", "Sustainable transport"]
    },
    {
      id: "industrial",
      title: "Industrial Applications",
      description: "Material handling, backup systems",
      suitability: 84,
      color: "from-purple-500 to-pink-500",
      icon: "🏭",
      benefits: ["Reliable power", "Reduced costs", "Environmental impact"]
    }
  ];

  const batterySpecs = [
    { label: "Original Capacity", value: "85 kWh", status: "baseline" },
    { label: "Current Capacity", value: "68 kWh", status: "current" },
    { label: "Remaining Capacity", value: "80%", status: "good" },
    { label: "Cycle Count", value: "1,247", status: "normal" },
    { label: "State of Health", value: "72%", status: "fair" },
    { label: "Internal Resistance", value: "1.2 mΩ", status: "normal" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-[#10a37f]";
      case "fair": return "text-orange-400";
      case "normal": return "text-blue-400";
      case "current": return "text-purple-400";
      default: return "text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Battery Reuse Modeling</h2>
        <p className="text-slate-400">AI-powered second-life application recommendations</p>
      </div>

      {/* Battery Health Overview */}
      <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#10a37f] to-[#0ea46f]"></div>
            Current Battery Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {batterySpecs.map((spec, index) => (
              <div key={index} className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                <div className="text-xs text-slate-400 mb-1">{spec.label}</div>
                <div className={`text-lg font-semibold ${getStatusColor(spec.status)}`}>
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reuse Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reuseScenarios.map((scenario) => (
          <Card 
            key={scenario.id}
            className={`cursor-pointer transition-all duration-300 backdrop-blur-sm ${
              selectedScenario === scenario.id
                ? "bg-slate-700/80 border-[#10a37f] shadow-lg shadow-[#10a37f]/20 scale-[1.02]"
                : "bg-slate-800/60 border-slate-600/50 hover:bg-slate-800/80 hover:scale-[1.01]"
            }`}
            onClick={() => setSelectedScenario(scenario.id)}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{scenario.icon}</span>
                  <span className="text-lg">{scenario.title}</span>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${scenario.color} bg-clip-text text-transparent`}>
                    {scenario.suitability}%
                  </div>
                  <div className="text-xs text-slate-400">Suitability</div>
                </div>
              </CardTitle>
              <p className="text-sm text-slate-400">{scenario.description}</p>
            </CardHeader>
            
            <CardContent>
              {/* Suitability Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Suitability Score</span>
                  <span>{scenario.suitability}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${scenario.color} transition-all duration-500`}
                    style={{ width: `${scenario.suitability}%` }}
                  ></div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-medium">Key Benefits:</div>
                {scenario.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${scenario.color}`}></div>
                    {benefit}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Scenario Details */}
      {selectedScenario && (
        <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#10a37f] to-[#0ea46f]"></div>
              Recommended Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white mb-3">Performance Projections</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Expected Lifespan</span>
                    <span className="text-white font-medium">5-8 years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Usable Capacity</span>
                    <span className="text-white font-medium">54 kWh</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Efficiency Rating</span>
                    <span className="text-[#10a37f] font-medium">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">ROI Timeline</span>
                    <span className="text-blue-400 font-medium">2.5 years</span>
                  </div>
                </div>
              </div>

              {/* Economic Analysis */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white mb-3">Economic Analysis</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Market Value</span>
                    <span className="text-white font-medium">$15,400</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Refurbishment Cost</span>
                    <span className="text-white font-medium">$3,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Net Value</span>
                    <span className="text-[#10a37f] font-medium">$12,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Environmental Savings</span>
                    <span className="text-green-400 font-medium">2.1 tons CO₂</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 text-center">
              <Button className="bg-gradient-to-r from-[#10a37f] to-[#0ea46f] hover:from-[#0ea46f] hover:to-[#10a37f] text-white px-8 py-2 rounded-lg transition-all duration-300">
                Generate Detailed Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-[#10a37f] mb-1">92%</div>
          <div className="text-xs text-slate-400">Best Match</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-400 mb-1">$12.2K</div>
          <div className="text-xs text-slate-400">Estimated Value</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-orange-400 mb-1">6.5</div>
          <div className="text-xs text-slate-400">Years Lifespan</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-green-400 mb-1">2.1T</div>
          <div className="text-xs text-slate-400">CO₂ Saved</div>
        </div>
      </div>
    </div>
  );
};

export default Reuse;