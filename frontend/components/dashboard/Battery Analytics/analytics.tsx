import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Analytics: React.FC = () => {
  const graphs = [
    {
      title: "Capacity Fade Analysis",
      description: "Battery capacity degradation over cycles",
      color: "from-[#10a37f] to-[#0ea46f]"
    },
    {
      title: "Voltage Profile",
      description: "Charge/discharge voltage patterns",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Temperature Impact",
      description: "Performance vs temperature correlation",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Cycle Life Prediction",
      description: "Expected remaining useful life",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="space-y-6">

      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {graphs.map((graph, index) => (
          <Card 
            key={index}
            className="shadow-xl bg-slate-800/60 border-slate-600/50 text-white backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${graph.color} text-white shadow-lg`}></div>
                {graph.title}
              </CardTitle>
              <p className="text-sm text-white mt-1">{graph.description}</p>
            </CardHeader>
            
            <CardContent>
              <div className="h-64 flex flex-col items-center justify-center bg-slate-900/60 rounded-lg border border-slate-700/50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
                
                {/* Graph Placeholder Content */}
                <div className="text-center z-10">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r ${graph.color} flex items-center justify-center`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Graph Visualization</span>
                  <div className="text-xs text-white mt-2">Interactive chart coming soon</div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-2 right-2 opacity-10">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${graph.color}`}></div>
                </div>
                <div className="absolute top-2 left-2 opacity-5">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${graph.color}`}></div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-4 flex justify-between items-center text-xs text-white-500">
                <span>Last updated: 2 min ago</span>
                <span className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${graph.color}`}></div>
                  Active
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-[#10a37f] mb-1">85%</div>
          <div className="text-xs text-white">Battery Health</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-400 mb-1">1,247</div>
          <div className="text-xs text-white">Cycles Completed</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-orange-400 mb-1">28°C</div>
          <div className="text-xs text-white">Avg Temperature</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-purple-400 mb-1">756</div>
          <div className="text-xs text-white">Est. RUL (cycles)</div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
