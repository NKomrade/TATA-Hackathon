"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/dashboard/Battery Analytics/header";
import Analytics from "@/components/dashboard/Battery Analytics/analytics";
import Rul from "@/components/dashboard/Battery Analytics/rul";
import Reuse from "@/components/dashboard/Battery Analytics/reuse";
import type { FlaskApiResponse } from "@/lib/types";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [analyticsData, setAnalyticsData] = useState<FlaskApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<string>("");

  useEffect(() => {
    // Try to load analytics data from multiple sources
    const loadAnalyticsData = () => {
      console.log('Loading analytics data...'); // Debug log
      
      // First try sessionStorage
      let storedData = sessionStorage.getItem('batteryAnalytics');
      let source = 'sessionStorage';
      
      // If not found, try localStorage
      if (!storedData) {
        storedData = localStorage.getItem('batteryAnalytics');
        source = 'localStorage';
      }
      
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          console.log('Loaded analytics data from', source, ':', parsed); // Debug log
          console.log('Data size:', storedData.length, 'characters'); // Debug log
          
          // More flexible validation - just check if it's an object with some expected properties
          if (parsed && typeof parsed === 'object') {
            // Check for any of the expected top-level properties
            const hasValidStructure = 
              parsed.metadata || 
              parsed.capacity_fade || 
              parsed.voltage_profile || 
              parsed.temperature_analysis || 
              parsed.statistical_metrics || 
              parsed.battery_health;
            
            if (hasValidStructure) {
              setAnalyticsData(parsed);
              setDataSource(source);
              console.log('Analytics data successfully loaded and validated'); // Debug log
            } else {
              console.warn('Invalid analytics data structure - missing expected properties:', Object.keys(parsed));
            }
          } else {
            console.warn('Invalid analytics data - not an object:', typeof parsed);
          }
        } catch (error) {
          console.error('Failed to parse stored analytics data:', error);
          console.log('Raw stored data (first 100 chars):', storedData.substring(0, 100));
        }
      } else {
        console.log('No analytics data found in storage');
        
        // Additional debugging
        console.log('SessionStorage keys:', Object.keys(sessionStorage));
        console.log('LocalStorage keys:', Object.keys(localStorage));
        
        // Check if there's any battery-related data
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.toLowerCase().includes('battery')) {
            console.log('Found battery-related key in sessionStorage:', key);
          }
        }
      }
      
      setLoading(false);
    };

    // Add a small delay to ensure any ongoing storage operations complete
    const timeoutId = setTimeout(loadAnalyticsData, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  let content = null;
  if (activeTab === "analytics") content = <Analytics analyticsData={analyticsData} />;
  else if (activeTab === "rul") content = <Rul analyticsData={analyticsData} />;
  else if (activeTab === "reuse") content = <Reuse analyticsData={analyticsData} />;

  if (loading) {
    return (
      <div className="w-full min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10a37f] mx-auto mb-4"></div>
          <p className="text-slate-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Show debug info if no data is available
  if (!analyticsData) {
    return (
      <div className="w-full min-h-full space-y-6">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} analyticsData={analyticsData} />
        <div className="w-full flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Battery Data Available</h3>
            <p className="text-slate-400 mb-4">
              Please upload a battery dataset first to view analytics.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-slate-500 mb-4 p-3 bg-slate-800 rounded space-y-1">
                <div>Debug Info:</div>
                <div>SessionStorage: {typeof window !== 'undefined' && sessionStorage.getItem('batteryAnalytics') ? 'Has data' : 'Empty'}</div>
                <div>LocalStorage: {typeof window !== 'undefined' && localStorage.getItem('batteryAnalytics') ? 'Has data' : 'Empty'}</div>
                <div>SessionStorage length: {typeof window !== 'undefined' ? sessionStorage.length : 'N/A'}</div>
                <div>LocalStorage length: {typeof window !== 'undefined' ? localStorage.length : 'N/A'}</div>
                {typeof window !== 'undefined' && (
                  <div>All SessionStorage keys: {Object.keys(sessionStorage).join(', ') || 'None'}</div>
                )}
              </div>
            )}
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-[#10a37f] hover:bg-[#0ea46f] text-white px-6 py-2 rounded-lg transition-colors"
            >
              Upload Battery Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full space-y-6">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} analyticsData={analyticsData} />
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-slate-500 text-right">
          Data source: {dataSource} | Cell: {analyticsData?.metadata?.cell_id || 'Unknown'} | 
          Has capacity_plot: {analyticsData?.capacity_fade?.capacity_plot ? 'Yes' : 'No'} |
          Has voltage_plot: {analyticsData?.voltage_profile?.voltage_profile_plot ? 'Yes' : 'No'}
        </div>
      )}
      <div className="w-full">{content}</div>
    </div>
  );
}
