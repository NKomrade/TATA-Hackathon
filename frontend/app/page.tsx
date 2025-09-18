"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Cloud, FileText, Zap, Shield, FolderOpen, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api";
import type { FlaskApiResponse } from "@/lib/types";

export default function BatteryDashboard() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isS3Loading, setIsS3Loading] = useState(false)
  const [s3Files, setS3Files] = useState<string[]>([])
  const [showS3Browser, setShowS3Browser] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedAnalytics, setUploadedAnalytics] = useState<FlaskApiResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          startProcessingFlow()
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const startProcessingFlow = () => {
    // Step 2: AI Processing
    setTimeout(() => {
      setCurrentStep(2)
      setIsProcessing(true)
    }, 1000)

    // Step 3: Analytics Dashboard
    setTimeout(() => {
      setCurrentStep(3)
      setIsProcessing(false)
    }, 4000)

    // Redirect to dashboard with analytics data
    setTimeout(() => {
      // Double-check that data is still in storage before redirect
      const storedData = sessionStorage.getItem('batteryAnalytics');
      if (storedData) {
        console.log('Data confirmed in storage before redirect, length:', storedData.length);
        router.push('/dashboard/analytics')
      } else {
        console.error('Data lost from storage before redirect');
        // Try to restore from uploadedAnalytics state
        if (uploadedAnalytics) {
          const dataToStore = JSON.stringify(uploadedAnalytics);
          sessionStorage.setItem('batteryAnalytics', dataToStore);
          localStorage.setItem('batteryAnalytics', dataToStore);
          console.log('Restored data to storage before redirect');
          router.push('/dashboard/analytics')
        } else {
          setUploadError('Data was lost during processing. Please try uploading again.');
        }
      }
    }, 6000)
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload to Flask API
      const result = await apiClient.uploadAndProcessBatteryData(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.analytics) {
        console.log('Upload successful, analytics data received:', result.analytics); // Debug log
        console.log('Analytics data keys:', Object.keys(result.analytics)); // Debug log
        
        // Validate the analytics data structure
        if (result.analytics && typeof result.analytics === 'object') {
          // Store data IMMEDIATELY upon successful upload
          const dataToStore = JSON.stringify(result.analytics);
          sessionStorage.setItem('batteryAnalytics', dataToStore);
          localStorage.setItem('batteryAnalytics', dataToStore);
          localStorage.setItem('batteryAnalyticsTimestamp', Date.now().toString());
          
          console.log('Data stored immediately, length:', dataToStore.length);
          
          // Verify storage worked
          const verification = sessionStorage.getItem('batteryAnalytics');
          if (verification) {
            console.log('Storage verification successful, length:', verification.length);
          } else {
            console.error('Storage verification failed - data not found in sessionStorage');
          }
          
          setUploadedAnalytics(result.analytics);
          setIsUploading(false);
          startProcessingFlow();
        } else {
          throw new Error("Invalid analytics data format received from server");
        }
      } else {
        throw new Error(result.error || "Upload failed - no analytics data received");
      }
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
      console.error("Upload error:", error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  }

  const fetchS3Files = async () => {
    setIsS3Loading(true)
    try {
      // Replace with your actual S3 API endpoint
      const response = await fetch('/api/s3/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setS3Files(data.files || [])
        setShowS3Browser(true)
      } else {
        // Fallback to mock data for demo
        setS3Files([
          'battery-data-2024-01.csv',
          'battery-performance-q1.xlsx',
          'battery-metrics-jan.json',
          'battery-analysis-2024.csv'
        ])
        setShowS3Browser(true)
      }
    } catch (error) {
      console.error('Error fetching S3 files:', error)
      // Fallback to mock data
      setS3Files([
        'battery-data-2024-01.csv',
        'battery-performance-q1.xlsx',
        'battery-metrics-jan.json',
        'battery-analysis-2024.csv'
      ])
      setShowS3Browser(true)
    } finally {
      setIsS3Loading(false)
    }
  }

  const selectS3File = async (fileName: string) => {
    setShowS3Browser(false)
    setUploadError(`S3 integration not implemented for file: ${fileName}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJtIDYwIDAgTCAwIDYwIE0gMCAyMCBMIDIwIDAgTSA0MCA2MCBMIDY0IDQwIiBzdHJva2U9IiMxZTI5M2IiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN2Zz4=')] opacity-20"></div>
      
      {/* Header */}
      {/* <header className="relative flex items-center justify-between px-6 py-6 border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/80">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-[#10a37f] to-[#0d8f6b] rounded-lg transform rotate-45 shadow-lg"></div>
            <div className="absolute inset-0 w-8 h-8 bg-[#10a37f]/20 rounded-lg transform rotate-45 blur-sm animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Smart Battery Management System
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-[#10a37f] hover:text-[#0ea46f] transition-colors cursor-pointer" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#10a37f] rounded-full animate-ping"></div>
          </div>
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors cursor-pointer">
            <User className="w-4 h-4 text-slate-300" />
          </div>
        </div>
      </header> */}

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 mt-28 p-6">
          {/* Hero Section */}
          {/* <div className="text-center mb-12 mt-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-15 h-15 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl transform rotate-12 shadow-2xl flex items-center justify-center">
                  <Activity className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-orange-500/30 rounded-2xl transform rotate-12 blur-lg animate-pulse"></div>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Intelligent Battery Analytics
            </h2>
          </div> */}

          {/* Features Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Performance Analytics</h3>
                <p className="text-sm text-slate-400">Real-time monitoring and performance metrics</p>
              </div>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Predictive Insights</h3>
                <p className="text-sm text-slate-400">AI-powered predictions and recommendations</p>
              </div>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Safety Monitoring</h3>
                <p className="text-sm text-slate-400">Advanced safety alerts and diagnostics</p>
              </div>
            </Card>
          </div> */}

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12 max-w-2xl mx-auto">
            <div className="flex items-center gap-8">
              {/* Step 1 - Battery Dataset */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shadow-lg aspect-square transition-all duration-500 ${
                  currentStep >= 1 ? "bg-[#10a37f] text-white" : "bg-slate-600 text-slate-400"
                }`}>
                  1
                </div>
                <span className={`font-medium transition-colors duration-500 ${
                  currentStep >= 1 ? "text-white" : "text-slate-400"
                }`}>Battery Dataset</span>
              </div>

              <div className={`w-24 h-px transition-all duration-500 ${
                currentStep >= 2 ? "bg-gradient-to-r from-[#10a37f] to-[#10a37f]" : 
                currentStep >= 1 ? "bg-gradient-to-r from-[#10a37f] to-slate-600" : "bg-slate-600"
              }`}></div>

              {/* Step 2 - AI Processing */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shadow-lg aspect-square transition-all duration-500 ${
                  currentStep >= 2 ? "bg-[#10a37f] text-white" : "bg-slate-600 text-slate-400"
                }`}>
                  {currentStep === 2 && isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "2"
                  )}
                </div>
                <span className={`font-medium transition-colors duration-500 ${
                  currentStep >= 2 ? "text-white" : "text-slate-400"
                }`}>
                  AI Processing
                  {currentStep === 2 && isProcessing && (
                    <span className="ml-2 text-xs text-[#10a37f]">Processing...</span>
                  )}
                </span>
              </div>

              <div className={`w-24 h-px transition-all duration-500 ${
                currentStep >= 3 ? "bg-gradient-to-r from-[#10a37f] to-[#10a37f]" : "bg-slate-600"
              }`}></div>

              {/* Step 3 - Analytics Dashboard */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shadow-lg aspect-square transition-all duration-500 ${
                  currentStep >= 3 ? "bg-[#10a37f] text-white" : "bg-slate-600 text-slate-400"
                }`}>
                  3
                </div>
                <span className={`font-medium transition-colors duration-500 ${
                  currentStep >= 3 ? "text-white" : "text-slate-400"
                }`}>
                  Analytics Dashboard
                  {currentStep === 3 && (
                    <span className="ml-2 text-xs text-[#10a37f]">Ready!</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600 border-dashed border-2">
            <div className="p-12">
              {/* Upload Button */}
              <div className="flex justify-center mb-8">
                <div className="flex rounded-sm overflow-hidden shadow-lg">
                  <Button 
                    className="bg-[#10a37f] hover:bg-[#0ea46f] text-white px-12 py-3 rounded-none transition-all"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isS3Loading}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                  <Button
                    className="bg-slate-700 hover:bg-slate-600 px-9 py-3 text-sm text-white flex items-center transition-all rounded-none border-l border-[#6b4423]"
                    onClick={fetchS3Files}
                    disabled={isUploading || isS3Loading}
                  >
                    {isS3Loading ? "Loading..." : "S3"}
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Uploading...</span>
                    <span className="text-[#10a37f]">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#10a37f] to-[#0ea46f] h-2 rounded-full transition-all duration-300 shadow-lg"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Upload Icon and Text */}
              <div
                className={`text-center ${
                  dragActive ? "bg-slate-700/50 border-[#10a37f] border-2 border-dashed" : ""
                } rounded-xl p-8 transition-all duration-300 ${
                  !isUploading ? "hover:bg-slate-700/30" : ""
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Cloud className={`w-16 h-16 transition-colors ${
                      dragActive ? "text-[#10a37f]" : "text-slate-500"
                    }`} />
                    {dragActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-orange-300 animate-bounce" />
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-medium mb-4">
                  {dragActive ? "Drop your file here" : "Upload Battery Dataset"}
                </h3>

                <p className="text-slate-400 mb-6">
                  Drag and drop or{" "}
                  <label className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors inline-flex items-center gap-1">
                    <Upload className="w-4 h-4" />
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      onChange={handleFileSelect} 
                      accept=".csv,.json,.xlsx"
                      disabled={isUploading}
                    />
                  </label>
                </p>

                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    CSV, JSON, XLSX
                  </div>
                  <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                  <div>Max 50MB</div>
                  <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Secure Upload
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 text-red-400 mb-2">
                    <span className="font-medium">Upload Failed</span>
                  </div>
                  <div className="text-sm text-red-300 mb-4 whitespace-pre-line">
                    {uploadError}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => setUploadError(null)}
                      className="text-xs bg-red-500/20 hover:bg-red-500/30"
                    >
                      Try Again
                    </Button>
                    {uploadError.includes('Flask API server is not running') && (
                      <div className="mt-3 p-3 bg-slate-800 rounded text-xs text-slate-300">
                        <div className="font-semibold mb-2">Quick Start Instructions:</div>
                        <div className="text-left space-y-1">
                          <div>1. Open Command Prompt/Terminal</div>
                          <div>2. Navigate to: <code className="bg-slate-700 px-1">d:\Dev\TATA-Hackathon\backend\HFDataPreProcess</code></div>
                          <div>3. Run: <code className="bg-slate-700 px-1">python battery_analytics_api.py</code></div>
                          <div>4. Wait for "Starting Battery Analytics API" message</div>
                          <div>5. Come back and try uploading again</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {uploadProgress === 100 && !isUploading && !uploadError && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">Upload Complete!</span>
                  </div>
                  <p className="text-sm text-green-300">
                    Your battery dataset has been uploaded and analyzed successfully.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* S3 File Browser Modal */}
          {showS3Browser && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="max-w-md w-full bg-slate-800 border-slate-600">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-[#10a37f]" />
                      <h3 className="text-lg font-medium">S3 Battery Datasets</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowS3Browser(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ×
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {s3Files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
                        onClick={() => selectS3File(file)}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-300">{file}</span>
                        </div>
                        <Upload className="w-4 h-4 text-[#10a37f]" />
                      </div>
                    ))}
                  </div>
                  
                  {s3Files.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      No battery datasets found in S3 bucket
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// "use client";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Battery, TrendingUp, Recycle, BarChart3, ArrowRight, Zap, Shield, Brain, Cpu } from "lucide-react";
// import Link from "next/link";

// export default function HomePage() {
//   const [isVisible, setIsVisible] = useState(false);
//   const [batteryLevel, setBatteryLevel] = useState(85);

//   useEffect(() => {
//     setIsVisible(true);
//     const interval = setInterval(() => {
//       setBatteryLevel(prev => prev === 85 ? 92 : 85);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const features = [
//     {
//       icon: Brain,
//       title: "AI-Powered Intelligence",
//       description: "Advanced machine learning algorithms predict battery behavior with 99% accuracy",
//       color: "from-purple-500 to-pink-500"
//     },
//     {
//       icon: TrendingUp,
//       title: "Predictive Analytics",
//       description: "Forecast degradation patterns and optimize performance for maximum lifespan",
//       color: "from-blue-500 to-cyan-500"
//     },
//     {
//       icon: Recycle,
//       title: "Circular Economy",
//       description: "Smart recommendations for second-life applications and sustainable reuse",
//       color: "from-green-500 to-emerald-500"
//     },
//     {
//       icon: Shield,
//       title: "Real-time Monitoring",
//       description: "Continuous health monitoring with instant alerts and safety protocols",
//       color: "from-orange-500 to-red-500"
//     }
//   ];

//   const stats = [
//     { value: "99%", label: "Prediction Accuracy" },
//     { value: "40%", label: "Extended Battery Life" },
//     { value: "60%", label: "Cost Reduction" },
//     { value: "85%", label: "Waste Prevention" }
//   ];

//   return (
//     <div className="min-h-screen bg-black text-white overflow-hidden">
//       {/* Animated Background */}
//       <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
//         <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
//       </div>

//       <div className="relative z-10">
//         {/* Navigation */}
//         <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <Cpu className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xl font-bold">BatteryTwin</span>
//           </div>
//           <div className="hidden md:flex space-x-8 text-gray-300">
//             <Link href="#features" className="hover:text-white transition-colors">Features</Link>
//             <Link href="#analytics" className="hover:text-white transition-colors">Analytics</Link>
//             <Link href="#about" className="hover:text-white transition-colors">About</Link>
//           </div>
//         </nav>

//         {/* Hero Section */}
//         <div className={`max-w-7xl mx-auto px-6 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
//                 <Zap className="w-4 h-4 mr-2" />
//                 Tata InnoVent 2025-26 Finalist
//               </div>
//               <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
//                 The Future of
//                 <br />
//                 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                   Battery Intelligence
//                 </span>
//               </h1>
//               <p className="text-xl text-gray-300 mb-8 leading-relaxed">
//                 Revolutionary digital twin technology that transforms battery lifecycle management through AI-powered analytics, predictive modeling, and intelligent reuse strategies.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Link href="/dashboard">
//                   <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg group">
//                   Launch Dashboard
//                   <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                   </Button>
//                 </Link>
//                 <Button variant="outline" size="lg" className="border-gray-600 px-8 py-4 text-lg text-black">
//                   View Demo
//                 </Button>
//               </div>
//             </div>

//             {/* Interactive Battery Visual */}
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
//               <Card className="relative bg-gray-900/50 border-gray-700 p-8 backdrop-blur-sm">
//                 <div className="text-center mb-6">
//                   <h3 className="text-2xl font-bold mb-2">Live Battery Twin</h3>
//                   <p className="text-gray-400">Real-time digital representation</p>
//                 </div>
                
//                 {/* Battery Visualization */}
//                 <div className="relative mx-auto w-32 h-64 border-4 border-gray-600 rounded-lg bg-gray-800">
//                   <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-8 h-4 bg-gray-600 rounded-t"></div>
//                   <div 
//                     className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t transition-all duration-1000 rounded-md ${
//                       batteryLevel > 80 ? 'from-green-500 to-green-400' : 'from-yellow-500 to-yellow-400'
//                     }`}
//                     style={{ height: `${batteryLevel}%` }}
//                   ></div>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <span className="text-2xl font-bold text-white drop-shadow-lg">
//                       {batteryLevel}%
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-6 space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Health Score</span>
//                     <span className="text-green-400 font-semibold">Excellent</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Cycles</span>
//                     <span className="text-white">1,247 / 3,000</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Temperature</span>
//                     <span className="text-blue-400">23°C</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Predicted Life</span>
//                     <span className="text-purple-400">2.3 years</span>
//                   </div>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         </div>

//         {/* Stats Section */}
//         <div className="max-w-7xl mx-auto px-6 py-16">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
//                   {stat.value}
//                 </div>
//                 <div className="text-gray-400">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Features Section */}
//         <div id="features" className="max-w-7xl mx-auto px-6 py-20">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4">Revolutionary Capabilities</h2>
//             <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//               Harness the power of digital twins and AI to transform how batteries are monitored, analyzed, and reused.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-8">
//             {features.map((feature, index) => (
//               <Card 
//                 key={index} 
//                 className="group bg-gray-900/50 border-gray-800 p-8 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
//               >
//                 <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform`}>
//                   <feature.icon className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-400 leading-relaxed">
//                   {feature.description}
//                 </p>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Technology Showcase */}
//         <div className="max-w-7xl mx-auto px-6 py-20">
//           <Card className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-gray-700 p-12 backdrop-blur-sm">
//             <div className="grid lg:grid-cols-2 gap-12 items-center">
//               <div>
//                 <h2 className="text-4xl font-bold mb-6">
//                   Hybrid Digital Twin Technology
//                 </h2>
//                 <p className="text-gray-300 text-lg mb-6 leading-relaxed">
//                   Our proprietary platform combines physics-based modeling with machine learning to create the most accurate battery digital twins in the industry.
//                 </p>
//                 <ul className="space-y-4 text-gray-300">
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
//                     Real-time state estimation and health monitoring
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
//                     Capacity fade and resistance growth prediction
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
//                     Second-life application optimization
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-orange-500 rounded-full mr-4"></div>
//                     Circular economy integration
//                   </li>
//                 </ul>
//               </div>
              
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-xl"></div>
//                 <div className="relative bg-gray-900/80 rounded-2xl p-8 border border-gray-700">
//                   <div className="flex items-center justify-between mb-6">
//                     <h4 className="text-xl font-semibold">System Overview</h4>
//                     <div className="flex space-x-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="text-green-400 text-sm">Live</span>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-300">Active Batteries</span>
//                       <span className="text-2xl font-bold text-blue-400">2,847</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-300">Data Points/sec</span>
//                       <span className="text-2xl font-bold text-purple-400">15.2K</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-300">ML Models</span>
//                       <span className="text-2xl font-bold text-green-400">24</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-300">Accuracy</span>
//                       <span className="text-2xl font-bold text-orange-400">99.2%</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>
//         {/* Floating Elements */}
//         <div className="fixed top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
//         <div className="fixed bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
//         <div className="fixed top-1/2 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
//       </div>
//     </div>
//   );
// }