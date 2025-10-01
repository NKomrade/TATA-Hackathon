const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

import { FLASK_API_BASE, FLASK_API_ENDPOINTS } from "./constants";
import type { FlaskApiResponse, FileUploadResponse } from "./types";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Battery Data API
  async getBatteries() {
    return this.request("/api/v1/batteries");
  }

  async getBattery(id: string) {
    return this.request(`/api/v1/batteries/${id}`);
  }

  async uploadBatteryData(data: FormData) {
    return this.request("/api/v1/batteries/upload", {
      method: "POST",
      body: data,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  // Predictions API
  async runPrediction(batteryId: string, predictionType: string) {
    return this.request("/api/v1/predictions", {
      method: "POST",
      body: JSON.stringify({ battery_id: batteryId, type: predictionType }),
    });
  }

  async getPredictions(batteryId: string) {
    return this.request(`/api/v1/predictions/${batteryId}`);
  }

  // Analytics API
  async getAnalytics(batteryId: string) {
    return this.request(`/api/v1/analytics/${batteryId}`);
  }

  // RUL API
  async calculateRul(batteryId: string, eolThreshold: number) {
    return this.request("/api/v1/rul/calculate", {
      method: "POST",
      body: JSON.stringify({ battery_id: batteryId, eol_threshold: eolThreshold }),
    });
  }

  // Reuse API
  async getRecommendations(batteryId: string) {
    return this.request(`/api/v1/reuse/recommend/${batteryId}`);
  }

  // Training API
  async trainModel(modelType: string, parameters: any) {
    return this.request("/api/v1/models/train", {
      method: "POST",
      body: JSON.stringify({ model_type: modelType, parameters }),
    });
  }

  async getModelStatus(jobId: string) {
    return this.request(`/api/v1/models/status/${jobId}`);
  }

  // Reports API
  async generateReport(reportConfig: any) {
    return this.request("/api/v1/reports/generate", {
      method: "POST",
      body: JSON.stringify(reportConfig),
    });
  }

  async checkFlaskApiHealth(): Promise<boolean> {
    try {
      console.log(`Checking Flask API health at: ${FLASK_API_BASE}${FLASK_API_ENDPOINTS.ROOT}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${FLASK_API_BASE}${FLASK_API_ENDPOINTS.ROOT}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      console.log(`Flask API health check response: ${response.status}`);
      return response.ok;
    } catch (error) {
      console.error("Flask API health check failed:", error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error("Flask API health check timed out - server may not be running");
        } else if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          console.error("Network error - Flask API server is not running or not accessible");
        } else if (error.message.includes('CORS')) {
          console.error("CORS error - Flask API may not have CORS enabled");
        }
      }
      return false;
    }
  }

  // Flask Backend Integration
  async uploadBatteryFile(file: File): Promise<FlaskApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log(`Uploading to Flask API at: ${FLASK_API_BASE}${FLASK_API_ENDPOINTS.UPLOAD}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for upload
      
      const response = await fetch(`${FLASK_API_BASE}${FLASK_API_ENDPOINTS.UPLOAD}`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // Don't set Content-Type header - let browser set it with boundary
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Flask API error response: ${response.status} - ${errorText}`);
        throw new Error(`Flask API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Flask API upload successful');
      return result;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error("Flask API upload timed out");
          throw new Error("Upload timed out - file may be too large or server is slow");
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          console.error("Network error during Flask API upload");
          throw new Error("Network error - check if Flask API is running and accessible at " + FLASK_API_BASE);
        }
      }
      console.error("Flask API request failed:", error);
      throw error;
    }
  }

  async uploadMultipleBatteryFiles(files: File[]): Promise<FlaskApiResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });

    try {
      const response = await fetch(`${FLASK_API_BASE}${FLASK_API_ENDPOINTS.UPLOAD}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Flask API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Flask API request failed:", error);
      throw error;
    }
  }

  // Enhanced upload with analytics processing
  async uploadAndProcessBatteryData(file: File): Promise<FileUploadResponse> {
    try {
      console.log('Starting upload for file:', file.name);
      
      // First check if Flask API is available with detailed error reporting
      console.log('Checking Flask API availability...');
      const isFlaskHealthy = await this.checkFlaskApiHealth();
      if (!isFlaskHealthy) {
        throw new Error("Flask API server is not running. Please start the Flask server at http://localhost:5000 and try again.");
      }

      console.log('Flask API is healthy, proceeding with upload...');
      
      // Upload to Flask API for analytics
      const analytics = await this.uploadBatteryFile(file);
      console.log('Received analytics from Flask API:', analytics);

      // Validate analytics response
      if (!analytics || typeof analytics !== 'object') {
        throw new Error("Invalid analytics response from server");
      }

      // Create battery record in main API (if needed)
      const batteryData = {
        name: analytics.metadata?.cell_id || file.name,
        initialCapacity: analytics.metadata?.nominal_capacity_in_Ah || 0,
        currentCapacity: analytics.capacity_fade?.discharge_capacities?.[analytics.capacity_fade.discharge_capacities.length - 1] || 0,
        cycles: analytics.metadata?.total_cycles || 0,
        soh: analytics.battery_health?.health_score || 0,
        temperature: analytics.metadata?.test_temperature_C || 25,
        status: (analytics.battery_health?.health_score && analytics.battery_health.health_score > 80) ? 'active' : 'degraded'
      };

      console.log('Processed battery data:', batteryData); // Debug log

      return {
        success: true,
        analytics,
        message: "Battery data processed successfully"
      };
    } catch (error) {
      console.error("Upload and process failed:", error);
      
      // Provide more specific error messages
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes('Flask API server is not running')) {
          errorMessage = "Flask API server is not running. Please start the server first:\n\n1. Open terminal/command prompt\n2. Navigate to: d:\\Dev\\TATA-Hackathon\\backend\\HFDataPreProcess\\\n3. Run: python battery_analytics_api.py\n4. Wait for 'Starting Battery Analytics API' message\n5. Try uploading again";
        } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
          errorMessage = "Cannot connect to Flask API server. Please ensure:\n\n1. Flask server is running on localhost:5000\n2. No firewall is blocking the connection\n3. Try restarting the Flask server";
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}

export const apiClient = new ApiClient();
