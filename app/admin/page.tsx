'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Database, 
  RefreshCw, 
  Upload, 
  Download,
  Trash2,
  Plus,
  Edit,
  Users,
  Shield,
  AlertTriangle
} from 'lucide-react';

const AdminPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleProcessFile = () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedFile(null);
    }, 3000);
  };

  const adminActions = [
    {
      title: 'Rebuild Knowledge Graph',
      description: 'Reconstruct the entire knowledge graph from source data',
      icon: Database,
      action: () => setIsProcessing(true),
      color: 'bg-blue-600 hover:bg-blue-700',
      dangerous: false
    },
    {
      title: 'Export Graph Data',
      description: 'Download knowledge graph as JSON or CSV format',
      icon: Download,
      action: () => console.log('Export initiated'),
      color: 'bg-green-600 hover:bg-green-700',
      dangerous: false
    },
    {
      title: 'Clear All Data',
      description: 'Remove all entities and relationships (irreversible)',
      icon: Trash2,
      action: () => console.log('Clear data'),
      color: 'bg-red-600 hover:bg-red-700',
      dangerous: true
    }
  ];

  const systemLogs = [
    { time: '2024-01-15 10:30:25', type: 'INFO', message: 'Knowledge graph rebuilt successfully' },
    { time: '2024-01-15 09:15:12', type: 'WARNING', message: 'High memory usage detected' },
    { time: '2024-01-15 08:45:33', type: 'INFO', message: 'New data source connected' },
    { time: '2024-01-15 08:20:15', type: 'ERROR', message: 'Failed to parse entity: invalid format' },
    { time: '2024-01-15 07:55:42', type: 'INFO', message: 'System backup completed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-100 rounded-full">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Panel</h1>
            <p className="text-slate-600">Manage system settings and knowledge graph</p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-yellow-800 font-medium">Administrator Access Required</p>
              <p className="text-yellow-700 text-sm">
                These actions can affect system performance and data integrity. Use with caution.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload Section */}
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Data Upload
              </h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".json,.csv,.txt"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-slate-400" />
                    <span className="text-slate-600">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-sm text-slate-500">
                      JSON, CSV, or TXT files
                    </span>
                  </label>
                </div>
                
                {selectedFile && (
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                    <span className="text-slate-700">{selectedFile.name}</span>
                    <Button
                      onClick={handleProcessFile}
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Process File'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* System Actions */}
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Actions
              </h2>
              
              <div className="space-y-4">
                {adminActions.map((action, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      action.dangerous 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <action.icon className={`w-5 h-5 ${
                          action.dangerous ? 'text-red-600' : 'text-slate-600'
                        }`} />
                        <div>
                          <h3 className="font-medium text-slate-800">{action.title}</h3>
                          <p className="text-sm text-slate-600">{action.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={action.action}
                        className={`${action.color} text-white`}
                        variant={action.dangerous ? 'destructive' : 'default'}
                      >
                        Execute
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Status:</span>
                  <span className="inline-flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-medium">Online</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">CPU Usage:</span>
                  <span className="font-medium text-slate-800">23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Memory:</span>
                  <span className="font-medium text-slate-800">4.2GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Active Users:</span>
                  <span className="font-medium text-slate-800">342</span>
                </div>
              </div>
            </div>

            {/* Recent Logs */}
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">System Logs</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {systemLogs.map((log, index) => (
                  <div key={index} className="text-xs border-l-2 border-slate-200 pl-3 py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{log.time}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.type === 'ERROR' 
                          ? 'bg-red-100 text-red-700'
                          : log.type === 'WARNING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {log.type}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;