"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useState } from "react";

export function DataUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setUploadStatus('success');
    }, 2000);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Upload Battery Data</h3>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drop your CSV or MAT files here, or click to browse
          </p>
          <Input
            type="file"
            accept=".csv,.mat,.xlsx"
            onChange={handleFileChange}
            className="max-w-xs mx-auto"
          />
        </div>

        {file && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-500" />
            <span className="text-sm">{file.name}</span>
            <span className="text-xs text-gray-500">
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload Data"}
        </Button>

        {uploadStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">File uploaded successfully!</span>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p><strong>Supported formats:</strong> CSV, MAT, XLSX</p>
          <p><strong>Required columns:</strong> Cycle, Capacity, Voltage, Current, Temperature</p>
        </div>
      </div>
    </Card>
  );
}
