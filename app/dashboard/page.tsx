'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/dashboard/MetricCard';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  GitBranch, 
  Clock, 
  RefreshCw, 
  Activity, 
  MessageSquare,
  Users,
  TrendingUp
} from 'lucide-react';

const DashboardPage = () => {
  const [isRebuilding, setIsRebuilding] = useState(false);

  const handleRebuildGraph = () => {
    setIsRebuilding(true);
    setTimeout(() => setIsRebuilding(false), 5000);
  };

  const metrics = [
    {
      title: 'Total Entities',
      value: '1,247',
      icon: Database,
      color: 'blue',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Relationships',
      value: '3,891',
      icon: GitBranch,
      color: 'green',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Active Users',
      value: '342',
      icon: Users,
      color: 'purple',
      change: '+23%',
      changeType: 'positive' as const
    },
    {
      title: 'Queries Today',
      value: '1,852',
      icon: MessageSquare,
      color: 'orange',
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      title: 'Response Time',
      value: '0.8s',
      icon: Activity,
      color: 'red',
      change: '-12%',
      changeType: 'positive' as const
    },
    {
      title: 'Success Rate',
      value: '96.2%',
      icon: TrendingUp,
      color: 'emerald',
      change: '+2%',
      changeType: 'positive' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Monitor your knowledge graph and system performance
            </p>
          </div>
          
          <Button
            onClick={handleRebuildGraph}
            disabled={isRebuilding}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRebuilding ? 'animate-spin' : ''}`} />
            {isRebuilding ? 'Rebuilding...' : 'Rebuild Graph'}
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Last Update Info */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-slate-600" />
            <h2 className="text-xl font-semibold text-slate-800">System Status</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Last Graph Update:</span>
                <span className="font-medium text-slate-800" suppressHydrationWarning>
                  {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-600">System Status:</span>
                <span className="inline-flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Operational</span>
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Graph Version:</span>
                <span className="font-medium text-slate-800">v2.1.3</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Server Load:</span>
                <span className="font-medium text-slate-800">23%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Memory Usage:</span>
                <span className="font-medium text-slate-800">4.2GB / 16GB</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Uptime:</span>
                <span className="font-medium text-slate-800">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;