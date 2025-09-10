"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Cloud, FileText, Zap, Shield, FolderOpen, Loader2 } from "lucide-react"

export default function BatteryDashboard() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isS3Loading, setIsS3Loading] = useState(false)
  const [s3Files, setS3Files] = useState<string[]>([])
  const [showS3Browser, setShowS3Browser] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
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

    // Redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 6000)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log("File dropped:", e.dataTransfer.files[0])
      simulateUpload()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("File selected:", e.target.files[0])
      simulateUpload()
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
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      // Simulate S3 file import
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            console.log(`S3 file imported: ${fileName}`)
            startProcessingFlow()
            return 100
          }
          return prev + 15
        })
      }, 150)
      
      // Here you would make an API call to import the file from S3
      // const response = await fetch(`/api/s3/import`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ fileName })
      // })
      
    } catch (error) {
      console.error('Error importing S3 file:', error)
      setIsUploading(false)
    }
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
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-[#10a37f]/30 to-[#10a37f]/50 bg-clip-text text-transparent">
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

              {/* Success Message */}
              {uploadProgress === 100 && !isUploading && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">Upload Complete!</span>
                  </div>
                  <p className="text-sm text-green-300">
                    Your battery dataset has been uploaded successfully. Processing will begin shortly.
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
