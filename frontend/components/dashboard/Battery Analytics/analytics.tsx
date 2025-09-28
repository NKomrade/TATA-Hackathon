import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { FlaskApiResponse } from "@/lib/types";

interface AnalyticsProps {
  analyticsData: FlaskApiResponse | null;
}

const Analytics: React.FC<AnalyticsProps> = ({ analyticsData }) => {
  // Debug log to see what data we're receiving
  useEffect(() => {
    console.log('Analytics component received data:', analyticsData);
    if (analyticsData) {
      console.log('Data structure validation:');
      console.log('- Has capacity_fade:', !!analyticsData.capacity_fade);
      console.log('- Has capacity_plot:', !!analyticsData.capacity_fade?.capacity_plot);
      console.log('- Has voltage_profile:', !!analyticsData.voltage_profile);
      console.log('- Has voltage_plot:', !!analyticsData.voltage_profile?.voltage_profile_plot);
      console.log('- Has temperature_analysis:', !!analyticsData.temperature_analysis);
      console.log('- Has temp_plot:', !!analyticsData.temperature_analysis?.temperature_vs_capacity_plot);
    }
  }, [analyticsData]);

  // Define graph configurations with real data availability
  const graphs = [
    {
      title: "Capacity Fade Analysis",
      description: "Battery capacity degradation over cycles",
      color: "from-[#10a37f] to-[#0ea46f]",
      hasData: !!(analyticsData?.capacity_fade?.capacity_plot),
      plotData: analyticsData?.capacity_fade?.capacity_plot,
      metrics: analyticsData ? {
        fadeRate: analyticsData.capacity_fade.capacity_fade_rate_per_cycle?.toFixed(4) || "N/A",
        retention: analyticsData.capacity_fade.capacity_retention_percentage?.toFixed(1) || "N/A",
        totalCycles: analyticsData.metadata.total_cycles
      } : null
    },
    {
      title: "Voltage Profile",
      description: "Charge/discharge voltage patterns",
      color: "from-blue-500 to-blue-600",
      hasData: !!(analyticsData?.voltage_profile?.differential_voltage_plot),
      plotData: analyticsData?.voltage_profile?.differential_voltage_plot,
      metrics: analyticsData ? {
        minVoltage: analyticsData.voltage_profile.voltage_stats.min_voltage?.toFixed(2) || "N/A",
        maxVoltage: analyticsData.voltage_profile.voltage_stats.max_voltage?.toFixed(2) || "N/A",
        avgVoltage: analyticsData.voltage_profile.voltage_stats.avg_voltage?.toFixed(2) || "N/A"
      } : null
    },
    {
      title: "Temperature Impact",
      description: "Performance vs temperature correlation",
      color: "from-orange-500 to-red-500",
      hasData: !!(analyticsData?.temperature_analysis?.temperature_vs_capacity_plot),
      plotData: analyticsData?.temperature_analysis?.temperature_vs_capacity_plot,
      metrics: analyticsData ? {
        avgTemp: analyticsData.temperature_analysis.average_temperature?.toFixed(1) || "N/A",
        hasData: analyticsData.temperature_analysis.has_temperature_data,
        range: analyticsData.temperature_analysis.temperature_range ? 
          `${analyticsData.temperature_analysis.temperature_range.min.toFixed(1)}-${analyticsData.temperature_analysis.temperature_range.max.toFixed(1)}°C` : "N/A"
      } : null
    },
    {
      title: "Cycle Life Prediction",
      description: "Expected remaining useful life",
      color: "from-purple-500 to-pink-500",
      hasData: !!(analyticsData?.statistical_metrics?.cycle_life_projection),
      plotData: null, // This would be generated from cycle life projection data
      metrics: analyticsData?.statistical_metrics?.cycle_life_projection ? {
        projectedEOL: analyticsData.statistical_metrics.cycle_life_projection.projected_eol_cycle?.toString() || "N/A",
        confidence: (analyticsData.statistical_metrics.cycle_life_projection.confidence * 100).toFixed(1) || "N/A",
        fadeRate: analyticsData.statistical_metrics.cycle_life_projection.fade_rate?.toFixed(4) || "N/A"
      } : null
    }
  ];

  // Summary Stats - use real data if available, fallback to mock data
  const statsData = analyticsData ? [
    {
      value: analyticsData.battery_health.health_score 
        ? `${Math.round(analyticsData.battery_health.health_score)}%` 
        : "N/A",
      label: "Battery Health",
      color: "text-[#10a37f]"
    },
    {
      value: analyticsData.metadata.total_cycles.toString(),
      label: "Cycles Completed", 
      color: "text-blue-400"
    },
    {
      value: analyticsData.metadata.test_temperature_C 
        ? `${Math.round(analyticsData.metadata.test_temperature_C)}°C`
        : analyticsData.temperature_analysis.average_temperature
        ? `${Math.round(analyticsData.temperature_analysis.average_temperature)}°C`
        : "N/A",
      label: "Avg Temperature",
      color: "text-orange-400"
    },
    {
      value: analyticsData.statistical_metrics.cycle_life_projection?.projected_eol_cycle
        ? analyticsData.statistical_metrics.cycle_life_projection.projected_eol_cycle.toString()
        : "N/A",
      label: "Est. RUL (cycles)",
      color: "text-purple-400"
    }
  ] : [
    { value: "85%", label: "Battery Health", color: "text-[#10a37f]" },
    { value: "1,247", label: "Cycles Completed", color: "text-blue-400" },
    { value: "28°C", label: "Avg Temperature", color: "text-orange-400" },
    { value: "756", label: "Est. RUL (cycles)", color: "text-purple-400" }
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
              <p className="text-sm text-slate-300 mt-1">{graph.description}</p>
            </CardHeader>
            
            <CardContent>
              <div className="h-64 flex flex-col items-center justify-center bg-slate-900/60 rounded-lg border border-slate-700/50 relative overflow-hidden">
                {/* Real Graph or Placeholder */}
                {graph.hasData && graph.plotData ? (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <img 
                      src={`data:image/png;base64,${graph.plotData}`}
                      alt={graph.title}
                      className="max-w-full max-h-full object-contain rounded"
                      onError={(e) => {
                        console.error('Failed to load image for', graph.title, 'Data length:', graph.plotData?.length);
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        // Show error message in place of image
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'text-red-400 text-sm text-center';
                        errorDiv.textContent = 'Failed to load image';
                        target.parentNode?.appendChild(errorDiv);
                      }}
                      onLoad={() => {
                        console.log('Successfully loaded image for', graph.title);
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                    </div>
                    
                    {/* Placeholder Content */}
                    <div className="text-center z-10">
                      <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r ${graph.color} flex items-center justify-center`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
                        </svg>
                      </div>
                      <span className="text-white text-sm font-medium">
                        {analyticsData ? "No Plot Data" : "No Data Available"}
                      </span>
                      {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-slate-500 mt-2">
                          Debug: hasData={graph.hasData.toString()}, plotData={graph.plotData ? `${graph.plotData.length} chars` : 'missing'}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Decorative Elements */}
                <div className="absolute bottom-2 right-2 opacity-10">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${graph.color}`}></div>
                </div>
                <div className="absolute top-2 left-2 opacity-5">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${graph.color}`}></div>
                </div>
              </div>

              {/* Real Data Metrics */}
              {graph.metrics && (
                <div className="mt-4 space-y-2">
                  {graph.title === "Capacity Fade Analysis" && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Fade Rate:</span>
                        <span className="text-white">{graph.metrics.fadeRate}%/cycle</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Retention:</span>
                        <span className="text-[#10a37f]">{graph.metrics.retention}%</span>
                      </div>
                    </>
                  )}
                  {graph.title === "Voltage Profile" && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Min/Max:</span>
                        <span className="text-white">{graph.metrics.minVoltage}V - {graph.metrics.maxVoltage}V</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Average:</span>
                        <span className="text-blue-400">{graph.metrics.avgVoltage}V</span>
                      </div>
                    </>
                  )}
                  {graph.title === "Temperature Impact" && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Avg Temp:</span>
                        <span className="text-white">{graph.metrics.avgTemp}°C</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Range:</span>
                        <span className="text-orange-400">{graph.metrics.range}</span>
                      </div>
                    </>
                  )}
                  {graph.title === "Cycle Life Prediction" && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">EOL Cycle:</span>
                        <span className="text-white">{graph.metrics.projectedEOL}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="text-purple-400">{graph.metrics.confidence}%</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Stats Footer */}
              <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                <span>
                  {analyticsData ? 
                    `Cell: ${analyticsData.metadata.cell_id || 'Unknown'}` : 
                    "Last updated: 2 min ago"
                  }
                </span>
                <span className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${graph.color}`}></div>
                  {graph.hasData ? "Live Data" : "Simulated"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 text-center backdrop-blur-sm">
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Data Source Info */}
      {analyticsData && (
        <div className="mt-6 p-4 bg-slate-800/30 border border-slate-600/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-300">
              <span className="font-medium">Data Source:</span> {analyticsData.metadata.cell_id || "Unknown Battery"}
            </div>
            <div className="text-slate-400">
              Cycles: {analyticsData.metadata.first_cycle_number || 1} - {analyticsData.metadata.last_cycle_number || analyticsData.metadata.total_cycles}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
