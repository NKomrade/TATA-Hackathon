'use client';

import { useState } from 'react';
import { Brain, GitBranch, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KnowledgeGraphView = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50/50 to-white rounded-2xl border border-slate-200/60 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          Knowledge Graph
        </h3>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="hover:scale-105 transition-transform duration-200"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Graph Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50 hover:scale-105 transition-transform duration-200">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Total Entities</p>
            <p className="text-lg font-bold text-blue-600">1,247</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/50 hover:scale-105 transition-transform duration-200">
          <div className="p-2 bg-green-100 rounded-lg">
            <GitBranch className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Relations</p>
            <p className="text-lg font-bold text-green-600">3,891</p>
          </div>
        </div>
      </div>

      {/* Placeholder Graph Visualization */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-8 h-48 flex items-center justify-center border-2 border-dashed border-slate-300/60 hover:border-blue-300/60 transition-colors duration-300">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-float">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-700 font-medium">Graph Visualization</p>
          <p className="text-sm text-slate-500">
            Interactive knowledge graph will appear here
          </p>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Recent Updates
        </h4>
        <div className="space-y-2">
          {[
            { text: 'Added 23 new course entities', color: 'blue' },
            { text: 'Updated admission requirements', color: 'green' },
            { text: 'Connected 15 new relationships', color: 'purple' }
          ].map((update, index) => (
            <div key={index} className={`text-xs text-slate-600 p-3 bg-gradient-to-r from-${update.color}-50/50 to-transparent rounded-lg border border-${update.color}-200/30 hover:scale-[1.02] transition-transform duration-200`}>
              {update.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphView;