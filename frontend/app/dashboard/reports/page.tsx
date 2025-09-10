"use client"

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Battery, TrendingUp, Brain, Clock, FileText, Download, Eye, Calendar } from "lucide-react";

export default function Reports() {
  const analyticsData = [
    {
      id: 1,
      title: "Total Batteries Analyzed",
      value: "24",
      bgColor: "bg-blue-500",
      icon: <Battery className="w-6 h-6 text-white" />,
      textColor: "text-blue-500"
    },
    {
      id: 2,
      title: "Average State of Health",
      value: "87.3%",
      bgColor: "bg-green-500",
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      textColor: "text-green-500"
    },
    {
      id: 3,
      title: "Predictions Generated",
      value: "156",
      bgColor: "bg-purple-500",
      icon: <Brain className="w-6 h-6 text-white" />,
      textColor: "text-purple-500"
    },
    {
      id: 4,
      title: "Models Trained",
      value: "8",
      bgColor: "bg-orange-500",
      icon: <Clock className="w-6 h-6 text-white" />,
      textColor: "text-orange-500"
    }
  ];

  const keyInsights = [
    "Battery performance is within expected parameters",
    "3 batteries recommended for second-life applications",
    "Model accuracy improved by 15% in last training cycle"
  ];

  const previousReports = [
    {
      id: 1,
      title: "Monthly Battery Analysis - December 2024",
      date: "2024-12-15",
      type: "Monthly Report",
      size: "2.3 MB",
      batteries: 18,
      status: "Complete"
    },
    {
      id: 2,
      title: "Weekly Performance Summary - Week 50",
      date: "2024-12-08", 
      type: "Weekly Report",
      size: "1.8 MB",
      batteries: 24,
      status: "Complete"
    },
    {
      id: 3,
      title: "Quarterly Health Assessment - Q4 2024",
      date: "2024-12-01",
      type: "Quarterly Report", 
      size: "5.2 MB",
      batteries: 45,
      status: "Complete"
    },
    {
      id: 4,
      title: "Weekly Performance Summary - Week 49",
      date: "2024-12-01",
      type: "Weekly Report",
      size: "1.9 MB", 
      batteries: 22,
      status: "Complete"
    },
    {
      id: 5,
      title: "Monthly Battery Analysis - November 2024",
      date: "2024-11-30",
      type: "Monthly Report",
      size: "2.1 MB",
      batteries: 20,
      status: "Complete"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Analytics Summary Card */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Analytics Summary</h2>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>2 hours ago</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                {analyticsData.map((metric) => (
                  <div key={metric.id} className="flex items-center gap-3">
                    {/* Icon with colored background */}
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
                      {React.cloneElement(metric.icon, { className: "w-5 h-5 text-white" })}
                    </div>
                    
                    {/* Metric details */}
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs mb-1">{metric.title}</p>
                      <p className={`text-2xl font-bold ${metric.textColor}`}>{metric.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Insights Section */}
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Key Insights
                </h3>
                <ul className="space-y-2">
                  {keyInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-300">
                      <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-xs leading-relaxed">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Previous Reports Section */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#10a37f]" />
                  Previous Reports
                </h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white text-xs"
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  View All
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {previousReports.slice(0, 4).map((report) => (
                  <div 
                    key={report.id} 
                    className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#10a37f]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-[#10a37f]" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm mb-1 truncate">{report.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>{new Date(report.date).toLocaleDateString()}</span>
                            <span>{report.batteries} batteries</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-slate-400 hover:text-[#10a37f] hover:bg-[#10a37f]/10 p-1 h-6 w-6"
                          title="View Report"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 p-1 h-6 w-6"
                          title="Download Report"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#10a37f] font-medium">{report.type}</span>
                      <span className="text-xs text-slate-400">{report.size}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Report Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Performance Trends</h3>
              <div className="h-32 bg-slate-700/30 rounded-lg flex items-center justify-center text-slate-400">
                Chart Placeholder
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Health Distribution</h3>
              <div className="h-32 bg-slate-700/30 rounded-lg flex items-center justify-center text-slate-400">
                Chart Placeholder
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}